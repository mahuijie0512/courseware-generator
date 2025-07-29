// 演示数据和模拟API响应 - 修复版本
const DEMO_DATA = {
  // 科目配置
  subjects: {
    math: {
      id: 'math',
      name: '数学',
      icon: '📐',
      color: '#2563eb',
      grades: ['高一', '高二', '高三'],
      volumes: ['上册', '下册']
    },
    physics: {
      id: 'physics', 
      name: '物理',
      icon: '⚛️',
      color: '#10b981',
      grades: ['高一', '高二', '高三'],
      volumes: ['上册', '下册']
    },
    chemistry: {
      id: 'chemistry',
      name: '化学', 
      icon: '🧪',
      color: '#f59e0b',
      grades: ['高一', '高二', '高三'],
      volumes: ['上册', '下册']
    },
    biology: {
      id: 'biology',
      name: '生物',
      icon: '🧬',
      color: '#8b5cf6',
      grades: ['高一', '高二', '高三'],
      volumes: ['上册', '下册']
    }
  },

  // 模拟课件生成的步骤
  generationSteps: [
    { id: 'init', name: '初始化', duration: 1000 },
    { id: 'overview', name: '生成概述', duration: 2000 },
    { id: 'concepts', name: '提取概念', duration: 1500 },
    { id: 'formulas', name: '整理公式', duration: 1800 },
    { id: 'diagrams', name: '生成图表', duration: 2200 },
    { id: 'interactions', name: '创建交互', duration: 1600 },
    { id: 'resources', name: '搜索资源', duration: 2500 },
    { id: 'complete', name: '完成', duration: 500 }
  ],

  // 模拟生成的课件内容（默认数学函数课程）
  sampleCourseware: {
    overview: {
      title: '函数的概念与性质',
      description: '本节课将深入探讨函数的基本概念、定义域、值域以及函数的基本性质，为后续学习奠定坚实基础。',
      objectives: [
        '理解函数的概念和定义',
        '掌握函数的定义域和值域的求法',
        '了解函数的单调性和奇偶性',
        '能够判断和证明函数的基本性质'
      ],
      keyPoints: [
        '函数的定义：设A、B是非空数集，如果按照某种确定的对应关系f，使对于集合A中的任意一个数x，在集合B中都有唯一确定的数f(x)和它对应',
        '定义域：函数f(x)中自变量x的取值范围',
        '值域：函数f(x)中因变量y的取值范围',
        '单调性：函数在某个区间内的增减性质'
      ],
      duration: '45分钟',
      difficulty: '中级'
    },

    concepts: [
      {
        id: 'function-definition',
        name: '函数定义',
        description: '函数是两个非空数集之间的一种特殊对应关系',
        details: '设A、B是非空数集，如果按照某种确定的对应关系f，使对于集合A中的任意一个数x，在集合B中都有唯一确定的数f(x)和它对应，那么就称f：A→B为从集合A到集合B的一个函数。',
        examples: [
          'f(x) = 2x + 1',
          'g(x) = x²',
          'h(x) = √x'
        ],
        importance: 'high'
      },
      {
        id: 'domain-range',
        name: '定义域与值域',
        description: '函数的定义域是自变量的取值范围，值域是因变量的取值范围',
        details: '定义域是使函数有意义的自变量x的取值集合；值域是函数值f(x)的取值集合。',
        examples: [
          'f(x) = 1/x 的定义域为 (-∞,0)∪(0,+∞)',
          'f(x) = √x 的定义域为 [0,+∞)',
          'f(x) = x² 的值域为 [0,+∞)'
        ],
        importance: 'high'
      }
    ],

    formulas: [
      {
        id: 'linear-function',
        name: '一次函数',
        formula: 'f(x) = ax + b (a ≠ 0)',
        description: '最简单的函数形式，图像为直线',
        properties: [
          '定义域：R',
          '值域：R',
          '当a>0时单调递增，当a<0时单调递减'
        ]
      },
      {
        id: 'quadratic-function',
        name: '二次函数',
        formula: 'f(x) = ax² + bx + c (a ≠ 0)',
        description: '二次函数，图像为抛物线',
        properties: [
          '定义域：R',
          '当a>0时，值域为[4ac-b²/4a, +∞)',
          '对称轴：x = -b/2a'
        ]
      }
    ],

    diagrams: [
      {
        id: 'function-mapping',
        title: '函数映射示意图',
        type: 'concept',
        description: '展示函数作为两个集合之间映射关系的示意图'
      }
    ],

    interactions: [
      {
        id: 'function-calculator',
        title: '函数值计算器',
        type: 'calculator',
        description: '输入函数表达式和x值，计算对应的函数值'
      }
    ],

    resources: [
      {
        id: 'video-1',
        title: '函数概念详解',
        type: 'video',
        source: '数学教学网',
        url: '#',
        duration: '15:30',
        description: '深入讲解函数的定义、表示方法和基本概念',
        thumbnail: 'https://via.placeholder.com/200x120/2563eb/ffffff?text=视频1',
        relevance: 0.95
      }
    ]
  },

  // 错误消息
  errorMessages: {
    networkError: '网络连接失败，请检查网络设置后重试',
    validationError: '请填写所有必填字段',
    generationError: '课件生成失败，请重试',
    exportError: '导出失败，请稍后重试'
  },

  // 成功消息
  successMessages: {
    generationComplete: '课件生成完成！',
    exportComplete: '导出成功！',
    shareComplete: '分享链接已复制到剪贴板'
  }
};

