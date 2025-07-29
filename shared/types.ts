// 共享类型定义

export interface Subject {
  id: string;
  name: string;
  icon: string;
}

export interface Grade {
  id: string;
  name: string;
  level: number;
}

export interface Volume {
  id: string;
  name: string;
  semester: 'first' | 'second';
}

export interface CourseInfo {
  subject: Subject;
  grade: Grade;
  volume: Volume;
  title: string;
}

export interface CourseContent {
  overview: string;
  concepts: ConceptDefinition[];
  formulas: Formula[];
  diagrams: Diagram[];
  interactions: InteractiveComponent[];
  resources: MediaResource[];
}

export interface ConceptDefinition {
  id: string;
  term: string;
  definition: string;
  examples: string[];
  relatedConcepts: string[];
}

export interface Formula {
  id: string;
  name: string;
  expression: string;
  description: string;
  variables: Variable[];
  applications: string[];
}

export interface Variable {
  symbol: string;
  name: string;
  unit?: string;
  description: string;
}

export interface Diagram {
  id: string;
  title: string;
  type: 'static' | 'animated' | 'interactive';
  url: string;
  description: string;
  tags: string[];
}

export interface InteractiveComponent {
  id: string;
  type: 'quiz' | 'simulation' | 'exercise' | 'experiment';
  title: string;
  content: any; // 具体内容根据类型而定
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface MediaResource {
  id: string;
  type: 'image' | 'video' | 'animation' | 'document';
  title: string;
  url: string;
  source: string;
  quality: 'high' | 'medium' | 'low';
  relevanceScore: number;
}

export interface GenerationRequest {
  courseInfo: CourseInfo;
  options: GenerationOptions;
}

export interface GenerationOptions {
  includeInteractions: boolean;
  searchOnlineResources: boolean;
  generateDiagrams: boolean;
  difficultyLevel: 'basic' | 'intermediate' | 'advanced';
  language: 'zh-CN' | 'en-US';
}

export interface GenerationResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  content?: CourseContent;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}