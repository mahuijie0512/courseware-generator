import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

// 基础中间件
app.use(cors());
app.use(express.json());

// 测试路由
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: '测试服务器运行正常',
    timestamp: new Date().toISOString()
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

// 简化的课件生成
app.post('/api/generate', (req, res) => {
  console.log('收到POST请求:', req.body);
  
  const { subject, grade, volume, title } = req.body;
  
  if (!subject || !grade || !volume || !title) {
    return res.status(400).json({
      success: false,
      message: '缺少必填字段'
    });
  }

  // 立即返回成功响应
  res.json({
    success: true,
    message: '课件生成成功',
    data: {
      id: Date.now().toString(),
      subject,
      grade,
      volume,
      title,
      content: {
        overview: `这是${title}的课程概述`,
        concepts: ['概念1', '概念2', '概念3'],
        formulas: ['公式1', '公式2'],
        diagrams: ['图表1', '图表2'],
        exercises: ['练习1', '练习2', '练习3']
      },
      createdAt: new Date().toISOString()
    }
  });
});

app.listen(PORT, () => {
  console.log(`测试服务器运行在端口 ${PORT}`);
});