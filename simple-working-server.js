import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// 基础路由
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: '高中课件生成器API服务正常运行',
    timestamp: new Date().toISOString(),
    version: '1.0.2'
  });
});

app.get('/api/subjects', (req, res) => {
  res.json([
    { id: 'math', name: '数学' },
    { id: 'physics', name: '物理' },
    { id: 'chemistry', name: '化学' },
    { id: 'biology', name: '生物' }
  ]);
});

app.get('/api/grades', (req, res) => {
  res.json([
    { id: 'grade1', name: '高一' },
    { id: 'grade2', name: '高二' },
    { id: 'grade3', name: '高三' }
  ]);
});

app.get('/api/volumes', (req, res) => {
  res.json([
    { id: 'volume1', name: '上册' },
    { id: 'volume2', name: '下册' }
  ]);
});

// 课件生成 - 最简单版本
app.post('/api/generate', (req, res) => {
  console.log('POST /api/generate 请求体:', req.body);
  
  // 直接返回成功，不做复杂验证
  res.json({
    success: true,
    message: '课件生成成功！',
    data: {
      id: Date.now().toString(),
      subject: req.body.subject || 'math',
      grade: req.body.grade || 'grade1', 
      volume: req.body.volume || 'volume1',
      title: req.body.title || '测试课程',
      content: {
        overview: '这是一个测试课程的概述内容。',
        concepts: ['核心概念1', '核心概念2', '核心概念3'],
        formulas: ['重要公式1', '重要公式2'],
        diagrams: ['示意图1', '示意图2'],
        exercises: ['练习题1', '练习题2', '练习题3']
      },
      createdAt: new Date().toISOString()
    }
  });
});

app.listen(PORT, () => {
  console.log(`✅ 简化服务器运行在端口 ${PORT}`);
  console.log(`🔗 健康检查: http://localhost:${PORT}/api/health`);
});