// 模拟API调用的工具函数
const MockAPI = {
  // 模拟课件生成API
  generateCourseware: async (formData, progressCallback) => {
    const steps = DEMO_DATA.generationSteps;
    let currentStep = 0;
    
    // 模拟分步骤生成过程
    for (const step of steps) {
      if (progressCallback) {
        progressCallback({
          currentStep: currentStep,
          totalSteps: steps.length,
          stepName: step.name,
          progress: Math.round((currentStep / steps.length) * 100)
        });
      }
      
      // 模拟每个步骤的处理时间
      await new Promise(resolve => setTimeout(resolve, step.duration));
      currentStep++;
    }
    
    return {
      success: true,
      data: DEMO_DATA.sampleCourseware,
      formData: formData,
      generatedAt: new Date().toISOString(),
      message: DEMO_DATA.successMessages.generationComplete
    };
  },

  // 模拟导出API
  exportCourseware: async (format, content, options = {}) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const timestamp = Date.now();
    const filename = `courseware_${content.overview?.title || 'untitled'}_${timestamp}.${format}`;
    
    return {
      success: true,
      format: format,
      filename: filename,
      downloadUrl: `#download/${format}/${timestamp}`,
      size: Math.floor(Math.random() * 5000) + 1000,
      generatedAt: new Date().toISOString(),
      options: options,
      message: `${format.toUpperCase()} ${DEMO_DATA.successMessages.exportComplete}`
    };
  },

  // 模拟分享API
  shareContent: async (content, shareOptions = {}) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const shareId = 'share_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
    const shareUrl = `${window.location.origin}/share/${shareId}`;
    
    return {
      success: true,
      shareId: shareId,
      shareUrl: shareUrl,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      accessCount: 0,
      createdAt: new Date().toISOString(),
      message: DEMO_DATA.successMessages.shareComplete
    };
  }
};

// 工具函数
const Utils = {
  // 生成唯一ID
  generateId: () => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  },

  // 复制到剪贴板
  copyToClipboard: async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      } else {
        // 回退方案
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const result = document.execCommand('copy');
        document.body.removeChild(textArea);
        return result;
      }
    } catch (error) {
      console.error('复制失败:', error);
      return false;
    }
  }
};

// 导出到全局作用域
window.DEMO_DATA = DEMO_DATA;
window.MockAPI = MockAPI;
window.Utils = Utils;

console.log('DEMO_DATA 加载完成');