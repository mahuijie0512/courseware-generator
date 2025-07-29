# 前端用户界面Demo设计文档

## 概述

本设计文档详细描述了高中课件生成器前端用户界面demo的技术架构、组件设计和实现方案。该demo将作为一个独立的HTML页面，展示完整的用户交互流程和课件生成体验，使用现代Web技术栈实现响应式设计和流畅的用户体验。

## 架构

### 技术栈选择
- **HTML5**: 语义化标记和现代Web标准
- **CSS3**: Flexbox/Grid布局、CSS变量、动画和响应式设计
- **Vanilla JavaScript**: 原生JS实现交互逻辑，避免框架依赖
- **Web APIs**: LocalStorage、Fetch API、File API等现代浏览器API

### 文件结构
```
index.html                 # 主HTML文件
├── styles/
│   ├── main.css           # 主样式文件
│   ├── components.css     # 组件样式
│   └── responsive.css     # 响应式样式
├── scripts/
│   ├── app.js            # 主应用逻辑
│   ├── courseware.js     # 课件生成逻辑
│   ├── ui.js             # UI交互逻辑
│   └── demo-data.js      # 演示数据
└── assets/
    ├── icons/            # 图标资源
    └── images/           # 图片资源
```

### 模块化设计
- **App Module**: 主应用控制器，管理应用状态和路由
- **UI Module**: 用户界面管理，处理DOM操作和事件
- **Courseware Module**: 课件生成逻辑，模拟后端API调用
- **Data Module**: 数据管理，包括演示数据和状态管理

## 组件和接口

### 1. 主应用容器 (App Container)
```html
<div id="app" class="app-container">
  <header class="app-header">
    <h1>高中课件生成器</h1>
    <nav class="app-nav">...</nav>
  </header>
  <main class="app-main">
    <div id="course-input-section">...</div>
    <div id="generation-section">...</div>
    <div id="content-display-section">...</div>
  </main>
  <footer class="app-footer">...</footer>
</div>
```

**接口设计:**
```javascript
class App {
  constructor()
  init()
  setState(newState)
  getState()
  navigate(section)
}
```

### 2. 课程信息输入组件 (Course Input Component)
```html
<form id="course-form" class="course-form">
  <div class="form-group">
    <label for="subject">科目</label>
    <select id="subject" name="subject" required>
      <option value="math" selected>数学</option>
      <option value="physics">物理</option>
      <option value="chemistry">化学</option>
      <option value="biology">生物</option>
    </select>
  </div>
  <div class="form-group">
    <label for="grade">年级</label>
    <select id="grade" name="grade" required>
      <option value="">请选择年级</option>
      <option value="高一">高一</option>
      <option value="高二">高二</option>
      <option value="高三">高三</option>
    </select>
  </div>
  <div class="form-group">
    <label for="volume">册数</label>
    <select id="volume" name="volume" required>
      <option value="">请选择册数</option>
      <option value="上册">上册</option>
      <option value="下册">下册</option>
    </select>
  </div>
  <div class="form-group">
    <label for="title">课程标题</label>
    <select id="title" name="title" required>
      <option value="">请先选择科目、年级和册数</option>
    </select>
  </div>
  <button type="submit" class="generate-btn" disabled>生成课件</button>
</form>
```

**接口设计:**
```javascript
class CourseInputComponent {
  constructor(container)
  render()
  validate()
  getData()
  reset()
  onSubmit(callback)
}
```

### 3. 生成选项配置组件 (Generation Options Component)
```html
<div class="options-panel" id="generation-options">
  <h3>生成选项</h3>
  <div class="option-group">
    <label class="switch">
      <input type="checkbox" id="include-interactions" checked>
      <span class="slider">包含交互组件</span>
    </label>
  </div>
  <!-- 其他选项 -->
</div>
```

**接口设计:**
```javascript
class GenerationOptionsComponent {
  constructor(container)
  render()
  getOptions()
  setOptions(options)
  toggle()
}
```

### 4. 进度显示组件 (Progress Component)
```html
<div class="progress-container" id="progress-display">
  <div class="progress-header">
    <h3>正在生成课件...</h3>
    <span class="progress-percentage">0%</span>
  </div>
  <div class="progress-bar">
    <div class="progress-fill"></div>
  </div>
  <div class="progress-status">初始化...</div>
</div>
```

**接口设计:**
```javascript
class ProgressComponent {
  constructor(container)
  show()
  hide()
  updateProgress(percentage, status)
  complete()
  error(message)
}
```

