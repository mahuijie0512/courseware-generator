import mongoose from 'mongoose';
import Redis from 'redis';

// MongoDB连接配置
export const connectMongoDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/courseware-generator';
    
    await mongoose.connect(mongoUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ MongoDB连接成功');
    
    // 监听连接事件
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB连接错误:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB连接断开');
    });
    
  } catch (error) {
    console.error('❌ MongoDB连接失败:', error);
    process.exit(1);
  }
};

// Redis连接配置
export const connectRedis = async () => {
  try {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    
    const client = Redis.createClient({
      url: redisUrl,
      retry_strategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      }
    });
    
    client.on('error', (err) => {
      console.error('❌ Redis连接错误:', err);
    });
    
    client.on('connect', () => {
      console.log('✅ Redis连接成功');
    });
    
    await client.connect();
    return client;
    
  } catch (error) {
    console.error('❌ Redis连接失败:', error);
    return null;
  }
};

// 数据库健康检查
export const checkDatabaseHealth = async () => {
  const health = {
    mongodb: false,
    redis: false,
    timestamp: new Date().toISOString()
  };
  
  try {
    // 检查MongoDB
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.db.admin().ping();
      health.mongodb = true;
    }
  } catch (error) {
    console.error('MongoDB健康检查失败:', error);
  }
  
  try {
    // 检查Redis（如果已连接）
    const redisClient = Redis.createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
    await redisClient.connect();
    await redisClient.ping();
    health.redis = true;
    await redisClient.disconnect();
  } catch (error) {
    console.error('Redis健康检查失败:', error);
  }
  
  return health;
};