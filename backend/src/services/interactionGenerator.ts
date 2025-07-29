import { CourseInfo, InteractiveComponent, ConceptDefinition } from '../../../shared/types.js';
import OpenAI from 'openai';

export class InteractionGenerator {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateInteractions(
    courseInfo: CourseInfo, 
    concepts: ConceptDefinition[]
  ): Promise<InteractiveComponent[]> {
    const interactions: InteractiveComponent[] = [];

    try {
      // 根据科目生成不同类型的交互组件
      switch (courseInfo.subject.name) {
        case '数学':
          interactions.push(...await this.generateMathInteractions(courseInfo, concepts));
          break;
        case '物理':
          interactions.push(...await this.generatePhysicsInteractions(courseInfo, concepts));
          break;
        case '化学':
          interactions.push(...await this.generateChemistryInteractions(courseInfo, concepts));
          break;
        case '生物':
          interactions.push(...await this.generateBiologyInteractions(courseInfo, concepts));
          break;
        default:
          interactions.push(...await this.generateGenericInteractions(courseInfo, concepts));
      }

      return interactions;
    } catch (error) {
      console.error('生成交互组件失败:', error);
      return [];
    }
  }

  private async generateMathInteractions(
    courseInfo: CourseInfo, 
    concepts: ConceptDefinition[]
  ): Promise<InteractiveComponent[]> {
    const interactions: InteractiveComponent[] = [];

    // 数学练习题
    interactions.push({
      id: 'math-quiz-1',
      type: 'quiz',
      title: '基础概念测试',
      difficulty: 'easy',
      content: {
        questions: await this.generateMathQuestions(courseInfo, concepts, 'easy'),
        timeLimit: 300, // 5分钟
        passingScore: 70
      }
    });

    // 函数图像交互
    if (courseInfo.title.includes('函数')) {
      interactions.push({
        id: 'math-function-interactive',
        type: 'simulation',
        title: '函数参数调节器',
        difficulty: 'medium',
        content: {
          type: 'function-plotter',
          defaultFunction: 'y = ax² + bx + c',
          parameters: [
            { name: 'a', min: -5, max: 5, default: 1, step: 0.1 },
            { name: 'b', min: -10, max: 10, default: 0, step: 0.5 },
            { name: 'c', min: -10, max: 10, default: 0, step: 0.5 }
          ],
          instructions: '调整参数观察函数图像的变化'
        }
      });
    }

    // 几何证明练习
    if (courseInfo.title.includes('几何')) {
      interactions.push({
        id: 'math-geometry-proof',
        type: 'exercise',
        title: '几何证明步骤',
        difficulty: 'hard',
        content: {
          type: 'step-by-step-proof',
          theorem: '三角形内角和等于180°',
          steps: [
            '画出三角形ABC',
            '过点A作BC的平行线',
            '利用平行线性质',
            '得出角度关系',
            '证明内角和为180°'
          ],
          hints: ['考虑平行线的性质', '内错角相等', '同旁内角互补']
        }
      });
    }

    return interactions;
  }

  private async generatePhysicsInteractions(
    courseInfo: CourseInfo, 
    concepts: ConceptDefinition[]
  ): Promise<InteractiveComponent[]> {
    const interactions: InteractiveComponent[] = [];

    // 物理实验模拟
    if (courseInfo.title.includes('力学')) {
      interactions.push({
        id: 'physics-mechanics-sim',
        type: 'simulation',
        title: '力学实验模拟',
        difficulty: 'medium',
        content: {
          type: 'physics-simulation',
          scenario: 'inclined-plane',
          objects: [
            { type: 'block', mass: 2, position: [0, 5] },
            { type: 'incline', angle: 30, friction: 0.3 }
          ],
          controls: ['mass', 'angle', 'friction'],
          measurements: ['acceleration', 'velocity', 'force'],
          instructions: '调整物体质量、斜面角度和摩擦系数，观察运动变化'
        }
      });
    }

    // 电路实验
    if (courseInfo.title.includes('电路')) {
      interactions.push({
        id: 'physics-circuit-lab',
        type: 'experiment',
        title: '虚拟电路实验',
        difficulty: 'medium',
        content: {
          type: 'circuit-builder',
          components: ['battery', 'resistor', 'led', 'switch', 'ammeter', 'voltmeter'],
          workspace: { width: 800, height: 600 },
          objectives: [
            '搭建串联电路',
            '测量电流和电压',
            '验证欧姆定律'
          ],
          instructions: '拖拽元件搭建电路，使用仪表测量电学量'
        }
      });
    }

    return interactions;
  }

