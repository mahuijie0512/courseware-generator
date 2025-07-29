import { CourseInfo, Diagram, ConceptDefinition } from '../../../shared/types.js';
import axios from 'axios';

export class DiagramGenerator {
  private readonly DIAGRAM_APIS = {
    // 可以集成图表生成服务
    mermaid: 'https://mermaid.ink/img/',
    quickchart: 'https://quickchart.io/chart'
  };

  async generateDiagrams(
    courseInfo: CourseInfo, 
    concepts: ConceptDefinition[]
  ): Promise<Diagram[]> {
    const diagrams: Diagram[] = [];
    
    try {
      // 根据科目类型生成不同类型的图表
      switch (courseInfo.subject.name) {
        case '数学':
          diagrams.push(...await this.generateMathDiagrams(courseInfo, concepts));
          break;
        case '物理':
          diagrams.push(...await this.generatePhysicsDiagrams(courseInfo, concepts));
          break;
        case '化学':
          diagrams.push(...await this.generateChemistryDiagrams(courseInfo, concepts));
          break;
        case '生物':
          diagrams.push(...await this.generateBiologyDiagrams(courseInfo, concepts));
          break;
        default:
          diagrams.push(...await this.generateGenericDiagrams(courseInfo, concepts));
      }
      
      return diagrams;
    } catch (error) {
      console.error('生成示意图失败:', error);
      return [];
    }
  }

  private async generateMathDiagrams(
    courseInfo: CourseInfo, 
    concepts: ConceptDefinition[]
  ): Promise<Diagram[]> {
    const diagrams: Diagram[] = [];
    
    // 生成函数图像、几何图形等
    if (courseInfo.title.includes('函数')) {
      diagrams.push({
        id: 'math-function-graph',
        title: '函数图像',
        type: 'interactive',
        url: await this.generateFunctionGraph(courseInfo.title),
        description: '交互式函数图像，可调整参数观察变化',
        tags: ['函数', '图像', '交互']
      });
    }
    
    if (courseInfo.title.includes('几何')) {
      diagrams.push({
        id: 'math-geometry',
        title: '几何图形',
        type: 'static',
        url: await this.generateGeometryDiagram(concepts),
        description: '几何概念示意图',
        tags: ['几何', '图形', '证明']
      });
    }
    
    return diagrams;
  }

  private async generatePhysicsDiagrams(
    courseInfo: CourseInfo, 
    concepts: ConceptDefinition[]
  ): Promise<Diagram[]> {
    const diagrams: Diagram[] = [];
    
    // 生成物理实验装置图、力学分析图等
    if (courseInfo.title.includes('力学')) {
      diagrams.push({
        id: 'physics-mechanics',
        title: '力学分析图',
        type: 'animated',
        url: await this.generateMechanicsDiagram(concepts),
        description: '力的分析和运动轨迹演示',
        tags: ['力学', '运动', '分析']
      });
    }
    
    if (courseInfo.title.includes('电路')) {
      diagrams.push({
        id: 'physics-circuit',
        title: '电路图',
        type: 'interactive',
        url: await this.generateCircuitDiagram(concepts),
        description: '可交互的电路原理图',
        tags: ['电路', '电流', '电压']
      });
    }
    
    return diagrams;
  }

  private async generateChemistryDiagrams(
    courseInfo: CourseInfo, 
    concepts: ConceptDefinition[]
  ): Promise<Diagram[]> {
    const diagrams: Diagram[] = [];
    
    // 生成分子结构图、反应机理图等
    if (courseInfo.title.includes('分子') || courseInfo.title.includes('结构')) {
      diagrams.push({
        id: 'chemistry-molecule',
        title: '分子结构图',
        type: 'interactive',
        url: await this.generateMoleculeStructure(concepts),
        description: '3D分子结构模型，可旋转查看',
        tags: ['分子', '结构', '3D']
      });
    }
    
    if (courseInfo.title.includes('反应')) {
      diagrams.push({
        id: 'chemistry-reaction',
        title: '化学反应机理',
        type: 'animated',
        url: await this.generateReactionMechanism(concepts),
        description: '化学反应过程动画演示',
        tags: ['反应', '机理', '动画']
      });
    }
    
    return diagrams;
  }

