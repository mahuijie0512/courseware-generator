import express, { Request, Response } from 'express';
import { CoursewareGenerator } from '../services/coursewareGenerator.js';
import { GenerationRequest, GenerationResponse } from '../../../shared/types.js';

const router = express.Router();
const coursewareGenerator = new CoursewareGenerator();

// 存储生成任务状态
const generationTasks = new Map<string, GenerationResponse>();

// 简化的生成课件端点 - 兼容前端的简单请求格式
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { courseInfo } = req.body;

    // 验证请求数据
    if (!courseInfo || !courseInfo.title) {
      return res.status(400).json({
        success: false,
        message: '缺少必要的课程信息'
      });
    }

    // 模拟课件生成结果
    const mockResult = {
      success: true,
      message: '课件生成成功',
      data: {
        id: `courseware-${Date.now()}`,
        subject: courseInfo.subject || 'math',
        grade: courseInfo.grade || 'grade1',
        volume: courseInfo.volume || '上册',
        title: courseInfo.title,
        content: {
          overview: `这是关于"${courseInfo.title}"的课程概述。本课程将深入探讨相关概念、原理和应用，帮助学生建立扎实的理论基础和实践能力。`,
          concepts: [
            '基本概念和定义',
            '核心理论和原理',
            '重要性质和特征',
            '应用场景和实例',
            '相关知识点联系'
          ],
          formulas: [
            '基本公式: f(x) = ax + b',
            '重要定理: (a + b)² = a² + 2ab + b²',
            '核心方程: ax² + bx + c = 0',
            '关键不等式: |a + b| ≤ |a| + |b|'
          ],
          diagrams: [
            '概念关系图',
            '流程示意图',
            '结构框架图',
            '应用场景图'
          ],
          exercises: [
            '基础练习：理解基本概念',
            '应用练习：解决实际问题',
            '综合练习：知识点整合',
            '拓展练习：深入思考'
          ]
        },
        createdAt: new Date().toISOString(),
        university: '清华大学',
        motto: '自强不息，厚德载物'
      }
    };

    res.json(mockResult);

  } catch (error) {
    console.error('生成课件失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误，请稍后重试'
    });
  }
});

// 原有的复杂生成端点
router.post('/generate-advanced', async (req: Request, res: Response) => {
  try {
    const request: GenerationRequest = req.body;

    // 验证请求数据
    if (!request.courseInfo || !request.courseInfo.title) {
      return res.status(400).json({
        error: '缺少必要的课程信息'
      });
    }

    // 创建生成任务
    const taskId = `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const task: GenerationResponse = {
      id: taskId,
      status: 'pending',
      progress: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    generationTasks.set(taskId, task);

    // 异步生成课件
    generateCoursewareAsync(taskId, request);

    res.json({
      taskId,
      status: 'pending',
      message: '课件生成任务已启动'
    });

  } catch (error) {
    console.error('生成课件失败:', error);
    res.status(500).json({
      error: '服务器内部错误'
    });
  }
});

// 获取任务状态
router.get('/status/:taskId', (req: Request, res: Response) => {
  const { taskId } = req.params;
  const task = generationTasks.get(taskId);
  
  if (!task) {
    return res.status(404).json({
      error: '任务不存在'
    });
  }
  
  res.json(task);
});

// 获取生成结果
router.get('/result/:taskId', (req: Request, res: Response) => {
  const { taskId } = req.params;
  const task = generationTasks.get(taskId);
  
  if (!task) {
    return res.status(404).json({
      error: '任务不存在'
    });
  }
  
  if (task.status !== 'completed') {
    return res.status(202).json({
      message: '任务尚未完成',
      status: task.status,
      progress: task.progress
    });
  }
  
  res.json({
    taskId,
    result: task.result,
    completedAt: task.updatedAt
  });
});

// 异步生成课件函数
async function generateCoursewareAsync(taskId: string, request: GenerationRequest) {
  try {
    const task = generationTasks.get(taskId);
    if (!task) return;

    // 更新任务状态
    task.status = 'processing';
    task.progress = 10;
    task.updatedAt = new Date();

    // 模拟生成过程
    await new Promise(resolve => setTimeout(resolve, 2000));
    task.progress = 50;
    task.updatedAt = new Date();

    await new Promise(resolve => setTimeout(resolve, 2000));
    task.progress = 80;
    task.updatedAt = new Date();

    // 生成完成
    task.status = 'completed';
    task.progress = 100;
    task.result = {
      courseware: {
        title: request.courseInfo.title,
        content: '生成的课件内容...'
      }
    };
    task.updatedAt = new Date();

  } catch (error) {
    const task = generationTasks.get(taskId);
    if (task) {
      task.status = 'failed';
      task.error = error instanceof Error ? error.message : '未知错误';
      task.updatedAt = new Date();
    }
  }
}

// 获取学科列表
router.get('/subjects', (req, res) => {
  res.json([
    { id: 'math', name: '数学', icon: '🔢' },
    { id: 'physics', name: '物理', icon: '⚛️' },
    { id: 'chemistry', name: '化学', icon: '🧪' },
    { id: 'biology', name: '生物', icon: '🧬' },
    { id: 'chinese', name: '语文', icon: '📚' },
    { id: 'english', name: '英语', icon: '🌍' },
    { id: 'history', name: '历史', icon: '📜' },
    { id: 'geography', name: '地理', icon: '🌏' },
    { id: 'politics', name: '政治', icon: '🏛️' }
  ]);
});

// 获取年级列表
router.get('/grades', (req, res) => {
  res.json([
    { id: 'grade1', name: '高一', level: 1 },
    { id: 'grade2', name: '高二', level: 2 },
    { id: 'grade3', name: '高三', level: 3 }
  ]);
});

// 获取册别列表
router.get('/volumes', (req, res) => {
  res.json([
    { id: 'volume1', name: '上册', semester: 'first' },
    { id: 'volume2', name: '下册', semester: 'second' }
  ]);
});

export default router;