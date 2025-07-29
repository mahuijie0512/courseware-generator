import express, { Request, Response } from 'express';
import { CoursewareGenerator } from '../services/coursewareGenerator.js';
import { GenerationRequest, GenerationResponse } from '../../../shared/types.js';

const router = express.Router();
const coursewareGenerator = new CoursewareGenerator();

// 存储生成任务状态
const generationTasks = new Map<string, GenerationResponse>();

// 生成课件
router.post('/generate', async (req: Request, res: Response) => {
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

// 查询生成状态
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
    return res.status(400).json({
      error: '任务尚未完成',
      status: task.status,
      progress: task.progress
    });
  }

  res.json({
    taskId,
    content: task.content,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt
  });
});

// 获取支持的科目列表
router.get('/subjects', (req, res) => {
  const subjects = [
    { id: 'math', name: '数学', icon: '📐' },
    { id: 'physics', name: '物理', icon: '⚛️' },
    { id: 'chemistry', name: '化学', icon: '🧪' },
    { id: 'biology', name: '生物', icon: '🧬' },
    { id: 'chinese', name: '语文', icon: '📚' },
    { id: 'english', name: '英语', icon: '🌍' },
    { id: 'history', name: '历史', icon: '📜' },
    { id: 'geography', name: '地理', icon: '🌏' },
    { id: 'politics', name: '政治', icon: '⚖️' }
  ];

  res.json(subjects);
});

// 获取年级列表
router.get('/grades', (req, res) => {
  const grades = [
    { id: 'grade-10', name: '高一', level: 10 },
    { id: 'grade-11', name: '高二', level: 11 },
    { id: 'grade-12', name: '高三', level: 12 }
  ];

  res.json(grades);
});

// 获取册数列表
router.get('/volumes', (req, res) => {
  const volumes = [
    { id: 'volume-1', name: '上册', semester: 'first' },
    { id: 'volume-2', name: '下册', semester: 'second' }
  ];

  res.json(volumes);
});

// 异步生成课件的函数
async function generateCoursewareAsync(taskId: string, request: GenerationRequest) {
  const task = generationTasks.get(taskId);
  if (!task) return;

  try {
    // 更新状态为处理中
    task.status = 'processing';
    task.progress = 10;
    task.updatedAt = new Date();

    console.log(`开始生成课件: ${request.courseInfo.title}`);

    // 生成课件内容
    const content = await coursewareGenerator.generateCourseware(
      request.courseInfo,
      request.options
    );

    // 更新进度
    task.progress = 90;
    task.updatedAt = new Date();

    // 完成生成
    task.status = 'completed';
    task.progress = 100;
    task.content = content;
    task.updatedAt = new Date();

    console.log(`课件生成完成: ${request.courseInfo.title}`);

  } catch (error) {
    console.error('生成课件失败:', error);
    
    task.status = 'failed';
    task.error = error instanceof Error ? error.message : '未知错误';
    task.updatedAt = new Date();
  }
}

export default router;