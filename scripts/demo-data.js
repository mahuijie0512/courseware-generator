// 演示数据和模拟API响应
const DEMO_DATA = {
  // 科目配置
  subjects: {
    math: {
      id: 'math',
      name: '数学',
      icon: '📐',
      color: '#2563eb',
      grades: ['高一', '高二', '高三'],
      volumes: ['上册', '下册'],
      courses: {
        '高一-上册': [
          '函数的概念与性质',
          '指数函数与对数函数',
          '三角函数',
          '平面向量',
          '数列'
        ],
        '高一-下册': [
          '解三角形',
          '数列的极限',
          '导数及其应用',
          '统计',
          '概率'
        ],
        '高二-上册': [
          '导数及其应用',
          '推理与证明',
          '数系的扩充与复数的引入',
          '计数原理',
          '概率与统计'
        ],
        '高二-下册': [
          '常用逻辑用语',
          '圆锥曲线与方程',
          '空间向量与立体几何',
          '导数应用',
          '统计案例'
        ],
        '高三-上册': [
          '集合与逻辑',
          '函数与导数',
          '三角函数与解三角形',
          '数列与不等式',
          '立体几何'
        ],
        '高三-下册': [
          '解析几何',
          '概率与统计',
          '算法与程序框图',
          '推理与证明',
          '数学文化与应用'
        ]
      }
    },
    physics: {
      id: 'physics', 
      name: '物理',
      icon: '⚛️',
      color: '#10b981',
      grades: ['高一', '高二', '高三'],
      volumes: ['上册', '下册'],
      courses: {
        '高一-上册': [
          '运动的描述',
          '匀变速直线运动',
          '相互作用',
          '牛顿运动定律',
          '运动的合成与分解'
        ],
        '高一-下册': [
          '曲线运动',
          '万有引力与航天',
          '机械能守恒定律',
          '动量守恒定律',
          '机械振动与机械波'
        ],
        '高二-上册': [
          '静电场',
          '恒定电流',
          '磁场',
          '电磁感应',
          '交变电流'
        ],
        '高二-下册': [
          '传感器',
          '分子动理论',
          '气体',
          '热力学定律',
          '机械振动与机械波'
        ],
        '高三-上册': [
          '动量和动量守恒',
          '波粒二象性',
          '原子结构',
          '原子核',
          '力学综合'
        ],
        '高三-下册': [
          '电磁学综合',
          '光学',
          '近代物理',
          '实验专题',
          '物理思想方法'
        ]
      }
    },
    chemistry: {
      id: 'chemistry',
      name: '化学', 
      icon: '🧪',
      color: '#f59e0b',
      grades: ['高一', '高二', '高三'],
      volumes: ['上册', '下册'],
      courses: {
        '高一-上册': [
          '原子结构',
          '元素周期律',
          '化学键',
          '氧化还原反应',
          '离子反应'
        ],
        '高一-下册': [
          '金属及其化合物',
          '非金属及其化合物',
          '有机化合物',
          '化学反应与能量',
          '化学反应速率与化学平衡'
        ],
        '高二-上册': [
          '化学反应与能量',
          '化学反应速率与化学平衡',
          '水溶液中的离子平衡',
          '电化学基础',
          '有机化学基础'
        ],
        '高二-下册': [
          '有机化学基础',
          '化学与生活',
          '化学与技术',
          '物质结构与性质',
          '化学反应原理'
        ],
        '高三-上册': [
          '化学基本概念',
          '化学基本理论',
          '元素化合物',
          '有机化学',
          '化学实验'
        ],
        '高三-下册': [
          '化学计算',
          '化学工艺流程',
          '化学实验综合',
          '结构化学',
          '化学前沿'
        ]
      }
    },
    biology: {
      id: 'biology',
      name: '生物',
      icon: '🧬',
      color: '#8b5cf6',
      grades: ['高一', '高二', '高三'],
      volumes: ['上册', '下册'],
      courses: {
        '高一-上册': [
          '细胞的结构和功能',
          '细胞的物质输入和输出',
          '细胞的能量供应和利用',
          '细胞的生命历程',
          '遗传因子的发现'
        ],
        '高一-下册': [
          '基因和染色体的关系',
          '基因的本质',
          '基因的表达',
          '基因突变及其他变异',
          '从杂交育种到基因工程'
        ],
        '高二-上册': [
          '生物技术实践',
          '现代生物科技专题',
          '植物的激素调节',
          '动物生命活动的调节',
          '人体的内环境与稳态'
        ],
        '高二-下册': [
          '种群和群落',
          '生态系统',
          '生态环境的保护',
          '生物的进化',
          '生物技术的安全性和伦理问题'
        ],
        '高三-上册': [
          '细胞的分子组成',
          '细胞的结构和功能',
          '细胞的代谢',
          '遗传的分子基础',
          '遗传的基本规律'
        ],
        '高三-下册': [
          '生物的变异与进化',
          '生命活动的调节',
          '生物与环境',
          '生物技术实践',
          '现代生物科技'
        ]
      }
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

  // 多科目课件模板
  coursewareTemplates: {
    math: {
      '高一-上册-函数的概念与性质': {
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
            examples: ['f(x) = 2x + 1', 'g(x) = x²', 'h(x) = √x'],
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
            properties: ['定义域：R', '值域：R', '当a>0时单调递增，当a<0时单调递减']
          },
          {
            id: 'quadratic-function',
            name: '二次函数',
            formula: 'f(x) = ax² + bx + c (a ≠ 0)',
            description: '二次函数，图像为抛物线',
            properties: ['定义域：R', '当a>0时，值域为[4ac-b²/4a, +∞)', '对称轴：x = -b/2a']
          }
        ]
      },
      '高二-上册-导数及其应用': {
        overview: {
          title: '导数及其应用',
          description: '导数是微积分的核心概念，本节将学习导数的定义、计算方法及其在函数分析中的应用。',
          objectives: [
            '理解导数的几何意义和物理意义',
            '掌握基本函数的导数公式',
            '学会利用导数研究函数的性质',
            '能够解决实际问题中的最值问题'
          ],
          keyPoints: [
            '导数的定义：f\'(x) = lim[h→0] [f(x+h)-f(x)]/h',
            '导数的几何意义：函数图像在某点处的切线斜率',
            '导数的物理意义：瞬时变化率',
            '利用导数判断函数的单调性和极值'
          ],
          duration: '45分钟',
          difficulty: '高级'
        },
        concepts: [
          {
            id: 'derivative-definition',
            name: '导数定义',
            description: '导数描述函数在某点处的瞬时变化率',
            details: '函数f(x)在点x₀处的导数定义为：f\'(x₀) = lim[h→0] [f(x₀+h)-f(x₀)]/h',
            examples: ['f(x) = x²，则f\'(x) = 2x', 'f(x) = sin(x)，则f\'(x) = cos(x)'],
            importance: 'high'
          }
        ],
        formulas: [
          {
            id: 'power-rule',
            name: '幂函数导数',
            formula: '(x^n)\' = nx^(n-1)',
            description: '幂函数的导数公式',
            properties: ['适用于所有实数n', '是最基本的导数公式之一']
          }
        ]
      }
    },
    physics: {
      '高一-上册-运动的描述': {
        overview: {
          title: '运动的描述',
          description: '物理学中研究物体运动的基础知识，包括位移、速度、加速度等基本概念。',
          objectives: [
            '理解位移、速度、加速度的概念',
            '掌握匀速直线运动和匀变速直线运动的规律',
            '学会使用运动图像分析物体运动',
            '能够解决简单的运动学问题'
          ],
          keyPoints: [
            '位移：物体位置的变化量，是矢量',
            '速度：位移与时间的比值，v = Δx/Δt',
            '加速度：速度变化量与时间的比值，a = Δv/Δt',
            '匀变速直线运动的基本公式'
          ],
          duration: '45分钟',
          difficulty: '中级'
        },
        concepts: [
          {
            id: 'displacement',
            name: '位移',
            description: '物体位置的变化量，具有大小和方向',
            details: '位移是从初位置指向末位置的有向线段，用符号Δx表示，单位是米(m)。',
            examples: ['物体从A点运动到B点，位移为AB的距离', '往返运动的总位移可能为零'],
            importance: 'high'
          },
          {
            id: 'velocity',
            name: '速度',
            description: '描述物体运动快慢和方向的物理量',
            details: '平均速度v = Δx/Δt，瞬时速度是平均速度在时间间隔趋于零时的极限值。',
            examples: ['汽车以60km/h的速度行驶', '自由落体运动的瞬时速度v = gt'],
            importance: 'high'
          }
        ],
        formulas: [
          {
            id: 'uniform-motion',
            name: '匀速直线运动',
            formula: 'x = x₀ + vt',
            description: '物体以恒定速度做直线运动',
            properties: ['速度v为常数', '位移与时间成正比', 'v-t图像为水平直线']
          },
          {
            id: 'uniformly-accelerated-motion',
            name: '匀变速直线运动',
            formula: 'x = x₀ + v₀t + ½at²',
            description: '物体以恒定加速度做直线运动',
            properties: ['加速度a为常数', 'v = v₀ + at', 'v² = v₀² + 2ax']
          }
        ]
      },
      '高二-上册-电磁感应': {
        overview: {
          title: '电磁感应',
          description: '电磁感应是电磁学的重要内容，揭示了磁场变化产生电场的规律。',
          objectives: [
            '理解电磁感应现象的本质',
            '掌握法拉第电磁感应定律',
            '学会计算感应电动势',
            '了解电磁感应的实际应用'
          ],
          keyPoints: [
            '磁通量：Φ = B·S·cosθ',
            '法拉第电磁感应定律：ε = -dΦ/dt',
            '楞次定律：感应电流的方向总是阻碍磁通量的变化',
            '动生电动势和感生电动势'
          ],
          duration: '45分钟',
          difficulty: '高级'
        },
        concepts: [
          {
            id: 'magnetic-flux',
            name: '磁通量',
            description: '穿过某一面积的磁感线条数',
            details: '磁通量Φ = B·S·cosθ，其中B是磁感应强度，S是面积，θ是磁场与面积法线的夹角。',
            examples: ['匀强磁场中的磁通量计算', '磁通量的变化产生感应电动势'],
            importance: 'high'
          }
        ],
        formulas: [
          {
            id: 'faraday-law',
            name: '法拉第电磁感应定律',
            formula: 'ε = -dΦ/dt',
            description: '感应电动势等于磁通量变化率的负值',
            properties: ['负号体现楞次定律', '适用于任何形式的磁通量变化']
          }
        ]
      }
    },
    chemistry: {
      '高一-上册-原子结构': {
        overview: {
          title: '原子结构',
          description: '原子是构成物质的基本单位，了解原子结构是学习化学的基础。',
          objectives: [
            '了解原子的组成和结构',
            '理解原子核外电子的排布规律',
            '掌握元素周期表的结构和规律',
            '能够书写原子的电子构型'
          ],
          keyPoints: [
            '原子由原子核和核外电子组成',
            '原子核由质子和中子组成',
            '电子在原子核外分层排布',
            '元素的性质与原子结构密切相关'
          ],
          duration: '45分钟',
          difficulty: '中级'
        },
        concepts: [
          {
            id: 'atomic-structure',
            name: '原子结构',
            description: '原子由原子核和核外电子组成',
            details: '原子核位于原子中心，由质子和中子组成；电子在核外空间高速运动。',
            examples: ['氢原子：1个质子，1个电子', '碳原子：6个质子，6个中子，6个电子'],
            importance: 'high'
          }
        ],
        formulas: [
          {
            id: 'atomic-number',
            name: '原子序数',
            formula: 'Z = 质子数 = 电子数',
            description: '原子序数等于原子核内质子数',
            properties: ['决定元素的化学性质', '在元素周期表中按原子序数排列']
          }
        ],
        diagrams: [
          {
            id: 'atomic-structure-diagram',
            title: '原子结构示意图',
            type: 'structure',
            description: '展示原子核和电子轨道的基本结构',
            svgContent: `
              <svg viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
                <!-- 原子核 -->
                <circle cx="150" cy="150" r="20" fill="#f59e0b" stroke="#d97706" stroke-width="2"/>
                <text x="150" y="155" text-anchor="middle" font-size="12" fill="white" font-weight="bold">核</text>
                
                <!-- 电子轨道 -->
                <circle cx="150" cy="150" r="60" fill="none" stroke="#94a3b8" stroke-width="1" stroke-dasharray="5,5"/>
                <circle cx="150" cy="150" r="100" fill="none" stroke="#94a3b8" stroke-width="1" stroke-dasharray="5,5"/>
                <circle cx="150" cy="150" r="140" fill="none" stroke="#94a3b8" stroke-width="1" stroke-dasharray="5,5"/>
                
                <!-- 电子 -->
                <circle cx="210" cy="150" r="4" fill="#2563eb"/>
                <circle cx="90" cy="150" r="4" fill="#2563eb"/>
                <circle cx="150" cy="50" r="4" fill="#10b981"/>
                <circle cx="150" cy="250" r="4" fill="#10b981"/>
                <circle cx="220" cy="80" r="4" fill="#ef4444"/>
                <circle cx="80" cy="220" r="4" fill="#ef4444"/>
                
                <!-- 标签 -->
                <text x="150" y="20" text-anchor="middle" font-size="14" font-weight="bold">原子结构</text>
                <text x="230" y="145" font-size="10" fill="#2563eb">e⁻</text>
                <text x="70" y="145" font-size="10" fill="#2563eb">e⁻</text>
              </svg>
            `
          }
        ],
        interactions: [
          {
            id: 'electron-config',
            title: '电子构型书写器',
            type: 'configurator',
            description: '输入元素符号，自动生成电子构型',
            config: {
              elements: [
                { symbol: 'H', name: '氢', config: '1s¹' },
                { symbol: 'He', name: '氦', config: '1s²' },
                { symbol: 'C', name: '碳', config: '1s² 2s² 2p²' },
                { symbol: 'O', name: '氧', config: '1s² 2s² 2p⁴' }
              ]
            }
          }
        ],
        resources: [
          {
            id: 'chem-video-1',
            title: '原子结构动画演示',
            type: 'video',
            source: '化学教学网',
            url: '#',
            duration: '12:45',
            description: '3D动画展示原子内部结构和电子运动',
            thumbnail: 'https://via.placeholder.com/200x120/f59e0b/ffffff?text=化学视频',
            relevance: 0.93
          }
        ]
      }
    },
    biology: {
      '高一-上册-细胞的结构和功能': {
        overview: {
          title: '细胞的结构和功能',
          description: '细胞是生命的基本单位，了解细胞结构和功能是学习生物学的基础。',
          objectives: [
            '认识细胞的基本结构',
            '理解各细胞器的功能',
            '区分原核细胞和真核细胞',
            '了解细胞膜的结构和功能'
          ],
          keyPoints: [
            '细胞膜：控制物质进出细胞',
            '细胞核：遗传信息的控制中心',
            '线粒体：细胞的"动力工厂"',
            '叶绿体：光合作用的场所'
          ],
          duration: '45分钟',
          difficulty: '中级'
        },
        concepts: [
          {
            id: 'cell-membrane',
            name: '细胞膜',
            description: '包围细胞的生物膜，控制物质进出',
            details: '细胞膜由磷脂双分子层构成，具有选择透过性，维持细胞内外环境的稳定。',
            examples: ['氧气可以自由通过细胞膜', '葡萄糖需要载体蛋白协助通过'],
            importance: 'high'
          },
          {
            id: 'cell-nucleus',
            name: '细胞核',
            description: '细胞的控制中心，含有遗传物质DNA',
            details: '细胞核由核膜、核质、核仁和染色质组成，是细胞生命活动的调节中心。',
            examples: ['DNA复制在细胞核中进行', '转录过程发生在细胞核内'],
            importance: 'high'
          }
        ],
        formulas: [
          {
            id: 'cell-respiration',
            name: '细胞呼吸',
            formula: 'C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O + ATP',
            description: '细胞呼吸的总反应式',
            properties: ['在线粒体中进行', '产生ATP为细胞提供能量']
          }
        ],
        diagrams: [
          {
            id: 'cell-structure',
            title: '动物细胞结构图',
            type: 'structure',
            description: '展示动物细胞的主要结构组成',
            svgContent: `
              <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                <!-- 细胞膜 -->
                <ellipse cx="200" cy="150" rx="180" ry="120" fill="none" stroke="#2563eb" stroke-width="3"/>
                
                <!-- 细胞核 -->
                <circle cx="200" cy="150" r="40" fill="#f59e0b" fill-opacity="0.3" stroke="#f59e0b" stroke-width="2"/>
                <text x="200" y="155" text-anchor="middle" font-size="12" font-weight="bold">细胞核</text>
                
                <!-- 线粒体 -->
                <ellipse cx="120" cy="100" rx="25" ry="15" fill="#10b981" fill-opacity="0.5" stroke="#10b981" stroke-width="1"/>
                <text x="120" y="85" text-anchor="middle" font-size="10">线粒体</text>
                
                <!-- 内质网 -->
                <path d="M 80 150 Q 100 130 120 150 Q 140 170 160 150" fill="none" stroke="#8b5cf6" stroke-width="2"/>
                <text x="120" y="180" text-anchor="middle" font-size="10">内质网</text>
                
                <!-- 高尔基体 -->
                <rect x="260" y="120" width="30" height="20" fill="#ef4444" fill-opacity="0.5" stroke="#ef4444"/>
                <text x="275" y="110" text-anchor="middle" font-size="10">高尔基体</text>
                
                <!-- 标题 -->
                <text x="200" y="25" text-anchor="middle" font-size="16" font-weight="bold">动物细胞结构</text>
              </svg>
            `
          }
        ],
        interactions: [
          {
            id: 'cell-organelle-quiz',
            title: '细胞器功能配对',
            type: 'quiz',
            description: '将细胞器与其功能进行正确配对',
            config: {
              pairs: [
                { organelle: '线粒体', function: '产生ATP，细胞呼吸' },
                { organelle: '叶绿体', function: '光合作用' },
                { organelle: '细胞核', function: '遗传信息控制中心' },
                { organelle: '内质网', function: '蛋白质合成和运输' }
              ]
            }
          }
        ],
        resources: [
          {
            id: 'bio-video-1',
            title: '细胞结构3D动画',
            type: 'video',
            source: '生物教学平台',
            url: '#',
            duration: '18:20',
            description: '高清3D动画展示细胞内部结构和各细胞器功能',
            thumbnail: 'https://via.placeholder.com/200x120/8b5cf6/ffffff?text=生物视频',
            relevance: 0.96
          }
        ]
      }
    }
  },

  // 通用资源库（按类型分类）
  resourceLibrary: {
    videos: [
      {
        id: 'math-functions-intro',
        title: '函数基础概念入门',
        subject: 'math',
        grade: '高一',
        type: 'video',
        duration: '20:15',
        description: '从零开始学习函数概念，适合初学者',
        thumbnail: 'https://via.placeholder.com/200x120/2563eb/ffffff?text=数学基础',
        relevance: 0.90
      },
      {
        id: 'physics-motion-demo',
        title: '运动学实验演示',
        subject: 'physics',
        grade: '高一',
        type: 'video',
        duration: '15:30',
        description: '通过实验直观展示各种运动规律',
        thumbnail: 'https://via.placeholder.com/200x120/10b981/ffffff?text=物理实验',
        relevance: 0.88
      }
    ],
    exercises: [
      {
        id: 'math-function-practice',
        title: '函数综合练习题集',
        subject: 'math',
        grade: '高一',
        type: 'exercise',
        difficulty: '中等',
        questionCount: 50,
        description: '涵盖函数定义、性质、图像等各个方面的练习题',
        thumbnail: 'https://via.placeholder.com/200x120/2563eb/ffffff?text=数学练习',
        relevance: 0.92
      }
    ],
    simulations: [
      {
        id: 'physics-motion-sim',
        title: '运动轨迹模拟器',
        subject: 'physics',
        grade: '高一',
        type: 'simulation',
        description: '交互式物理运动模拟，可调节各种参数观察运动效果',
        thumbnail: 'https://via.placeholder.com/200x120/10b981/ffffff?text=物理模拟',
        relevance: 0.85
      }
    ]
  },

  // 课件生成配置选项
  generationOptions: {
    difficulty: [
      { value: 'basic', label: '基础', description: '适合初学者，注重基本概念' },
      { value: 'intermediate', label: '中级', description: '标准难度，平衡理论与应用' },
      { value: 'advanced', label: '高级', description: '深入探讨，包含拓展内容' }
    ],
    language: [
      { value: 'zh-CN', label: '中文', description: '简体中文' },
      { value: 'en-US', label: 'English', description: '英语' }
    ],
    contentTypes: [
      { id: 'overview', name: '课程概述', enabled: true, description: '生成课程总体介绍和学习目标' },
      { id: 'concepts', name: '概念定义', enabled: true, description: '提取和解释关键概念' },
      { id: 'formulas', name: '公式整理', enabled: true, description: '整理相关数学公式和定理' },
      { id: 'diagrams', name: '图表生成', enabled: true, description: '创建示意图和可视化内容' },
      { id: 'interactions', name: '交互组件', enabled: false, description: '添加互动练习和模拟器' },
      { id: 'resources', name: '在线资源', enabled: true, description: '搜索相关的学习资源' }
    ]
  }
  },

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
      },
      {
        id: 'monotonicity',
        name: '函数的单调性',
        description: '函数在某个区间内的增减性质',
        details: '设函数f(x)在区间I上有定义，如果对于区间I内的任意两个值x₁、x₂，当x₁<x₂时，都有f(x₁)<f(x₂)，则称函数f(x)在区间I上单调递增。',
        examples: [
          'f(x) = x 在R上单调递增',
          'f(x) = -x 在R上单调递减',
          'f(x) = x² 在[0,+∞)上单调递增'
        ],
        importance: 'medium'
      },
      {
        id: 'parity',
        name: '函数的奇偶性',
        description: '函数关于原点或y轴的对称性质',
        details: '设函数f(x)的定义域关于原点对称，如果对于定义域内任意x，都有f(-x)=f(x)，则称f(x)为偶函数；如果f(-x)=-f(x)，则称f(x)为奇函数。',
        examples: [
          'f(x) = x² 是偶函数',
          'f(x) = x³ 是奇函数',
          'f(x) = x² + x 既不是奇函数也不是偶函数'
        ],
        importance: 'medium'
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
      },
      {
        id: 'inverse-function',
        name: '反比例函数',
        formula: 'f(x) = k/x (k ≠ 0)',
        description: '反比例函数，图像为双曲线',
        properties: [
          '定义域：(-∞,0)∪(0,+∞)',
          '值域：(-∞,0)∪(0,+∞)',
          '当k>0时，在(-∞,0)和(0,+∞)上都单调递减'
        ]
      }
    ],

    diagrams: [
      {
        id: 'function-mapping',
        title: '函数映射示意图',
        type: 'concept',
        description: '展示函数作为两个集合之间映射关系的示意图',
        svgContent: `
          <svg viewBox="0 0 400 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#2563eb" />
              </marker>
            </defs>
            
            <!-- 集合A -->
            <ellipse cx="80" cy="100" rx="60" ry="80" fill="none" stroke="#2563eb" stroke-width="2"/>
            <text x="80" y="30" text-anchor="middle" font-size="16" font-weight="bold" fill="#2563eb">集合A</text>
            <circle cx="60" cy="70" r="4" fill="#2563eb"/>
            <text x="45" y="75" font-size="12" fill="#2563eb">x₁</text>
            <circle cx="60" cy="100" r="4" fill="#2563eb"/>
            <text x="45" y="105" font-size="12" fill="#2563eb">x₂</text>
            <circle cx="60" cy="130" r="4" fill="#2563eb"/>
            <text x="45" y="135" font-size="12" fill="#2563eb">x₃</text>
            
            <!-- 集合B -->
            <ellipse cx="320" cy="100" rx="60" ry="80" fill="none" stroke="#10b981" stroke-width="2"/>
            <text x="320" y="30" text-anchor="middle" font-size="16" font-weight="bold" fill="#10b981">集合B</text>
            <circle cx="340" cy="60" r="4" fill="#10b981"/>
            <text x="350" y="65" font-size="12" fill="#10b981">f(x₁)</text>
            <circle cx="340" cy="90" r="4" fill="#10b981"/>
            <text x="350" y="95" font-size="12" fill="#10b981">f(x₂)</text>
            <circle cx="340" cy="120" r="4" fill="#10b981"/>
            <text x="350" y="125" font-size="12" fill="#10b981">f(x₃)</text>
            <circle cx="340" cy="150" r="4" fill="#94a3b8"/>
            <text x="350" y="155" font-size="12" fill="#94a3b8">y₄</text>
            
            <!-- 箭头 -->
            <line x1="64" y1="70" x2="336" y2="60" stroke="#2563eb" stroke-width="2" marker-end="url(#arrowhead)"/>
            <line x1="64" y1="100" x2="336" y2="90" stroke="#2563eb" stroke-width="2" marker-end="url(#arrowhead)"/>
            <line x1="64" y1="130" x2="336" y2="120" stroke="#2563eb" stroke-width="2" marker-end="url(#arrowhead)"/>
            
            <!-- 函数标记 -->
            <text x="200" y="50" text-anchor="middle" font-size="14" font-weight="bold" fill="#2563eb">f</text>
          </svg>
        `
      },
      {
        id: 'function-graph',
        title: '常见函数图像',
        type: 'graph',
        description: '展示一次函数、二次函数和反比例函数的图像特征',
        svgContent: `
          <svg viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
            <!-- 坐标轴 -->
            <line x1="50" y1="350" x2="550" y2="350" stroke="#64748b" stroke-width="1"/>
            <line x1="300" y1="50" x2="300" y2="350" stroke="#64748b" stroke-width="1"/>
            
            <!-- 坐标轴标记 -->
            <text x="540" y="345" font-size="12" fill="#64748b">x</text>
            <text x="305" y="60" font-size="12" fill="#64748b">y</text>
            <text x="295" y="365" font-size="12" fill="#64748b">O</text>
            
            <!-- 一次函数 y = x -->
            <line x1="100" y1="300" x2="500" y2="100" stroke="#2563eb" stroke-width="2"/>
            <text x="450" y="90" font-size="12" fill="#2563eb">y = x</text>
            
            <!-- 二次函数 y = x² -->
            <path d="M 150 350 Q 300 150 450 350" fill="none" stroke="#10b981" stroke-width="2"/>
            <text x="320" y="140" font-size="12" fill="#10b981">y = x²</text>
            
            <!-- 反比例函数 y = 1/x -->
            <path d="M 200 200 Q 250 150 350 100" fill="none" stroke="#f59e0b" stroke-width="2"/>
            <path d="M 350 300 Q 400 250 500 200" fill="none" stroke="#f59e0b" stroke-width="2"/>
            <text x="360" y="90" font-size="12" fill="#f59e0b">y = 1/x</text>
          </svg>
        `
      }
    ],

    interactions: [
      {
        id: 'function-calculator',
        title: '函数值计算器',
        type: 'calculator',
        description: '输入函数表达式和x值，计算对应的函数值',
        config: {
          functions: [
            { name: 'f(x) = 2x + 1', expression: '2*x + 1' },
            { name: 'g(x) = x²', expression: 'x*x' },
            { name: 'h(x) = 1/x', expression: '1/x' }
          ]
        }
      },
      {
        id: 'domain-finder',
        title: '定义域求解器',
        type: 'solver',
        description: '输入函数表达式，自动分析并给出定义域',
        config: {
          examples: [
            { function: '√x', domain: '[0, +∞)' },
            { function: '1/x', domain: '(-∞, 0) ∪ (0, +∞)' },
            { function: '1/(x-2)', domain: '(-∞, 2) ∪ (2, +∞)' }
          ]
        }
      },
      {
        id: 'monotonicity-checker',
        title: '单调性判断器',
        type: 'checker',
        description: '分析函数在给定区间内的单调性',
        config: {
          functions: [
            { name: 'f(x) = x', intervals: [{ range: '(-∞, +∞)', monotonicity: '递增' }] },
            { name: 'f(x) = x²', intervals: [{ range: '(-∞, 0)', monotonicity: '递减' }, { range: '(0, +∞)', monotonicity: '递增' }] }
          ]
        }
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
      },
      {
        id: 'exercise-1',
        title: '函数定义域练习题',
        type: 'exercise',
        source: '高中数学题库',
        url: '#',
        difficulty: '中等',
        description: '包含20道关于函数定义域求解的练习题，附详细解答',
        thumbnail: 'https://via.placeholder.com/200x120/10b981/ffffff?text=练习1',
        relevance: 0.88
      },
      {
        id: 'article-1',
        title: '函数性质总结',
        type: 'article',
        source: '数学学习网',
        url: '#',
        readTime: '8分钟',
        description: '系统总结函数的各种性质，包括单调性、奇偶性、周期性等',
        thumbnail: 'https://via.placeholder.com/200x120/f59e0b/ffffff?text=文章1',
        relevance: 0.92
      },
      {
        id: 'tool-1',
        title: '函数图像绘制工具',
        type: 'tool',
        source: 'GeoGebra',
        url: '#',
        description: '在线函数图像绘制工具，支持多种函数类型的可视化',
        thumbnail: 'https://via.placeholder.com/200x120/8b5cf6/ffffff?text=工具1',
        relevance: 0.85
      },
      {
        id: 'simulation-1',
        title: '函数变换模拟器',
        type: 'simulation',
        source: '数学实验室',
        url: '#',
        description: '交互式函数变换模拟器，直观展示函数图像的平移、伸缩等变换',
        thumbnail: 'https://via.placeholder.com/200x120/ef4444/ffffff?text=模拟1',
        relevance: 0.90
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
  // 模拟课件生成API - 支持分步骤生成过程
  generateCourseware: async (formData, progressCallback) => {
    const steps = DEMO_DATA.generationSteps;
    let currentStep = 0;
    
    // 根据表单数据选择对应的课件模板
    const coursewareKey = `${formData.grade}-${formData.volume}-${formData.title}`;
    const subjectTemplates = DEMO_DATA.coursewareTemplates[formData.subject];
    let selectedTemplate = null;
    
    // 查找匹配的模板
    if (subjectTemplates) {
      selectedTemplate = subjectTemplates[coursewareKey] || 
                        Object.values(subjectTemplates)[0]; // 使用第一个模板作为默认
    }
    
    // 如果没有找到模板，使用默认的sampleCourseware
    const coursewareData = selectedTemplate || DEMO_DATA.sampleCourseware;
    
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
      
      // 模拟随机失败（5%概率，但不在最后一步）
      if (currentStep < steps.length - 1 && Math.random() < 0.05) {
        throw new Error(`${step.name}失败：${DEMO_DATA.errorMessages.generationError}`);
      }
      
      currentStep++;
    }
    
    // 最终完成回调
    if (progressCallback) {
      progressCallback({
        currentStep: steps.length,
        totalSteps: steps.length,
        stepName: '完成',
        progress: 100,
        completed: true
      });
    }
    
    return {
      success: true,
      data: coursewareData,
      formData: formData,
      generatedAt: new Date().toISOString(),
      message: DEMO_DATA.successMessages.generationComplete
    };
  },

  // 模拟资源搜索API - 支持多种搜索条件
  searchResources: async (query, filters = {}) => {
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
    
    if (Math.random() < 0.03) {
      throw new Error(DEMO_DATA.errorMessages.networkError);
    }
    
    let allResources = [];
    
    // 从资源库获取资源
    if (DEMO_DATA.resourceLibrary) {
      Object.values(DEMO_DATA.resourceLibrary).forEach(resourceType => {
        allResources = allResources.concat(resourceType);
      });
    }
    
    // 从课件模板中获取资源
    if (DEMO_DATA.sampleCourseware && DEMO_DATA.sampleCourseware.resources) {
      allResources = allResources.concat(DEMO_DATA.sampleCourseware.resources);
    }
    
    // 应用过滤器
    let filteredResources = allResources;
    
    if (filters.subject) {
      filteredResources = filteredResources.filter(resource => 
        resource.subject === filters.subject || !resource.subject
      );
    }
    
    if (filters.type) {
      filteredResources = filteredResources.filter(resource => 
        resource.type === filters.type
      );
    }
    
    if (filters.difficulty) {
      filteredResources = filteredResources.filter(resource => 
        resource.difficulty === filters.difficulty || !resource.difficulty
      );
    }
    
    // 搜索匹配
    if (query) {
      const searchQuery = query.toLowerCase();
      filteredResources = filteredResources.filter(resource =>
        resource.title.toLowerCase().includes(searchQuery) ||
        resource.description.toLowerCase().includes(searchQuery)
      );
    }
    
    // 按相关性排序
    filteredResources.sort((a, b) => (b.relevance || 0.5) - (a.relevance || 0.5));
    
    return {
      success: true,
      data: filteredResources.slice(0, 20), // 限制返回数量
      total: filteredResources.length,
      query: query,
      filters: filters
    };
  },

  // 模拟导出API - 支持多种格式导出
  exportCourseware: async (format, content, options = {}) => {
    // 模拟导出处理时间
    const processingTime = {
      'html': 1000,
      'pdf': 3000,
      'pptx': 4000,
      'docx': 2500,
      'json': 500
    };
    
    await new Promise(resolve => setTimeout(resolve, processingTime[format] || 2000));
    
    // 模拟随机失败（3%概率）
    if (Math.random() < 0.03) {
      throw new Error(`${format.toUpperCase()}${DEMO_DATA.errorMessages.exportError}`);
    }
    
    const timestamp = Date.now();
    const filename = `courseware_${content.overview?.title || 'untitled'}_${timestamp}.${format}`;
    
    return {
      success: true,
      format: format,
      filename: filename,
      downloadUrl: `#download/${format}/${timestamp}`,
      size: Math.floor(Math.random() * 5000) + 1000, // 模拟文件大小(KB)
      generatedAt: new Date().toISOString(),
      options: options,
      message: `${format.toUpperCase()} ${DEMO_DATA.successMessages.exportComplete}`
    };
  },

  // 模拟分享API - 生成分享链接
  shareContent: async (content, shareOptions = {}) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (Math.random() < 0.02) {
      throw new Error('分享服务暂时不可用，请稍后重试');
    }
    
    const shareId = 'share_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
    const shareUrl = `${window.location.origin}/share/${shareId}`;
    
    return {
      success: true,
      shareId: shareId,
      shareUrl: shareUrl,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7天后过期
      accessCount: 0,
      maxAccess: shareOptions.maxAccess || null,
      password: shareOptions.password || null,
      createdAt: new Date().toISOString(),
      message: DEMO_DATA.successMessages.shareComplete
    };
  },

  // 模拟获取课程模板列表
  getCourseTemplates: async (subject, grade, volume) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const templates = DEMO_DATA.coursewareTemplates[subject] || {};
    const filteredTemplates = Object.entries(templates)
      .filter(([key, template]) => {
        const [templateGrade, templateVolume] = key.split('-');
        return (!grade || templateGrade === grade) && 
               (!volume || templateVolume === volume);
      })
      .map(([key, template]) => ({
        id: key,
        title: template.overview.title,
        description: template.overview.description,
        difficulty: template.overview.difficulty,
        duration: template.overview.duration
      }));
    
    return {
      success: true,
      data: filteredTemplates,
      subject: subject,
      grade: grade,
      volume: volume
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
  },

  // 格式化文件大小
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // 格式化时间
  formatDuration: (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  },

  // 防抖函数
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // 节流函数
  throttle: (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};