### 5. 课件内容展示组件 (Content Display Component)
```html
<div class="content-display" id="courseware-content">
  <div class="content-tabs">
    <button class="tab-btn active" data-tab="overview">概述</button>
    <button class="tab-btn" data-tab="concepts">概念</button>
    <button class="tab-btn" data-tab="formulas">公式</button>
    <button class="tab-btn" data-tab="diagrams">示意图</button>
    <button class="tab-btn" data-tab="interactions">交互</button>
    <button class="tab-btn" data-tab="resources">资源</button>
  </div>
  <div class="content-panels">
    <div class="content-panel active" id="overview-panel">...</div>
    <!-- 其他面板 -->
  </div>
</div>
```

**接口设计:**
```javascript
class ContentDisplayComponent {
  constructor(container)
  render(courseContent)
  switchTab(tabName)
  renderOverview(overview)
  renderConcepts(concepts)
  renderFormulas(formulas)
  renderDiagrams(diagrams)
  renderInteractions(interactions)
  renderResources(resources)
}
```

### 6. 导出功能组件 (Export Component)
```html
<div class="export-panel" id="export-options">
  <h3>导出课件</h3>
  <div class="export-buttons">
    <button class="export-btn" data-format="ppt">
      <i class="icon-ppt"></i>导出PPT
    </button>
    <button class="export-btn" data-format="pdf">
      <i class="icon-pdf"></i>导出PDF
    </button>
    <button class="export-btn" data-format="html">
      <i class="icon-html"></i>导出HTML
    </button>
    <button class="share-btn">
      <i class="icon-share"></i>分享链接
    </button>
  </div>
</div>
```

**接口设计:**
```javascript
class ExportComponent {
  constructor(container)
  render()
  exportToPPT(content)
  exportToPDF(content)
  exportToHTML(content)
  generateShareLink(content)
  showExportProgress()
}
```

## 数据模型

### 应用状态管理
```javascript
const AppState = {
  currentSection: 'input', // 'input' | 'generating' | 'display'
  courseInfo: {
    subject: 'math',
    grade: '',
    volume: '',
    title: ''
  },
  generationOptions: {
    includeInteractions: true,
    searchOnlineResources: true,
    generateDiagrams: true,
    difficultyLevel: 'intermediate',
    language: 'zh-CN'
  },
  generationProgress: {
    percentage: 0,
    status: '',
    isGenerating: false
  },
  courseContent: null,
  error: null
}
```

### 演示数据结构
```javascript
const DemoData = {
  subjects: [
    { id: 'math', name: '数学', icon: 'icon-math' },
    { id: 'physics', name: '物理', icon: 'icon-physics' },
    { id: 'chemistry', name: '化学', icon: 'icon-chemistry' },
    { id: 'biology', name: '生物', icon: 'icon-biology' }
  ],
  sampleCourseContent: {
    overview: "本课程介绍...",
    concepts: [...],
    formulas: [...],
    diagrams: [...],
    interactions: [...],
    resources: [...]
  }
}
```

## 错误处理

### 错误类型定义
```javascript
const ErrorTypes = {
  VALIDATION_ERROR: 'validation_error',
  GENERATION_ERROR: 'generation_error',
  EXPORT_ERROR: 'export_error',
  NETWORK_ERROR: 'network_error'
}
```

### 错误处理策略
1. **输入验证错误**: 实时表单验证，显示字段级错误提示
2. **生成过程错误**: 显示友好的错误消息，提供重试选项
3. **导出错误**: 显示具体的导出失败原因，建议替代方案
4. **网络错误**: 检测网络状态，提供离线模式提示

### 错误UI组件
```html
<div class="error-message" id="error-display">
  <div class="error-icon">⚠️</div>
  <div class="error-content">
    <h4 class="error-title">操作失败</h4>
    <p class="error-description">...</p>
    <div class="error-actions">
      <button class="retry-btn">重试</button>
      <button class="dismiss-btn">关闭</button>
    </div>
  </div>
</div>
```

## 实现重点

### 核心功能优先级
1. **基础UI结构**: 完整的HTML结构和基础样式
2. **表单交互**: 课程信息输入和验证
3. **模拟生成**: 使用演示数据模拟课件生成过程
4. **内容展示**: 生成结果的可视化展示
5. **PC端优化**: 充分利用桌面环境的屏幕空间和交互优势

### 简化实现策略
- 使用原生JavaScript避免框架复杂性
- 内置演示数据提供完整体验
- 重点关注用户交互和视觉效果
- 模拟后端API调用展示完整流程