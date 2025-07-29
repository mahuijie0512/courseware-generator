// 简化版UI管理器
class UIManager {
  constructor() {
    this.currentSection = 'course-input-section';
    this.formData = {};
    this.validationErrors = {};
    this.isFormValid = false;
    this.stateActions = null;
    this.stateSelectors = null;
    this.animationManager = null;
    this.errorHandler = null;
    
    console.log('UIManager 初始化');
    this.init();
  }

  init() {
    this.bindEvents();
    this.initializeForm();
  }

  // 设置状态管理器引用
  setStateManager(stateActions, stateSelectors) {
    this.stateActions = stateActions;
    this.stateSelectors = stateSelectors;
  }

  // 设置动画管理器引用
  setAnimationManager(animationManager) {
    this.animationManager = animationManager;
  }

  // 设置错误处理器引用
  setErrorHandler(errorHandler) {
    this.errorHandler = errorHandler;
  }

  // 绑定事件监听器
  bindEvents() {
    const form = document.getElementById('course-form');
    if (form) {
      form.addEventListener('submit', this.handleFormSubmit.bind(this));
      
      const inputs = form.querySelectorAll('input, select');
      inputs.forEach(input => {
        input.addEventListener('input', this.handleInputChange.bind(this));
        input.addEventListener('blur', this.handleInputBlur.bind(this));
      });
    }

    // 标签页切换
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', this.handleTabClick.bind(this));
    });
  }

  // 初始化表单
  initializeForm() {
    this.collectFormData();
    this.validateForm();
    this.updateGenerateButton();
  }

  // 处理输入变化
  handleInputChange(event) {
    const { name, value, type, checked } = event.target;
    
    if (type === 'checkbox') {
      this.formData[name] = checked;
    } else {
      this.formData[name] = value;
    }

    this.validateField(name, value);
    this.validateForm();
    this.updateGenerateButton();
  }

  // 处理输入失焦
  handleInputBlur(event) {
    const { name, value } = event.target;
    this.validateField(name, value);
    this.updateFieldError(name);
  }

  // 收集表单数据
  collectFormData() {
    const form = document.getElementById('course-form');
    if (!form) return;

    const formData = new FormData(form);
    this.formData = {};

    for (let [key, value] of formData.entries()) {
      this.formData[key] = value;
    }

    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      this.formData[checkbox.id] = checkbox.checked;
    });
  }

  // 验证单个字段
  validateField(name, value) {
    delete this.validationErrors[name];

    switch (name) {
      case 'subject':
        if (!value) {
          this.validationErrors[name] = '请选择科目';
        }
        break;
      case 'grade':
        if (!value) {
          this.validationErrors[name] = '请选择年级';
        }
        break;
      case 'volume':
        if (!value) {
          this.validationErrors[name] = '请选择册数';
        }
        break;
      case 'title':
        if (!value || value.trim().length === 0) {
          this.validationErrors[name] = '请输入课程标题';
        } else if (value.trim().length < 2) {
          this.validationErrors[name] = '课程标题至少需要2个字符';
        }
        break;
    }
  }

  // 验证整个表单
  validateForm() {
    this.collectFormData();

    const requiredFields = ['subject', 'grade', 'volume', 'title'];
    requiredFields.forEach(field => {
      this.validateField(field, this.formData[field]);
    });

    this.isFormValid = Object.keys(this.validationErrors).length === 0;
    return this.isFormValid;
  }

  // 更新字段错误显示
  updateFieldError(fieldName) {
    const errorElement = document.getElementById(`${fieldName}-error`);
    const inputElement = document.querySelector(`[name="${fieldName}"]`);

    if (this.validationErrors[fieldName]) {
      if (errorElement) {
        errorElement.textContent = this.validationErrors[fieldName];
        errorElement.style.display = 'block';
      }
      if (inputElement) {
        inputElement.classList.add('error');
      }
    } else {
      if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
      }
      if (inputElement) {
        inputElement.classList.remove('error');
      }
    }
  }

  // 更新生成按钮状态
  updateGenerateButton() {
    const generateBtn = document.getElementById('generate-btn');
    if (!generateBtn) return;

    if (this.isFormValid) {
      generateBtn.disabled = false;
      generateBtn.classList.remove('disabled');
    } else {
      generateBtn.disabled = true;
      generateBtn.classList.add('disabled');
    }
  }

  // 处理表单提交
  handleFormSubmit(event) {
    event.preventDefault();
    
    if (this.validateForm()) {
      this.startGeneration();
    } else {
      this.showValidationErrors();
    }
  }

  // 显示验证错误
  showValidationErrors() {
    Object.keys(this.validationErrors).forEach(fieldName => {
      this.updateFieldError(fieldName);
    });

    const firstErrorField = document.querySelector('.error');
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      firstErrorField.focus();
    }
  }

  // 开始生成过程
  startGeneration() {
    this.switchSection('generation-section');
    
    // 模拟生成过程
    this.simulateGeneration();
  }

  // 模拟生成过程
  async simulateGeneration() {
    const progressBar = document.querySelector('.progress-fill');
    const progressPercentage = document.querySelector('.progress-percentage');
    const progressStatus = document.querySelector('.progress-status');
    
    const steps = [
      { name: '初始化', duration: 1000 },
      { name: '生成概述', duration: 1500 },
      { name: '提取概念', duration: 1200 },
      { name: '整理公式', duration: 1800 },
      { name: '完成', duration: 500 }
    ];
    
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const progress = Math.round(((i + 1) / steps.length) * 100);
      
      if (progressStatus) progressStatus.textContent = step.name;
      if (progressPercentage) progressPercentage.textContent = `${progress}%`;
      if (progressBar) progressBar.style.width = `${progress}%`;
      
      await new Promise(resolve => setTimeout(resolve, step.duration));
    }
    
    // 生成完成
    this.completeGeneration();
  }

  // 完成生成
  completeGeneration() {
    this.switchSection('content-display-section');
    this.displayContent();
  }

  // 显示内容
  displayContent() {
    const contentDisplay = document.getElementById('courseware-content');
    if (contentDisplay && window.DEMO_DATA) {
      this.renderCoursewareContent(window.DEMO_DATA.sampleCourseware);
    }
  }

  // 渲染课件内容
  renderCoursewareContent(content) {
    if (!content) return;

    // 渲染概述
    this.renderOverview(content.overview);
    
    // 渲染概念
    this.renderConcepts(content.concepts);
    
    // 渲染公式
    this.renderFormulas(content.formulas);
  }

  // 渲染概述
  renderOverview(overview) {
    const panel = document.getElementById('overview-panel');
    if (!panel || !overview) return;

    panel.innerHTML = `
      <div class="overview-content">
        <h3>${overview.title}</h3>
        <p class="overview-description">${overview.description}</p>
        
        <div class="overview-section">
          <h4>学习目标</h4>
          <ul class="objectives-list">
            ${overview.objectives.map(obj => `<li>${obj}</li>`).join('')}
          </ul>
        </div>
        
        <div class="overview-section">
          <h4>重点内容</h4>
          <ul class="key-points-list">
            ${overview.keyPoints.map(point => `<li>${point}</li>`).join('')}
          </ul>
        </div>
        
        <div class="overview-meta">
          <span class="duration">时长: ${overview.duration}</span>
          <span class="difficulty">难度: ${overview.difficulty}</span>
        </div>
      </div>
    `;
  }

  // 渲染概念
  renderConcepts(concepts) {
    const panel = document.getElementById('concepts-panel');
    if (!panel || !concepts) return;

    panel.innerHTML = `
      <div class="concepts-content">
        ${concepts.map(concept => `
          <div class="concept-card" data-importance="${concept.importance}">
            <h4>${concept.name}</h4>
            <p class="concept-description">${concept.description}</p>
            <div class="concept-details">${concept.details}</div>
            <div class="concept-examples">
              <h5>示例：</h5>
              <ul>
                ${concept.examples.map(example => `<li><code>${example}</code></li>`).join('')}
              </ul>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // 渲染公式
  renderFormulas(formulas) {
    const panel = document.getElementById('formulas-panel');
    if (!panel || !formulas) return;

    panel.innerHTML = `
      <div class="formulas-content">
        ${formulas.map(formula => `
          <div class="formula-card">
            <h4>${formula.name}</h4>
            <div class="formula-expression">${formula.formula}</div>
            <p class="formula-description">${formula.description}</p>
            <div class="formula-properties">
              <h5>性质：</h5>
              <ul>
                ${formula.properties.map(prop => `<li>${prop}</li>`).join('')}
              </ul>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // 切换页面区域
  switchSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
      section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.add('active');
      this.currentSection = sectionId;
    }
  }

  // 处理标签页点击
  handleTabClick(event) {
    const tabBtn = event.target;
    const tabId = tabBtn.dataset.tab;

    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    tabBtn.classList.add('active');

    document.querySelectorAll('.content-panel').forEach(panel => {
      panel.classList.remove('active');
    });
    
    const targetPanel = document.getElementById(`${tabId}-panel`);
    if (targetPanel) {
      targetPanel.classList.add('active');
    }
  }

  // 显示错误
  showError(title, message) {
    console.error(`${title}: ${message}`);
    if (this.errorHandler) {
      this.errorHandler.showError(title, message);
    } else {
      alert(`${title}\n${message}`);
    }
  }

  // 获取表单数据
  getFormData() {
    return { ...this.formData };
  }

  // 设置表单数据
  setFormData(formData) {
    const form = document.getElementById('course-form');
    if (!form) return;

    Object.keys(formData).forEach(key => {
      const input = form.querySelector(`[name="${key}"]`);
      if (input) {
        if (input.type === 'checkbox') {
          input.checked = formData[key];
        } else {
          input.value = formData[key];
        }
      }
    });

    this.formData = { ...formData };
    this.validateForm();
    this.updateGenerateButton();
  }

  // 设置生成选项
  setGenerationOptions(options) {
    // 简化版本暂不实现
  }

  // 更新进度
  updateProgress(progressData) {
    const progressBar = document.querySelector('.progress-fill');
    const progressPercentage = document.querySelector('.progress-percentage');
    const progressStatus = document.querySelector('.progress-status');
    
    if (progressBar) progressBar.style.width = `${progressData.percentage}%`;
    if (progressPercentage) progressPercentage.textContent = `${progressData.percentage}%`;
    if (progressStatus) progressStatus.textContent = progressData.status;
  }

  // 切换选项面板
  toggleOptions(expanded) {
    // 简化版本暂不实现
  }

  // 切换导出面板
  toggleExportPanel(visible) {
    // 简化版本暂不实现
  }

  // 切换标签页
  switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    const activeTab = document.querySelector(`[data-tab="${tabId}"]`);
    if (activeTab) {
      activeTab.classList.add('active');
    }

    document.querySelectorAll('.content-panel').forEach(panel => {
      panel.classList.remove('active');
    });
    
    const targetPanel = document.getElementById(`${tabId}-panel`);
    if (targetPanel) {
      targetPanel.classList.add('active');
    }
  }
}

// 导出UIManager类到全局作用域
window.UIManager = UIManager;

console.log('UIManager 类已加载');