// 导出到全局作用域
window.DEMO_DATA = DEMO_DATA;
window.MockAPI = MockAPI;
window.Utils = Utils;(DEMO_DATA.resourceLibrary).forEach(resourceType => {
        if (Array.isArray(resourceType)) {
          allResources = allResources.concat(resourceType);
        }
      });
    }
    
    // 从样例课件获取资源
    if (DEMO_DATA.sampleCourseware && DEMO_DATA.sampleCourseware.resources) {
      allResources = allResources.concat(DEMO_DATA.sampleCourseware.resources);
    }
    
    // 应用搜索过滤
    let filteredResources = allResources;
    
    if (query) {
      filteredResources = filteredResources.filter(resource => 
        resource.title.toLowerCase().includes(query.toLowerCase()) ||
        resource.description.toLowerCase().includes(query.toLowerCase()) ||
        (resource.source && resource.source.toLowerCase().includes(query.toLowerCase()))
      );
    }
    
    if (filters.type) {
      filteredResources = filteredResources.filter(resource => 
        resource.type === filters.type
      );
    }
    
    if (filters.subject) {
      filteredResources = filteredResources.filter(resource => 
        resource.subject === filters.subject
      );
    }
    
    if (filters.difficulty) {
      filteredResources = filteredResources.filter(resource => 
        resource.difficulty === filters.difficulty
      );
    }
    
    // 按相关性排序
    filteredResources.sort((a, b) => (b.relevance || 0) - (a.relevance || 0));
    
    return {
      success: true,
      data: filteredResources,
      total: filteredResources.length,
      query: query,
      filters: filters
    };
  },

  // 模拟导出API - 支持多种格式
  exportCourseware: async (format, content, options = {}) => {
    const exportDuration = {
      'pdf': 2000,
      'pptx': 1500,
      'html': 800,
      'docx': 1200,
      'json': 300
    };
    
    const duration = exportDuration[format] || 1000;
    await new Promise(resolve => setTimeout(resolve, duration));
    
    if (Math.random() < 0.03) {
      throw new Error(DEMO_DATA.errorMessages.exportError);
    }
    
    // 模拟生成文件信息
    const timestamp = Date.now();
    const filename = `${content.overview?.title || 'courseware'}_${timestamp}.${format}`;
    const downloadUrl = `#download/${filename}`;
    const fileSize = Math.floor(Math.random() * 5000000) + 100000; // 100KB - 5MB
    
    return {
      success: true,
      downloadUrl,
      filename,
      format,
      fileSize,
      generatedAt: new Date().toISOString(),
      options,
      message: DEMO_DATA.successMessages.exportComplete
    };
  },

  // 模拟分享API - 生成分享链接
  shareContent: async (content, shareOptions = {}) => {
    await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));
    
    if (Math.random() < 0.02) {
      throw new Error('分享失败，请稍后重试');
    }
    
    const shareId = Math.random().toString(36).substr(2, 9);
    const shareUrl = `${window.location.origin}/share/${shareId}`;
    const expiresAt = new Date(Date.now() + (shareOptions.expireDays || 7) * 24 * 60 * 60 * 1000);
    
    return {
      success: true,
      shareUrl,
      shareId,
      expiresAt: expiresAt.toISOString(),
      accessCount: 0,
      maxAccess: shareOptions.maxAccess || null,
      requirePassword: shareOptions.requirePassword || false,
      message: DEMO_DATA.successMessages.shareComplete
    };
  },

  // 模拟获取课程模板列表
  getCourseTemplates: async (subject, grade, volume) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const templates = DEMO_DATA.coursewareTemplates[subject] || {};
    const filteredTemplates = Object.keys(templates)
      .filter(key => {
        if (grade && !key.includes(grade)) return false;
        if (volume && !key.includes(volume)) return false;
        return true;
      })
      .map(key => ({
        id: key,
        title: templates[key].overview?.title || key,
        description: templates[key].overview?.description || '',
        difficulty: templates[key].overview?.difficulty || '中级',
        duration: templates[key].overview?.duration || '45分钟'
      }));
    
    return {
      success: true,
      data: filteredTemplates,
      total: filteredTemplates.length
    };
  },

  // 模拟保存用户配置
  saveUserPreferences: async (preferences) => {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // 模拟保存到localStorage
    try {
      localStorage.setItem('courseware_preferences', JSON.stringify(preferences));
      return {
        success: true,
        message: '配置已保存'
      };
    } catch (error) {
      throw new Error('保存配置失败');
    }
  },

  // 模拟获取用户配置
  getUserPreferences: async () => {
    await new Promise(resolve => setTimeout(resolve, 50));
    
    try {
      const preferences = localStorage.getItem('courseware_preferences');
      return {
        success: true,
        data: preferences ? JSON.parse(preferences) : null
      };
    } catch (error) {
      return {
        success: true,
        data: null
      };
    }
  }
};

// 工具函数
const Utils = {
  // 格式化时间
  formatDuration: (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  },

  // 生成随机ID
  generateId: () => {
    return Math.random().toString(36).substr(2, 9);
  },

  // 防抖函数
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // 节流函数
  throttle: (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  // 复制到剪贴板
  copyToClipboard: async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // 降级方案
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    }
  },

  // 验证表单数据
  validateFormData: (formData) => {
    const errors = {};
    
    if (!formData.subject) {
      errors.subject = '请选择科目';
    }
    
    if (!formData.grade) {
      errors.grade = '请选择年级';
    }
    
    if (!formData.volume) {
      errors.volume = '请选择册数';
    }
    
    if (!formData.title || formData.title.trim().length < 2) {
      errors.title = '课程标题至少需要2个字符';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // 格式化文件大小
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
};