  private async generateBiologyDiagrams(
    courseInfo: CourseInfo, 
    concepts: ConceptDefinition[]
  ): Promise<Diagram[]> {
    const diagrams: Diagram[] = [];
    
    // 生成细胞结构图、生物过程图等
    if (courseInfo.title.includes('细胞')) {
      diagrams.push({
        id: 'biology-cell',
        title: '细胞结构图',
        type: 'interactive',
        url: await this.generateCellStructure(concepts),
        description: '细胞各部分结构详解',
        tags: ['细胞', '结构', '器官']
      });
    }
    
    return diagrams;
  }

  private async generateGenericDiagrams(
    courseInfo: CourseInfo, 
    concepts: ConceptDefinition[]
  ): Promise<Diagram[]> {
    // 生成通用的概念图、流程图等
    return [
      {
        id: 'generic-concept-map',
        title: '概念关系图',
        type: 'static',
        url: await this.generateConceptMap(concepts),
        description: '课程核心概念及其关系',
        tags: ['概念', '关系', '总结']
      }
    ];
  }

  // 具体的图表生成方法
  private async generateFunctionGraph(title: string): Promise<string> {
    // 根据函数类型生成相应的图表配置
    let chartConfig;
    
    if (title.includes('二次函数') || title.includes('抛物线')) {
      chartConfig = {
        type: 'line',
        data: {
          datasets: [{
            label: 'y = ax² + bx + c',
            data: Array.from({length: 21}, (_, i) => {
              const x = i - 10;
              return {x, y: 0.1 * x * x - 2 * x + 1};
            }),
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: false
          }]
        },
        options: {
          responsive: true,
          scales: {
            x: { type: 'linear', position: 'bottom', title: { display: true, text: 'x' }},
            y: { title: { display: true, text: 'y' }}
          },
          plugins: {
            title: { display: true, text: '二次函数图像' }
          }
        }
      };
    } else if (title.includes('正弦') || title.includes('三角函数')) {
      chartConfig = {
        type: 'line',
        data: {
          datasets: [{
            label: 'y = sin(x)',
            data: Array.from({length: 61}, (_, i) => {
              const x = (i - 30) * 0.2;
              return {x, y: Math.sin(x)};
            }),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: false
          }]
        },
        options: {
          responsive: true,
          scales: {
            x: { type: 'linear', position: 'bottom', title: { display: true, text: 'x (弧度)' }},
            y: { title: { display: true, text: 'y' }, min: -1.5, max: 1.5 }
          },
          plugins: {
            title: { display: true, text: '正弦函数图像' }
          }
        }
      };
    } else {
      // 默认线性函数
      chartConfig = {
        type: 'line',
        data: {
          datasets: [{
            label: 'y = kx + b',
            data: [{x: -5, y: -3}, {x: 0, y: 2}, {x: 5, y: 7}],
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            fill: false
          }]
        },
        options: {
          responsive: true,
          scales: {
            x: { type: 'linear', position: 'bottom', title: { display: true, text: 'x' }},
            y: { title: { display: true, text: 'y' }}
          },
          plugins: {
            title: { display: true, text: '一次函数图像' }
          }
        }
      };
    }

    return await this.generateChart(chartConfig);
  }

  private async generateGeometryDiagram(concepts: ConceptDefinition[]): Promise<string> {
    // 生成几何图形
    const geometryCode = `
graph LR
    A[点] --> B[线]
    B --> C[面]
    C --> D[体]
`;
    return `${this.DIAGRAM_APIS.mermaid}${encodeURIComponent(geometryCode)}`;
  }

  private async generateMechanicsDiagram(concepts: ConceptDefinition[]): Promise<string> {
    // 生成力学分析图 - 使用Mermaid绘制力的分解图
    const mermaidCode = `
graph TD
    A[物体] --> B[重力 G]
    A --> C[支持力 N]
    A --> D[摩擦力 f]
    B --> E[G = mg]
    C --> F[N ⊥ 接触面]
    D --> G[f = μN]
    
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style B fill:#bbf,stroke:#333,stroke-width:2px
    style C fill:#bfb,stroke:#333,stroke-width:2px
    style D fill:#fbb,stroke:#333,stroke-width:2px
`;
    return `${this.DIAGRAM_APIS.mermaid}${encodeURIComponent(mermaidCode)}`;
  }

