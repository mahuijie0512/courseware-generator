import OpenAI from 'openai';
import { CourseInfo, CourseContent, GenerationOptions } from '../../../shared/types.js';
import { ResourceSearchService } from './resourceSearch.js';
import { DiagramGenerator } from './diagramGenerator.js';
import { cacheService } from './cacheService.js';
import { logger } from '../utils/logger.js';

export class CoursewareGenerator {
  private openai: OpenAI;
  private resourceSearch: ResourceSearchService;
  private diagramGenerator: DiagramGenerator;

  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY环境变量未设置');
    }
    
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.resourceSearch = new ResourceSearchService();
    this.diagramGenerator = new DiagramGenerator();
  }

  async generateCourseware(
    courseInfo: CourseInfo, 
    options: GenerationOptions
  ): Promise<CourseContent> {
    logger.info(`开始生成课件: ${courseInfo.title}`, { courseInfo, options });
    
    // 检查缓存
    const cachedContent = await cacheService.getCoursewareCache(courseInfo, options);
    if (cachedContent) {
      logger.info(`使用缓存的课件内容: ${courseInfo.title}`);
      return cachedContent;
    }

    try {
      // 1. 生成课程概述
      logger.debug('生成课程概述');
      const overview = await this.generateOverview(courseInfo);
      
      // 2. 生成概念和定义
      logger.debug('生成概念和定义');
      const concepts = await this.generateConcepts(courseInfo);
      
      // 3. 生成公式（如果适用）
      logger.debug('生成公式');
      const formulas = await this.generateFormulas(courseInfo);
      
      // 4. 生成或搜索示意图
      logger.debug('生成示意图');
      const diagrams = options.generateDiagrams 
        ? await this.diagramGenerator.generateDiagrams(courseInfo, concepts)
        : [];
      
      // 5. 搜索网络资源
      logger.debug('搜索网络资源');
      const resources = options.searchOnlineResources
        ? await this.resourceSearch.searchResources(courseInfo, concepts)
        : [];
      
      // 6. 生成交互组件
      logger.debug('生成交互组件');
      const interactions = options.includeInteractions
        ? await this.generateInteractions(courseInfo, concepts)
        : [];

      const content: CourseContent = {
        overview,
        concepts,
        formulas,
        diagrams,
        interactions,
        resources
      };

      // 缓存生成的内容
      await cacheService.setCoursewareCache(courseInfo, options, content);
      
      logger.info(`课件生成完成: ${courseInfo.title}`, { 
        conceptsCount: concepts.length,
        formulasCount: formulas.length,
        diagramsCount: diagrams.length,
        resourcesCount: resources.length,
        interactionsCount: interactions.length
      });

      return content;
    } catch (error) {
      logger.error(`课件生成失败: ${courseInfo.title}`, { error, courseInfo });
      throw error;
    }
  }

  private async generateOverview(courseInfo: CourseInfo): Promise<string> {
    const prompt = `
请为以下高中课程生成一个简洁而全面的概述：

科目：${courseInfo.subject.name}
年级：${courseInfo.grade.name}
册数：${courseInfo.volume.name}
课程标题：${courseInfo.title}

要求：
1. 200-300字的概述
2. 包含学习目标和重点
3. 说明与前后课程的联系
4. 使用适合高中生的语言
`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    return response.choices[0]?.message?.content || '';
  }

  private async generateConcepts(courseInfo: CourseInfo) {
    const prompt = `
为以下高中课程提取和定义关键概念：

科目：${courseInfo.subject.name}
课程标题：${courseInfo.title}

请返回JSON格式，包含5-8个核心概念，每个概念包括：
- term: 术语名称
- definition: 清晰的定义
- examples: 2-3个具体例子
- relatedConcepts: 相关概念列表

确保定义准确、易懂，适合高中生理解。
`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
    });

    try {
      const content = response.choices[0]?.message?.content || '[]';
      const concepts = JSON.parse(content);
      return concepts.map((concept: any, index: number) => ({
        id: `concept-${index + 1}`,
        ...concept
      }));
    } catch (error) {
      console.error('解析概念定义失败:', error);
      return [];
    }
  }

  private async generateFormulas(courseInfo: CourseInfo) {
    // 只为理科科目生成公式
    const scienceSubjects = ['数学', '物理', '化学'];
    if (!scienceSubjects.includes(courseInfo.subject.name)) {
      return [];
    }

    const prompt = `
为以下理科课程提取重要公式：

科目：${courseInfo.subject.name}
课程标题：${courseInfo.title}

请返回JSON格式，包含相关公式，每个公式包括：
- name: 公式名称
- expression: 数学表达式
- description: 公式说明
- variables: 变量列表（symbol, name, unit, description）
- applications: 应用场景

确保公式准确，变量定义清晰。
`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    });

    try {
      const content = response.choices[0]?.message?.content || '[]';
      const formulas = JSON.parse(content);
      return formulas.map((formula: any, index: number) => ({
        id: `formula-${index + 1}`,
        ...formula
      }));
    } catch (error) {
      console.error('解析公式失败:', error);
      return [];
    }
  }

  private async generateInteractions(courseInfo: CourseInfo, concepts: any[]) {
    const prompt = `
基于以下课程信息和概念，设计3-5个交互式学习组件：

课程：${courseInfo.title}
概念：${concepts.map(c => c.term).join(', ')}

请返回JSON格式，每个交互组件包括：
- type: 'quiz' | 'simulation' | 'exercise' | 'experiment'
- title: 组件标题
- content: 具体内容设计
- difficulty: 'easy' | 'medium' | 'hard'

设计要有趣且教育性强。
`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
    });

    try {
      const content = response.choices[0]?.message?.content || '[]';
      const interactions = JSON.parse(content);
      return interactions.map((interaction: any, index: number) => ({
        id: `interaction-${index + 1}`,
        ...interaction
      }));
    } catch (error) {
      console.error('解析交互组件失败:', error);
      return [];
    }
  }
}