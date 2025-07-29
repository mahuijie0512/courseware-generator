import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

// 基础中间件
app.use(cors());
app.use(express.json());

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: '清华大学智能高中课件生成系统运行正常',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

// 课件生成API - 兼容前端的简单请求格式
app.post('/api/courseware/generate', (req, res) => {
  try {
    const { courseInfo } = req.body;

    console.log('收到课件生成请求:', courseInfo);

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
          overview: `这是关于"${courseInfo.title}"的课程概述。本课程将深入探讨相关概念、原理和应用，帮助学生建立扎实的理论基础和实践能力。通过系统的学习，学生将掌握核心知识点，培养逻辑思维能力，为后续学习奠定坚实基础。`,
          concepts: [
            '基本概念和定义的理解与掌握',
            '核心理论和原理的深入分析',
            '重要性质和特征的归纳总结',
            '应用场景和实例的具体分析',
            '相关知识点之间的内在联系'
          ],
          formulas: [
            '基本公式: f(x) = ax + b',
            '重要定理: (a + b)² = a² + 2ab + b²',
            '核心方程: ax² + bx + c = 0',
            '关键不等式: |a + b| ≤ |a| + |b|',
            '函数性质: f(x + T) = f(x)'
          ],
          diagrams: [
            '概念关系图：展示知识点之间的逻辑关系',
            '流程示意图：说明解题思路和方法步骤',
            '结构框架图：构建完整的知识体系',
            '应用场景图：连接理论与实际应用'
          ],
          exercises: [
            '基础练习：理解和掌握基本概念',
            '应用练习：运用知识解决实际问题',
            '综合练习：整合多个知识点进行分析',
            '拓展练习：深入思考和创新应用',
            '实践练习：动手操作和验证理论'
          ]
        },
        createdAt: new Date().toISOString(),
        university: '清华大学',
        motto: '自强不息，厚德载物'
      }
    };

    console.log('课件生成成功，返回结果');
    res.json(mockResult);

  } catch (error) {
    console.error('生成课件失败:', error);
    res.status(500).json({
      success: false,
      message: '服务器内部错误，请稍后重试'
    });
  }
});

// 获取学科列表
app.get('/api/subjects', (req, res) => {
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
app.get('/api/grades', (req, res) => {
  res.json([
    { id: 'grade1', name: '高一', level: 1 },
    { id: 'grade2', name: '高二', level: 2 },
    { id: 'grade3', name: '高三', level: 3 }
  ]);
});

// 获取册别列表
app.get('/api/volumes', (req, res) => {
  res.json([
    { id: 'volume1', name: '上册', semester: 'first' },
    { id: 'volume2', name: '下册', semester: 'second' }
  ]);
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({
    success: false,
    message: '服务器内部错误'
  });
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `路由 ${req.originalUrl} 不存在`
  });
});

app.listen(PORT, () => {
  console.log(`🎓 清华大学智能课件生成系统运行在端口 ${PORT}`);
  console.log(`🔗 健康检查: http://localhost:${PORT}/api/health`);
  console.log(`📚 课件生成: http://localhost:${PORT}/api/courseware/generate`);
});

export default app;