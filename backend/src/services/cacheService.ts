import Redis from 'redis';
import { logger } from '../utils/logger.js';

export class CacheService {
  private static instance: CacheService;
  private client: Redis.RedisClientType | null = null;
  private prefix: string;
  private defaultTTL: number;

  private constructor() {
    this.prefix = process.env.REDIS_PREFIX || 'courseware:';
    this.defaultTTL = parseInt(process.env.CACHE_TTL || '3600');
    this.connect();
  }

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  private async connect() {
    try {
      const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
      this.client = Redis.createClient({ url: redisUrl });
      
      this.client.on('error', (err) => {
        logger.error('Redis连接错误', { error: err.message });
      });

      this.client.on('connect', () => {
        logger.info('Redis连接成功');
      });

      await this.client.connect();
    } catch (error) {
      logger.error('Redis连接失败', { error });
      this.client = null;
    }
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`;
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.client) return null;

    try {
      const value = await this.client.get(this.getKey(key));
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('缓存读取失败', { key, error });
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    if (!this.client) return false;

    try {
      const serialized = JSON.stringify(value);
      const expiry = ttl || this.defaultTTL;
      await this.client.setEx(this.getKey(key), expiry, serialized);
      return true;
    } catch (error) {
      logger.error('缓存写入失败', { key, error });
      return false;
    }
  }

  async del(key: string): Promise<boolean> {
    if (!this.client) return false;

    try {
      await this.client.del(this.getKey(key));
      return true;
    } catch (error) {
      logger.error('缓存删除失败', { key, error });
      return false;
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.client) return false;

    try {
      const result = await this.client.exists(this.getKey(key));
      return result === 1;
    } catch (error) {
      logger.error('缓存检查失败', { key, error });
      return false;
    }
  }

  // 课件生成相关的缓存方法
  async getCoursewareCache(courseInfo: any, options: any): Promise<any> {
    const cacheKey = this.generateCoursewareKey(courseInfo, options);
    return await this.get(cacheKey);
  }

  async setCoursewareCache(courseInfo: any, options: any, content: any): Promise<boolean> {
    const cacheKey = this.generateCoursewareKey(courseInfo, options);
    // 课件内容缓存24小时
    return await this.set(cacheKey, content, 86400);
  }

  private generateCoursewareKey(courseInfo: any, options: any): string {
    const keyData = {
      subject: courseInfo.subject.id,
      grade: courseInfo.grade.id,
      volume: courseInfo.volume.id,
      title: courseInfo.title,
      options: options
    };
    
    // 生成基于内容的哈希键
    const hash = Buffer.from(JSON.stringify(keyData)).toString('base64');
    return `courseware:${hash}`;
  }

  // 资源搜索缓存
  async getResourceCache(keywords: string[]): Promise<any> {
    const cacheKey = `resources:${keywords.sort().join(':')}`;
    return await this.get(cacheKey);
  }

  async setResourceCache(keywords: string[], resources: any): Promise<boolean> {
    const cacheKey = `resources:${keywords.sort().join(':')}`;
    // 资源搜索结果缓存6小时
    return await this.set(cacheKey, resources, 21600);
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.disconnect();
      logger.info('Redis连接已断开');
    }
  }
}

export const cacheService = CacheService.getInstance();