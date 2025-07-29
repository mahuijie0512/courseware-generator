import axios from 'axios';
import * as cheerio from 'cheerio';
import { CourseInfo, MediaResource, ConceptDefinition } from '../../../shared/types.js';

export class ResourceSearchService {
  private readonly SEARCH_APIS = {
    // 可以集成多个搜索API
    unsplash: 'https://api.unsplash.com/search/photos',
    giphy: 'https://api.giphy.com/v1/gifs/search',
    youtube: 'https://www.googleapis.com/youtube/v3/search',
    // 中文教育资源
    baidu: 'https://www.baidu.com/s',
    zhihu: 'https://www.zhihu.com/api/v4/search_v3',
    bilibili: 'https://api.bilibili.com/x/web-interface/search/all/v2'
  };

  async searchResources(
    courseInfo: CourseInfo, 
    concepts: ConceptDefinition[]
  ): Promise<MediaResource[]> {
    const resources: MediaResource[] = [];
    
    try {
      // 构建搜索关键词
      const keywords = this.buildSearchKeywords(courseInfo, concepts);
      
      // 搜索图片资源
      const images = await this.searchImages(keywords);
      resources.push(...images);
      
      // 搜索动图资源
      const gifs = await this.searchGifs(keywords);
      resources.push(...gifs);
      
      // 搜索视频资源
      const videos = await this.searchVideos(keywords);
      resources.push(...videos);
      
      // 按相关性排序
      return resources.sort((a, b) => b.relevanceScore - a.relevanceScore);
      
    } catch (error) {
      console.error('搜索资源失败:', error);
      return [];
    }
  }

  private buildSearchKeywords(courseInfo: CourseInfo, concepts: ConceptDefinition[]): string[] {
    const keywords = [
      courseInfo.title,
      courseInfo.subject.name,
      ...concepts.map(c => c.term)
    ];
    
    // 添加教育相关关键词
    const educationalKeywords = ['教学', '示意图', '原理图', '演示'];
    
    return [...keywords, ...educationalKeywords];
  }

  private async searchImages(keywords: string[]): Promise<MediaResource[]> {
    // 这里可以集成Unsplash API或其他图片搜索服务
    // 暂时返回模拟数据
    return keywords.slice(0, 3).map((keyword, index) => ({
      id: `image-${index + 1}`,
      type: 'image' as const,
      title: `${keyword}示意图`,
      url: `https://via.placeholder.com/800x600?text=${encodeURIComponent(keyword)}`,
      source: 'Unsplash',
      quality: 'high' as const,
      relevanceScore: 0.8 - index * 0.1
    }));
  }

  private async searchGifs(keywords: string[]): Promise<MediaResource[]> {
    // 集成Giphy API搜索动图
    return keywords.slice(0, 2).map((keyword, index) => ({
      id: `gif-${index + 1}`,
      type: 'animation' as const,
      title: `${keyword}动画演示`,
      url: `https://media.giphy.com/media/example${index + 1}/giphy.gif`,
      source: 'Giphy',
      quality: 'medium' as const,
      relevanceScore: 0.7 - index * 0.1
    }));
  }

  private async searchVideos(keywords: string[]): Promise<MediaResource[]> {
    // 集成YouTube API搜索教育视频
    if (!process.env.YOUTUBE_API_KEY) {
      // 返回模拟数据
      return keywords.slice(0, 2).map((keyword, index) => ({
        id: `video-${index + 1}`,
        type: 'video' as const,
        title: `${keyword}教学视频`,
        url: `https://www.youtube.com/watch?v=example${index + 1}`,
        source: 'YouTube',
        quality: 'high' as const,
        relevanceScore: 0.9 - index * 0.1
      }));
    }

    try {
      const searchResults: MediaResource[] = [];
      
      for (const keyword of keywords.slice(0, 3)) {
        const response = await axios.get(this.SEARCH_APIS.youtube, {
          params: {
            part: 'snippet',
            q: `${keyword} 高中 教学 讲解`,
            type: 'video',
            maxResults: 2,
            key: process.env.YOUTUBE_API_KEY,
            regionCode: 'CN',
            relevanceLanguage: 'zh'
          }
        });

        const videos = response.data.items.map((item: any, index: number) => ({
          id: `youtube-${item.id.videoId}`,
          type: 'video' as const,
          title: item.snippet.title,
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
          source: 'YouTube',
          quality: 'high' as const,
          relevanceScore: 0.9 - searchResults.length * 0.05
        }));

        searchResults.push(...videos);
      }

      return searchResults;
    } catch (error) {
      console.error('YouTube搜索失败:', error);
      return [];
    }
  }

  // 实际API集成方法
  private async searchUnsplashImages(query: string): Promise<MediaResource[]> {
    if (!process.env.UNSPLASH_ACCESS_KEY) {
      return [];
    }

    try {
      const response = await axios.get(this.SEARCH_APIS.unsplash, {
        params: {
          query: query + ' education diagram',
          per_page: 5,
          orientation: 'landscape'
        },
        headers: {
          'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
        }
      });

      return response.data.results.map((photo: any, index: number) => ({
        id: `unsplash-${photo.id}`,
        type: 'image' as const,
        title: photo.alt_description || query,
        url: photo.urls.regular,
        source: 'Unsplash',
        quality: 'high' as const,
        relevanceScore: 0.8 - index * 0.05
      }));
    } catch (error) {
      console.error('Unsplash搜索失败:', error);
      return [];
    }
  }
}