  private async generateChemistryInteractions(
    courseInfo: CourseInfo, 
    concepts: ConceptDefinition[]
  ): Promise<InteractiveComponent[]> {
    const interactions: InteractiveComponent[] = [];

    // 化学反应模拟
    interactions.push({
      id: 'chemistry-reaction-sim',
      type: 'simulation',
      title: '化学反应模拟器',
      difficulty: 'medium',
      content: {
        type: 'reaction-simulator',
        reactions: [
          {
            reactants: ['H₂', 'O₂'],
            products: ['H₂O'],
            equation: '2H₂ + O₂ → 2H₂O',
            conditions: ['点燃', '高温']
          }
        ],
        controls: ['temperature', 'pressure', 'concentration'],
        animations: true,
        instructions: '调整反应条件，观察反应速率和产物变化'
      }
    });

    // 分子结构搭建
    if (courseInfo.title.includes('分子') || courseInfo.title.includes('结构')) {
      interactions.push({
        id: 'chemistry-molecule-builder',
        type: 'exercise',
        title: '分子结构搭建',
        difficulty: 'medium',
        content: {
          type: 'molecule-builder',
          atoms: ['C', 'H', 'O', 'N'],
          bonds: ['single', 'double', 'triple'],
          targets: ['CH₄', 'H₂O', 'CO₂', 'NH₃'],
          validation: true,
          instructions: '使用原子和化学键搭建指定分子'
        }
      });
    }

    return interactions;
  }

  private async generateBiologyInteractions(
    courseInfo: CourseInfo, 
    concepts: ConceptDefinition[]
  ): Promise<InteractiveComponent[]> {
    const interactions: InteractiveComponent[] = [];

    // 细胞结构标注
    if (courseInfo.title.includes('细胞')) {
      interactions.push({
        id: 'biology-cell-labeling',
        type: 'exercise',
        title: '细胞结构标注',
        difficulty: 'easy',
        content: {
          type: 'image-labeling',
          image: '/images/cell-structure.png',
          labels: [
            { name: '细胞膜', position: [100, 150] },
            { name: '细胞核', position: [200, 200] },
            { name: '线粒体', position: [150, 180] },
            { name: '内质网', position: [180, 160] }
          ],
          instructions: '点击图像中的相应位置，标注细胞结构名称'
        }
      });
    }

    // 生物过程模拟
    interactions.push({
      id: 'biology-process-sim',
      type: 'simulation',
      title: '生物过程模拟',
      difficulty: 'medium',
      content: {
        type: 'process-animation',
        process: 'photosynthesis',
        stages: [
          '光反应阶段',
          '暗反应阶段',
          'ATP和NADPH的产生',
          '葡萄糖的合成'
        ],
        controls: ['light-intensity', 'co2-concentration', 'temperature'],
        instructions: '调整环境条件，观察光合作用过程的变化'
      }
    });

    return interactions;
  }

  private async generateGenericInteractions(
    courseInfo: CourseInfo, 
    concepts: ConceptDefinition[]
  ): Promise<InteractiveComponent[]> {
    return [
      {
        id: 'generic-concept-quiz',
        type: 'quiz',
        title: '概念理解测试',
        difficulty: 'medium',
        content: {
          questions: await this.generateGenericQuestions(courseInfo, concepts),
          timeLimit: 600,
          passingScore: 75
        }
      }
    ];
  }

  private async generateMathQuestions(
    courseInfo: CourseInfo, 
    concepts: ConceptDefinition[], 
    difficulty: string
  ): Promise<any[]> {
    const prompt = `
基于以下数学课程信息生成${difficulty === 'easy' ? '5' : '8'}道选择题：

课程：${courseInfo.title}
概念：${concepts.map(c => c.term).join(', ')}
难度：${difficulty}

请返回JSON格式，每道题包括：
- question: 题目
- options: 选项数组 [A, B, C, D]
- correct: 正确答案索引 (0-3)
- explanation: 解析

确保题目准确，符合高中数学水平。
`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content || '[]';
      return JSON.parse(content);
    } catch (error) {
      console.error('生成数学题目失败:', error);
      return [];
    }
  }

  private async generateGenericQuestions(
    courseInfo: CourseInfo, 
    concepts: ConceptDefinition[]
  ): Promise<any[]> {
    const prompt = `
基于以下课程信息生成6道理解性问题：

科目：${courseInfo.subject.name}
课程：${courseInfo.title}
概念：${concepts.map(c => c.term).join(', ')}

请返回JSON格式，每道题包括：
- question: 题目
- type: 'multiple-choice' | 'true-false' | 'short-answer'
- options: 选项数组（如果是选择题）
- correct: 正确答案
- explanation: 解析

题目要测试学生对核心概念的理解。
`;

    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.6,
      });

      const content = response.choices[0]?.message?.content || '[]';
      return JSON.parse(content);
    } catch (error) {
      console.error('生成通用题目失败:', error);
      return [];
    }
  }
}