  private async generateCircuitDiagram(concepts: ConceptDefinition[]): Promise<string> {
    // 生成电路图 - 基本串联电路
    const mermaidCode = `
graph LR
    A[电源 +] --> B[开关 S]
    B --> C[电阻 R1]
    C --> D[电阻 R2]
    D --> E[电流表 A]
    E --> F[电源 -]
    
    G[电压表 V] -.-> C
    G -.-> D
    
    style A fill:#f96,stroke:#333,stroke-width:2px
    style B fill:#9f6,stroke:#333,stroke-width:2px
    style C fill:#69f,stroke:#333,stroke-width:2px
    style D fill:#69f,stroke:#333,stroke-width:2px
    style E fill:#f69,stroke:#333,stroke-width:2px
    style F fill:#666,stroke:#333,stroke-width:2px
    style G fill:#6f9,stroke:#333,stroke-width:2px
`;
    return `${this.DIAGRAM_APIS.mermaid}${encodeURIComponent(mermaidCode)}`;
  }

  private async generateMoleculeStructure(concepts: ConceptDefinition[]): Promise<string> {
    // 生成分子结构图 - 以水分子为例
    const mermaidCode = `
graph TD
    O[氧原子 O] --> H1[氢原子 H]
    O --> H2[氢原子 H]
    
    O -.-> |104.5°| H1
    O -.-> |104.5°| H2
    H1 -.-> |键长 0.96Å| O
    H2 -.-> |键长 0.96Å| O
    
    style O fill:#ff6b6b,stroke:#333,stroke-width:3px
    style H1 fill:#4ecdc4,stroke:#333,stroke-width:2px
    style H2 fill:#4ecdc4,stroke:#333,stroke-width:2px
`;
    return `${this.DIAGRAM_APIS.mermaid}${encodeURIComponent(mermaidCode)}`;
  }

  private async generateReactionMechanism(concepts: ConceptDefinition[]): Promise<string> {
    // 生成化学反应机理图 - 以燃烧反应为例
    const mermaidCode = `
graph LR
    A[CH₄ + 2O₂] --> B[反应过程]
    B --> C[CO₂ + 2H₂O]
    
    D[反应条件] --> B
    D --> E[点燃]
    D --> F[高温]
    
    G[能量变化] --> H[放热反应]
    H --> I[ΔH < 0]
    
    style A fill:#ffe66d,stroke:#333,stroke-width:2px
    style C fill:#a8e6cf,stroke:#333,stroke-width:2px
    style B fill:#ff8b94,stroke:#333,stroke-width:2px
    style H fill:#ffaaa5,stroke:#333,stroke-width:2px
`;
    return `${this.DIAGRAM_APIS.mermaid}${encodeURIComponent(mermaidCode)}`;
  }

  private async generateCellStructure(concepts: ConceptDefinition[]): Promise<string> {
    // 生成细胞结构图
    const mermaidCode = `
graph TD
    A[细胞] --> B[细胞膜]
    A --> C[细胞质]
    A --> D[细胞核]
    
    C --> E[线粒体]
    C --> F[内质网]
    C --> G[高尔基体]
    C --> H[核糖体]
    
    D --> I[核膜]
    D --> J[染色质]
    D --> K[核仁]
    
    E --> L[产生ATP]
    F --> M[蛋白质合成]
    G --> N[蛋白质加工]
    H --> O[蛋白质合成]
    
    style A fill:#e8f5e8,stroke:#333,stroke-width:3px
    style B fill:#ffd93d,stroke:#333,stroke-width:2px
    style C fill:#6bcf7f,stroke:#333,stroke-width:2px
    style D fill:#4d96ff,stroke:#333,stroke-width:2px
    style E fill:#ff6b6b,stroke:#333,stroke-width:2px
`;
    return `${this.DIAGRAM_APIS.mermaid}${encodeURIComponent(mermaidCode)}`;
  }

  private async generateConceptMap(concepts: ConceptDefinition[]): Promise<string> {
    // 生成概念关系图
    const conceptNodes = concepts.map(c => c.term).join(' --> ');
    const mermaidCode = `
graph TD
    ${conceptNodes}
`;
    return `${this.DIAGRAM_APIS.mermaid}${encodeURIComponent(mermaidCode)}`;
  }

  // 使用QuickChart生成图表
  private async generateChart(config: any): Promise<string> {
    try {
      const response = await axios.post(this.DIAGRAM_APIS.quickchart, {
        chart: config,
        width: 800,
        height: 600,
        format: 'png'
      });
      
      return response.data.url;
    } catch (error) {
      console.error('生成图表失败:', error);
      return 'https://via.placeholder.com/800x600?text=图表生成失败';
    }
  }
}