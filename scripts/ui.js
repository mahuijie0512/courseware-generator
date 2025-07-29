// 进度管理类
class ProgressManager {
  constructor() {
    this.currentStep = 0;
    this.totalSteps = 0;
    this.isRunning = false;
    this.steps = [];
    this.progressBar = null;
    this.progressPercentage = null;
    this.progressStatus = null;
    this.progressSteps = null;
    
    this.init();
  }

  init() {
    this.progressBar = document.querySelector('.progress-fill');
    this.progressPercentage = document.querySelector('.progress-percentage');
    this.progressStatus = document.querySelector('.progress-status');
    this.progressSteps = document.querySelectorAll('.step');
  }

  // 开始进度
  start(steps = []) {
    this.steps = steps.length > 0 ? steps : DEMO_DATA.generationSteps;
    this.totalSteps = this.steps.length;
    this.currentStep = 0;
    this.isRunning = true;
    
    this.updateProgress(0, '开始生成...');
    this.updateStepStatus(0, 'active');
  }

  // 更新进度
  updateProgress(percentage, status = '') {
    if (this.progressBar) {
      this.progressBar.style.width = `${percentage}%`;
    }
    
    if (this.progressPercentage) {
      this.progressPercentage.textContent = `${Math.round(percentage)}%`;
    }
    
    if (status && this.progressStatus) {
      this.progressStatus.textContent = status;
    }
  }

  // 更新步骤状态
  updateStepStatus(stepIndex, status) {
    if (this.progressSteps && this.progressSteps[stepIndex]) {
      const stepElement = this.progressSteps[stepIndex];
      
      // 清除之前的状态
      stepElement.classList.remove('active', 'completed', 'error');
      
      // 添加新状态
      if (status) {
        stepElement.classList.add(status);
      }
    }
  }

  // 下一步
  nextStep(status = '') {
    if (!this.isRunning || this.currentStep >= this.totalSteps) {
      return;
    }

    // 标记当前步骤为完成
    this.updateStepStatus(this.currentStep, 'completed');
    
    this.currentStep++;
    
    if (this.currentStep < this.totalSteps) {
      // 激活下一步
      this.updateStepStatus(this.currentStep, 'active');
      
      const percentage = (this.currentStep / this.totalSteps) * 100;
      const stepName = this.steps[this.currentStep]?.name || '处理中...';
      
      this.updateProgress(percentage, status || stepName);
    } else {
      // 完成所有步骤
      this.complete();
    }
  }

  // 完成进度
  complete(message = '生成完成！') {
    this.isRunning = false;
    this.currentStep = this.totalSteps;
    
    this.updateProgress(100, message);
    
    // 标记所有步骤为完成
    this.progressSteps.forEach(step => {
      step.classList.remove('active', 'error');
      step.classList.add('completed');
    });
    
    // 延迟切换到内容展示页面并渲染内容
    setTimeout(() => {
      // 通过状态管理器完成生成过程
      if (window.stateActions && window.DEMO_DATA) {
        window.stateActions.completeGeneration(window.DEMO_DATA.sampleCourseware);
      } else if (window.uiManager) {
        // 渲染演示课件内容
        window.uiManager.renderCoursewareContent(DEMO_DATA.sampleCourseware);
        window.uiManager.switchSection('content-display-section');
      }
    }, 1500);
  }

  // 错误处理
  error(message = '生成失败', stepIndex = null) {
    this.isRunning = false;
    
    this.updateProgress(this.getProgressPercentage(), message);
    
    // 标记错误步骤
    const errorStepIndex = stepIndex !== null ? stepIndex : this.currentStep;
    this.updateStepStatus(errorStepIndex, 'error');
    
    // 使用错误处理器显示错误
    if (window.errorHandler) {
      window.errorHandler.showError(
        '课件生成失败',
        message,
        {
          type: 'generation',
          canRetry: true,
          onRetry: () => {
            if (window.app && window.app.uiManager) {
              window.app.uiManager.startGeneration();
            }
          }
        }
      );
    }
  }

  // 重置进度
  reset() {
    this.currentStep = 0;
    this.isRunning = false;
    
    this.updateProgress(0, '准备开始...');
    
    // 重置所有步骤状态
    this.progressSteps.forEach(step => {
      step.classList.remove('active', 'completed', 'error');
    });
  }

  // 获取当前进度百分比
  getProgressPercentage() {
    return this.totalSteps > 0 ? (this.currentStep / this.totalSteps) * 100 : 0;
  }

  // 获取当前状态
  getStatus() {
    return {
      currentStep: this.currentStep,
      totalSteps: this.totalSteps,
      percentage: this.getProgressPercentage(),
      isRunning: this.isRunning,
      currentStepName: this.steps[this.currentStep]?.name || ''
    };
  }

  // 模拟进度更新
  simulateProgress(steps = null) {
    const progressSteps = steps || DEMO_DATA.generationSteps;
    this.start(progressSteps);
    
    let stepIndex = 0;
    
    const processNextStep = () => {
      if (stepIndex < progressSteps.length && this.isRunning) {
        const step = progressSteps[stepIndex];
        
        setTimeout(() => {
          this.nextStep(step.name);
          stepIndex++;
          
          if (stepIndex < progressSteps.length) {
            processNextStep();
          }
        }, step.duration || 1000);
      }
    };
    
    // 开始第一步
    setTimeout(() => {
      processNextStep();
    }, 500);
  }
}

// UI交互管理类
class UIManager {
  constructor() {
    this.currentSection = 'course-input-section';
    this.formData = {};
    this.validationErrors = {};
    this.isFormValid = false;
    this.progressManager = new ProgressManager();
    this.stateActions = null;
    this.stateSelectors = null;
    this.animationManager = null;
    this.errorHandler = null;
    
    this.init();
  }

  init() {
    this.bindEvents();
    this.initializeForm();
    this.updateNavIndicator();
  }

  // 设置状态管理器引用
  setStateManager(stateActions, stateSelectors) {
    this.stateActions = stateActions;
    this.stateSelectors = stateSelectors;
  }

  // 设置动画管理器引用
  setAnimationManager(animationManager) {
    this.animationManager = animationManager;
    this.setupEnhancedAnimations();
  }

  // 设置错误处理器引用
  setErrorHandler(errorHandler) {
    this.errorHandler = errorHandler;
  }

  // 设置增强动画
  setupEnhancedAnimations() {
    if (!this.animationManager) return;

    // 设置悬停动画
    this.animationManager.setupHoverAnimations();
    
    // 观察滚动动画
    this.animationManager.observeScrollAnimations();
    
    // 设置页面元素动画标记
    this.markAnimationElements();
  }

  // 标记需要动画的元素
  markAnimationElements() {
    // 标记需要进入动画的元素
    const animateElements = document.querySelectorAll('.section-header, .course-form, .progress-container, .content-display');
    animateElements.forEach(element => {
      element.classList.add('animate-in');
    });

    // 标记滚动动画元素
    const scrollElements = document.querySelectorAll('.concept-card, .formula-card, .export-format-btn');
    scrollElements.forEach(element => {
      element.setAttribute('data-animate-scroll', 'true');
    });
  }

  // 从状态管理器设置表单数据
  setFormData(formData) {
    const form = document.getElementById('course-form');
    if (!form) return;

    // 更新表单字段
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

    // 更新内部状态
    this.formData = { ...formData };
    this.validateForm();
    this.updateGenerateButton();
  }

  // 从状态管理器设置生成选项
  setGenerationOptions(options) {
    const form = document.getElementById('course-form');
    if (!form) return;

    // 更新选项字段
    Object.keys(options).forEach(key => {
      const input = form.querySelector(`[name="${key}"]`);
      if (input) {
        if (input.type === 'checkbox') {
          input.checked = options[key];
        } else {
          input.value = options[key];
        }
      }
    });
  }

  // 获取表单数据
  getFormData() {
    return { ...this.formData };
  }

  // 更新进度（从状态管理器调用）
  updateProgress(progressData) {
    if (this.progressManager) {
      this.progressManager.updateProgress(progressData.percentage, progressData.status);
    }
  }

  // 显示内容（从状态管理器调用）
  displayContent(content) {
    this.renderCoursewareContent(content);
  }

  // 切换选项面板（从状态管理器调用）
  toggleOptions(expanded) {
    const toggleBtn = document.getElementById('options-toggle-btn');
    const optionsPanel = document.getElementById('generation-options');
    const arrowIcon = toggleBtn?.querySelector('.arrow-icon');

    if (!toggleBtn || !optionsPanel) return;

    if (expanded) {
      optionsPanel.classList.add('expanded');
      toggleBtn.classList.add('expanded');
      if (arrowIcon) arrowIcon.style.transform = 'rotate(180deg)';
      optionsPanel.style.maxHeight = optionsPanel.scrollHeight + 'px';
    } else {
      optionsPanel.classList.remove('expanded');
      toggleBtn.classList.remove('expanded');
      if (arrowIcon) arrowIcon.style.transform = 'rotate(0deg)';
      optionsPanel.style.maxHeight = '0';
    }
  }

  // 切换导出面板（从状态管理器调用）
  toggleExportPanel(visible) {
    const exportPanel = document.getElementById('export-panel');
    if (!exportPanel) return;

    if (visible) {
      exportPanel.classList.add('visible');
    } else {
      exportPanel.classList.remove('visible');
    }
  }

  // 切换标签页（从状态管理器调用）
  switchTab(tabId) {
    // 更新标签页状态
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    const activeTab = document.querySelector(`[data-tab="${tabId}"]`);
    if (activeTab) {
      activeTab.classList.add('active');
    }

    // 切换内容面板
    document.querySelectorAll('.content-panel').forEach(panel => {
      panel.classList.remove('active');
    });
    
    const targetPanel = document.getElementById(`${tabId}-panel`);
    if (targetPanel) {
      targetPanel.classList.add('active');
    }
  }

  // 绑定事件监听器
  bindEvents() {
    // 表单相关事件
    const form = document.getElementById('course-form');
    if (form) {
      form.addEventListener('submit', this.handleFormSubmit.bind(this));
      
      // 输入字段实时验证
      const inputs = form.querySelectorAll('input, select');
      inputs.forEach(input => {
        input.addEventListener('input', this.handleInputChange.bind(this));
        input.addEventListener('blur', this.handleInputBlur.bind(this));
        input.addEventListener('focus', this.handleInputFocus.bind(this));
        
        // 移动端触摸优化
        if (this.isTouchDevice()) {
          input.addEventListener('touchstart', this.handleTouchStart.bind(this));
          input.addEventListener('touchend', this.handleTouchEnd.bind(this));
        }
      });
    }

    // 移动端手势支持
    this.setupMobileGestures();

    // 高级选项切换
    const optionsToggle = document.getElementById('options-toggle-btn');
    if (optionsToggle) {
      optionsToggle.addEventListener('click', this.toggleAdvancedOptions.bind(this));
    }

    // 生成按钮
    const generateBtn = document.getElementById('generate-btn');
    if (generateBtn) {
      generateBtn.addEventListener('click', this.handleGenerateClick.bind(this));
    }

    // 标签页切换
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', this.handleTabClick.bind(this));
    });

    // 导出按钮
    const exportBtns = document.querySelectorAll('.export-btn');
    exportBtns.forEach(btn => {
      btn.addEventListener('click', this.handleExportClick.bind(this));
    });

    // 分享按钮
    const shareBtn = document.querySelector('.share-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', this.handleShareClick.bind(this));
    }

    // 错误提示关闭
    const dismissBtn = document.querySelector('.dismiss-btn');
    if (dismissBtn) {
      dismissBtn.addEventListener('click', this.hideError.bind(this));
    }

    const retryBtn = document.querySelector('.retry-btn');
    if (retryBtn) {
      retryBtn.addEventListener('click', this.handleRetry.bind(this));
    }
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
    
    // 更新表单数据
    if (type === 'checkbox') {
      this.formData[name] = checked;
    } else {
      this.formData[name] = value;
    }

    // 通过状态管理器更新状态
    if (this.stateActions) {
      if (['subject', 'grade', 'volume', 'title'].includes(name)) {
        this.stateActions.setCourseField(name, type === 'checkbox' ? checked : value);
      } else if (['includeInteractions', 'searchOnlineResources', 'generateDiagrams', 'difficultyLevel', 'language'].includes(name)) {
        this.stateActions.updateGenerationOptions({ [name]: type === 'checkbox' ? checked : value });
      }
    }

    // 实时验证
    this.validateField(name, value);
    this.updateFieldError(name);
    this.validateForm();
    this.updateGenerateButton();

    // 添加输入动画反馈
    if (this.animationManager) {
      this.animationManager.addMicroInteraction(event.target, 'pulse');
    }
  }

  // 处理输入失焦
  handleInputBlur(event) {
    const { name, value } = event.target;
    const wasValid = !this.validationErrors[name];
    
    this.validateField(name, value);
    this.updateFieldError(name);
    this.addFieldClass(event.target, 'touched');

    // 添加验证动画反馈
    if (this.animationManager) {
      const isValid = !this.validationErrors[name];
      this.animationManager.animateValidationFeedback(event.target, isValid);
    }
  }

  // 处理输入聚焦
  handleInputFocus(event) {
    this.clearFieldError(event.target.name);
    this.removeFieldClass(event.target, 'error');
  }

  // 收集表单数据
  collectFormData() {
    const form = document.getElementById('course-form');
    if (!form) return;

    const formData = new FormData(form);
    this.formData = {};

    // 收集基本字段
    for (let [key, value] of formData.entries()) {
      this.formData[key] = value;
    }

    // 收集复选框状态
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
          this.validationErrors[name] = '请选择课程标题';
        }
        break;

      case 'difficulty':
        if (value && !['basic', 'intermediate', 'advanced'].includes(value)) {
          this.validationErrors[name] = '请选择有效的难度级别';
        }
        break;

      case 'language':
        if (value && !['zh-CN', 'en-US'].includes(value)) {
          this.validationErrors[name] = '请选择有效的语言';
        }
        break;
    }
  }

  // 验证整个表单
  validateForm() {
    // 重新收集数据
    this.collectFormData();

    // 验证必填字段
    const requiredFields = ['subject', 'grade', 'volume', 'title'];
    requiredFields.forEach(field => {
      this.validateField(field, this.formData[field]);
    });

    // 验证可选字段
    if (this.formData.difficulty) {
      this.validateField('difficulty', this.formData.difficulty);
    }
    if (this.formData.language) {
      this.validateField('language', this.formData.language);
    }

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
        this.addFieldClass(inputElement, 'error');
      }
    } else {
      if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
      }
      if (inputElement) {
        this.removeFieldClass(inputElement, 'error');
      }
    }
  }

  // 清除字段错误
  clearFieldError(fieldName) {
    const errorElement = document.getElementById(`${fieldName}-error`);
    if (errorElement) {
      errorElement.textContent = '';
      errorElement.style.display = 'none';
    }
  }

  // 添加字段样式类
  addFieldClass(element, className) {
    if (element) {
      element.classList.add(className);
    }
  }

  // 移除字段样式类
  removeFieldClass(element, className) {
    if (element) {
      element.classList.remove(className);
    }
  }

  // 更新生成按钮状态
  updateGenerateButton() {
    const generateBtn = document.getElementById('generate-btn');
    if (!generateBtn) return;

    if (this.isFormValid) {
      generateBtn.disabled = false;
      generateBtn.classList.remove('disabled');
      generateBtn.querySelector('.btn-text').textContent = '生成课件';
    } else {
      generateBtn.disabled = true;
      generateBtn.classList.add('disabled');
      generateBtn.querySelector('.btn-text').textContent = '请完善表单信息';
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

  // 处理生成按钮点击
  handleGenerateClick(event) {
    event.preventDefault();
    
    // 添加按钮点击动画
    if (this.animationManager) {
      this.animationManager.animateButtonClick(event.target);
    }
    
    if (this.validateForm()) {
      this.startGeneration();
    } else {
      this.showValidationErrors();
    }
  }

  // 显示验证错误
  showValidationErrors() {
    // 更新所有字段的错误显示
    Object.keys(this.validationErrors).forEach(fieldName => {
      this.updateFieldError(fieldName);
    });

    // 滚动到第一个错误字段
    const firstErrorField = document.querySelector('.error');
    if (firstErrorField) {
      firstErrorField.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      firstErrorField.focus();
    }

    // 使用错误处理器显示错误
    if (this.errorHandler) {
      this.errorHandler.showError(
        '表单验证失败',
        '请检查并修正表单中的错误信息',
        {
          type: 'validation',
          canRetry: false,
          autoHide: true,
          hideDelay: 4000
        }
      );
    } else {
      // 回退到基本错误显示
      this.showError('请检查并修正表单中的错误信息');
    }
  }

  // 切换高级选项
  toggleAdvancedOptions() {
    const toggleBtn = document.getElementById('options-toggle-btn');
    const optionsPanel = document.getElementById('generation-options');
    const arrowIcon = toggleBtn.querySelector('.arrow-icon');

    const isExpanded = optionsPanel.classList.contains('expanded');
    
    if (isExpanded) {
      // 收起
      optionsPanel.classList.remove('expanded');
      toggleBtn.classList.remove('expanded');
      arrowIcon.style.transform = 'rotate(0deg)';
      optionsPanel.style.maxHeight = '0';
    } else {
      // 展开
      optionsPanel.classList.add('expanded');
      toggleBtn.classList.add('expanded');
      arrowIcon.style.transform = 'rotate(180deg)';
      optionsPanel.style.maxHeight = optionsPanel.scrollHeight + 'px';
    }

    // 通过状态管理器更新状态
    if (this.stateActions) {
      this.stateActions.toggleOptions(!isExpanded);
    }
  }

  // 开始生成过程
  startGeneration() {
    // 通过状态管理器切换section
    if (this.stateActions) {
      this.stateActions.switchSection('generation-section');
    } else {
      this.switchSection('generation-section');
    }
    
    // 开始进度模拟
    this.progressManager.simulateProgress();
    
    // 触发课件生成
    if (window.coursewareManager) {
      window.coursewareManager.generateCourseware(this.formData);
    }
  }

  // 切换页面区域
  switchSection(sectionId) {
    // 如果有导航管理器，使用导航管理器处理
    if (window.navigationManager) {
      return window.navigationManager.navigateToSection(sectionId);
    }
    
    // 回退到基本实现
    return this.basicSwitchSection(sectionId);
  }

  // 增强的页面切换动画
  switchSectionWithAnimation(sectionId, direction = 'forward') {
    const currentSection = document.getElementById(this.currentSection);
    const newSection = document.getElementById(sectionId);
    
    if (!newSection || !this.canNavigateToSection(sectionId)) {
      return false;
    }

    // 确定动画方向
    const isForward = direction === 'forward';
    
    // 添加离开动画类
    if (currentSection) {
      currentSection.classList.add('section-leaving');
      currentSection.classList.add(isForward ? 'slide-out-left' : 'slide-out-right');
    }

    // 准备新section
    newSection.classList.remove('active');
    newSection.classList.add('section-entering');
    newSection.classList.add(isForward ? 'slide-in-right' : 'slide-in-left');
    newSection.style.display = 'block';

    // 执行动画
    requestAnimationFrame(() => {
      if (currentSection) {
        currentSection.classList.add('section-leave-active');
      }
      newSection.classList.add('section-enter-active');
      
      // 动画完成后清理
      setTimeout(() => {
        if (currentSection) {
          currentSection.classList.remove('active', 'section-leaving', 'slide-out-left', 'slide-out-right', 'section-leave-active');
          currentSection.style.display = 'none';
        }
        
        newSection.classList.remove('section-entering', 'slide-in-right', 'slide-in-left', 'section-enter-active');
        newSection.classList.add('active');
        
        this.currentSection = sectionId;
        this.updateNavIndicator();
        this.updatePageTitle(sectionId);
        
        // 触发section变更事件
        this.dispatchSectionChangeEvent(sectionId);
        
        // 添加页面元素进入动画
        this.animatePageElements(newSection);
        
      }, 600); // 匹配CSS动画时长
    });

    return true;
  }

  // 页面元素进入动画
  animatePageElements(section) {
    const elements = section.querySelectorAll('.section-header, .course-form, .progress-container, .content-display');
    
    elements.forEach((element, index) => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      
      setTimeout(() => {
        element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }

  // 基本的section切换实现（回退方案）
  basicSwitchSection(sectionId) {
    // 验证section切换的有效性
    if (!this.canNavigateToSection(sectionId)) {
      console.warn(`无法导航到 ${sectionId}，条件不满足`);
      return false;
    }

    // 隐藏当前区域
    const currentSection = document.getElementById(this.currentSection);
    if (currentSection) {
      currentSection.classList.remove('active');
      currentSection.classList.add('leaving');
    }

    // 显示新区域
    const newSection = document.getElementById(sectionId);
    if (newSection) {
      newSection.classList.add('entering');
      
      // 使用requestAnimationFrame确保动画效果
      requestAnimationFrame(() => {
        if (currentSection) {
          currentSection.classList.remove('leaving');
        }
        newSection.classList.remove('entering');
        newSection.classList.add('active');
        this.currentSection = sectionId;
      });
    }

    // 更新导航指示器
    this.updateNavIndicator();

    // 更新页面标题
    this.updatePageTitle(sectionId);

    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // 触发section变更事件
    this.dispatchSectionChangeEvent(sectionId);

    return true;
  }

  // 检查是否可以导航到指定section
  canNavigateToSection(sectionId) {
    switch (sectionId) {
      case 'course-input-section':
        return true; // 总是可以返回到输入页面
      case 'generation-section':
        return this.isFormValid; // 需要表单有效
      case 'content-display-section':
        // 需要有生成的内容或者正在生成
        return this.stateSelectors ? 
          this.stateSelectors.hasContent() || this.stateSelectors.isGenerating() :
          false;
      default:
        return false;
    }
  }

  // 更新页面标题
  updatePageTitle(sectionId) {
    const titles = {
      'course-input-section': '课程信息输入',
      'generation-section': '课件生成中',
      'content-display-section': '课件内容展示'
    };
    
    const title = titles[sectionId] || '课件生成器';
    document.title = `${title} - 智能课件生成器`;
  }

  // 分发section变更事件
  dispatchSectionChangeEvent(sectionId) {
    const event = new CustomEvent('sectionChange', {
      detail: {
        newSection: sectionId,
        previousSection: this.currentSection,
        timestamp: Date.now()
      }
    });
    
    window.dispatchEvent(event);
  }

  // 更新导航指示器
  updateNavIndicator() {
    const indicator = document.querySelector('.nav-indicator::after');
    const sections = ['course-input-section', 'generation-section', 'content-display-section'];
    const currentIndex = sections.indexOf(this.currentSection);
    
    if (currentIndex !== -1) {
      const percentage = (currentIndex / (sections.length - 1)) * 100;
      document.documentElement.style.setProperty('--nav-progress', `${percentage}%`);
    }
  }

  // 处理标签页点击
  handleTabClick(event) {
    const tabBtn = event.target;
    const tabId = tabBtn.dataset.tab;

    // 更新标签页状态
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    tabBtn.classList.add('active');

    // 切换内容面板
    document.querySelectorAll('.content-panel').forEach(panel => {
      panel.classList.remove('active');
    });
    
    const targetPanel = document.getElementById(`${tabId}-panel`);
    if (targetPanel) {
      targetPanel.classList.add('active');
    }
  }

  // 处理导出点击
  handleExportClick(event) {
    const exportBtn = event.target.closest('.export-btn');
    const format = exportBtn.dataset.format;
    
    this.showLoading('正在导出...');
    
    // 模拟导出过程
    setTimeout(() => {
      this.hideLoading();
      
      if (this.errorHandler) {
        this.errorHandler.showSuccess('导出成功', `${format.toUpperCase()} 文件导出成功！`);
      } else {
        this.showSuccess(`${format.toUpperCase()} 文件导出成功！`);
      }
    }, 2000);
  }

  // 处理分享点击
  handleShareClick(event) {
    const shareUrl = `${window.location.origin}/share/${Utils.generateId()}`;
    
    if (window.Utils && window.Utils.copyToClipboard) {
      window.Utils.copyToClipboard(shareUrl).then(success => {
        if (success) {
          if (this.errorHandler) {
            this.errorHandler.showSuccess('复制成功', '分享链接已复制到剪贴板');
          } else {
            this.showSuccess('分享链接已复制到剪贴板');
          }
        } else {
          if (this.errorHandler) {
            this.errorHandler.showError('复制失败', '无法复制到剪贴板，请手动复制');
          } else {
            this.showError('复制失败，请手动复制链接');
          }
        }
      });
    } else {
      // 回退方案：使用浏览器原生API
      try {
        navigator.clipboard.writeText(shareUrl).then(() => {
          if (this.errorHandler) {
            this.errorHandler.showSuccess('复制成功', '分享链接已复制到剪贴板');
          } else {
            this.showSuccess('分享链接已复制到剪贴板');
          }
        }).catch(() => {
          if (this.errorHandler) {
            this.errorHandler.showError('复制失败', '无法复制到剪贴板，请手动复制');
          } else {
            this.showError('复制失败，请手动复制链接');
          }
        });
      } catch (error) {
        if (this.errorHandler) {
          this.errorHandler.showError('复制失败', '您的浏览器不支持自动复制功能');
        } else {
          this.showError('复制失败，请手动复制链接');
        }
      }
    }
  }

  // 显示错误提示
  showError(message, title = '操作失败') {
    const errorDisplay = document.getElementById('error-display');
    const errorTitle = errorDisplay.querySelector('.error-title');
    const errorDescription = errorDisplay.querySelector('.error-description');

    if (errorTitle) errorTitle.textContent = title;
    if (errorDescription) errorDescription.textContent = message;

    errorDisplay.classList.add('show');
    
    // 自动隐藏
    setTimeout(() => {
      this.hideError();
    }, 5000);
  }

  // 隐藏错误提示
  hideError() {
    const errorDisplay = document.getElementById('error-display');
    errorDisplay.classList.remove('show');
  }

  // 显示成功提示
  showSuccess(message) {
    // 可以复用错误提示组件，只是改变样式
    const errorDisplay = document.getElementById('error-display');
    const errorTitle = errorDisplay.querySelector('.error-title');
    const errorDescription = errorDisplay.querySelector('.error-description');
    const errorIcon = errorDisplay.querySelector('.error-icon');

    if (errorTitle) errorTitle.textContent = '操作成功';
    if (errorDescription) errorDescription.textContent = message;
    if (errorIcon) errorIcon.textContent = '✅';

    errorDisplay.classList.add('show', 'success');
    
    setTimeout(() => {
      this.hideSuccess();
    }, 3000);
  }

  // 隐藏成功提示
  hideSuccess() {
    const errorDisplay = document.getElementById('error-display');
    errorDisplay.classList.remove('show', 'success');
  }

  // 显示加载状态
  showLoading(message = '加载中...') {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
      const loadingText = loadingOverlay.querySelector('.loading-text');
      if (loadingText) {
        loadingText.textContent = message;
      }
      loadingOverlay.classList.add('show');
    }
  }

  // 隐藏加载状态
  hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.classList.remove('show');
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
    
    // 渲染图表
    this.renderDiagrams(content.diagrams);
    
    // 渲染交互组件
    this.renderInteractions(content.interactions);
    
    // 渲染资源
    this.renderResources(content.resources);
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

  // 渲染图表
  renderDiagrams(diagrams) {
    const panel = document.getElementById('diagrams-panel');
    if (!panel || !diagrams) return;

    panel.innerHTML = `
      <div class="diagrams-content">
        ${diagrams.map(diagram => `
          <div class="diagram-card">
            <h4>${diagram.title}</h4>
            <p class="diagram-description">${diagram.description}</p>
            <div class="diagram-placeholder">
              [${diagram.title} 示意图]
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // 渲染交互组件
  renderInteractions(interactions) {
    const panel = document.getElementById('interactions-panel');
    if (!panel || !interactions) return;

    panel.innerHTML = `
      <div class="interactions-content">
        ${interactions.map(interaction => `
          <div class="interaction-card">
            <h4>${interaction.title}</h4>
            <p class="interaction-description">${interaction.description}</p>
            <div class="interaction-placeholder">
              [${interaction.type} 交互组件]
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // 渲染资源
  renderResources(resources) {
    const panel = document.getElementById('resources-panel');
    if (!panel || !resources) return;

    panel.innerHTML = `
      <div class="resources-content">
        ${resources.map(resource => `
          <div class="resource-card">
            <div class="resource-thumbnail">
              <img src="${resource.thumbnail}" alt="${resource.title}" onerror="this.style.display='none'">
            </div>
            <div class="resource-info">
              <h4>${resource.title}</h4>
              <p class="resource-description">${resource.description}</p>
              <div class="resource-meta">
                <span class="resource-type">${resource.type}</span>
                <span class="resource-source">${resource.source}</span>
                ${resource.duration ? `<span class="resource-duration">${resource.duration}</span>` : ''}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // 检查是否为触摸设备
  isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  // 设置移动端手势
  setupMobileGestures() {
    if (!this.isTouchDevice()) return;

    // 添加移动端特定的交互逻辑
    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    });

    document.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;
      
      // 检测水平滑动手势
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          // 向右滑动 - 上一页
          this.handleSwipeRight();
        } else {
          // 向左滑动 - 下一页
          this.handleSwipeLeft();
        }
      }
    });
  }

  // 处理向右滑动
  handleSwipeRight() {
    // 实现向右滑动的逻辑
    console.log('向右滑动');
  }

  // 处理向左滑动
  handleSwipeLeft() {
    // 实现向左滑动的逻辑
    console.log('向左滑动');
  }

  // 处理触摸开始
  handleTouchStart(event) {
    event.target.classList.add('touch-active');
  }

  // 处理触摸结束
  handleTouchEnd(event) {
    event.target.classList.remove('touch-active');
  }

  // 处理重试
  handleRetry() {
    if (this.validateForm()) {
      this.startGeneration();
    }
  }

  // 重置表单
  resetForm() {
    const form = document.getElementById('course-form');
    if (form) {
      form.reset();
      this.formData = {};
      this.validationErrors = {};
      this.isFormValid = false;
      this.updateGenerateButton();
    }
  }

  // 初始化导出按钮
  initializeExportButton() {
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        this.showExportPanel();
      });
    }
  }

  // 显示导出面板
  showExportPanel() {
    const exportPanel = document.getElementById('export-options');
    if (exportPanel) {
      exportPanel.style.display = 'block';
    }
  }
}

// 导出UIManager类到全局作用域
window.UIManager = UIManager;

// 确保在DOM加载完成后初始化导出功能
document.addEventListener('DOMContentLoaded', () => {
  // 如果UIManager已经存在，添加导出功能
  if (window.uiManager) {
    window.uiManager.initializeExportButton();
  }
});ror-display');
    const errorIcon = errorDisplay.querySelector('.error-icon');
    
    errorDisplay.classList.remove('show', 'success');
    if (errorIcon) errorIcon.textContent = '⚠️';
  }

  // 显示加载遮罩
  showLoading(message = '加载中...') {
    const loadingOverlay = document.getElementById('loading-overlay');
    const loadingText = loadingOverlay.querySelector('.loading-text');
    
    if (loadingText) loadingText.textContent = message;
    loadingOverlay.classList.add('show');
  }

  // 隐藏加载遮罩
  hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.classList.remove('show');
  }

  // 处理重试
  handleRetry() {
    this.hideError();
    
    // 根据当前状态决定重试操作
    if (this.currentSection === 'generation-section') {
      this.startGeneration();
    }
  }

  // 检测是否为触摸设备
  isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  // 设置移动端手势支持
  setupMobileGestures() {
    if (!this.isTouchDevice()) return;

    let startX = 0;
    let startY = 0;
    let isScrolling = false;

    document.addEventListener('touchstart', (event) => {
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
      isScrolling = false;
    });

    document.addEventListener('touchmove', (event) => {
      if (!startX || !startY) return;

      const currentX = event.touches[0].clientX;
      const currentY = event.touches[0].clientY;
      const diffX = Math.abs(currentX - startX);
      const diffY = Math.abs(currentY - startY);

      if (diffY > diffX) {
        isScrolling = true;
      }
    });

    document.addEventListener('touchend', (event) => {
      if (isScrolling || !startX || !startY) return;

      const endX = event.changedTouches[0].clientX;
      const diffX = startX - endX;

      // 左滑切换到下一个section
      if (diffX > 50) {
        this.handleSwipeLeft();
      }
      // 右滑切换到上一个section
      else if (diffX < -50) {
        this.handleSwipeRight();
      }

      startX = 0;
      startY = 0;
    });
  }

  // 处理左滑手势
  handleSwipeLeft() {
    const sections = ['course-input-section', 'generation-section', 'content-display-section'];
    const currentIndex = sections.indexOf(this.currentSection);
    
    if (currentIndex < sections.length - 1) {
      const nextSection = sections[currentIndex + 1];
      if (this.canNavigateToSection(nextSection)) {
        this.switchSection(nextSection);
      }
    }
  }

  // 处理右滑手势
  handleSwipeRight() {
    const sections = ['course-input-section', 'generation-section', 'content-display-section'];
    const currentIndex = sections.indexOf(this.currentSection);
    
    if (currentIndex > 0) {
      const prevSection = sections[currentIndex - 1];
      this.switchSection(prevSection);
    }
  }

  // 处理触摸开始
  handleTouchStart(event) {
    event.target.classList.add('touch-active');
  }

  // 处理触摸结束
  handleTouchEnd(event) {
    setTimeout(() => {
      event.target.classList.remove('touch-active');
    }, 150);
  }

  // 重置表单
  resetForm() {
    const form = document.getElementById('course-form');
    if (form) {
      form.reset();
      this.formData = {};
      this.validationErrors = {};
      this.isFormValid = false;
      
      // 清除所有错误显示
      const errorElements = form.querySelectorAll('.form-error');
      errorElements.forEach(element => {
        element.textContent = '';
        element.style.display = 'none';
      });

      // 移除错误样式
      const inputElements = form.querySelectorAll('input, select');
      inputElements.forEach(element => {
        element.classList.remove('error', 'touched');
      });

      this.updateGenerateButton();
    }
  }

  // 渲染课件内容
  renderCoursewareContent(coursewareData) {
    if (!coursewareData) {
      console.warn('没有课件数据可渲染');
      return;
    }

    // 渲染各个面板的内容
    this.renderOverviewPanel(coursewareData.overview);
    this.renderConceptsPanel(coursewareData.concepts);
    this.renderFormulasPanel(coursewareData.formulas);
    this.renderDiagramsPanel(coursewareData.diagrams);
    this.renderInteractionsPanel(coursewareData.interactions);
    this.renderResourcesPanel(coursewareData.resources);
    
    // 显示导出面板
    const exportPanel = document.getElementById('export-options');
    if (exportPanel) {
      exportPanel.style.display = 'block';
    }
  }

  // 渲染概述面板
  renderOverviewPanel(overviewData) {
    const panel = document.getElementById('overview-panel');
    if (!panel || !overviewData) return;

    panel.innerHTML = `
      <div class="overview-content">
        <div class="course-title">
          <h3>${overviewData.title || '课程概述'}</h3>
          <p class="course-description">${overviewData.description || ''}</p>
        </div>
        
        <div class="learning-objectives">
          <h4>学习目标</h4>
          <ul class="objectives-list">
            ${(overviewData.objectives || []).map(obj => `<li>${obj}</li>`).join('')}
          </ul>
        </div>
        
        <div class="key-points">
          <h4>重点内容</h4>
          <ul class="keypoints-list">
            ${(overviewData.keyPoints || []).map(point => `<li>${point}</li>`).join('')}
          </ul>
        </div>
        
        <div class="course-metadata">
          <div class="metadata-item">
            <span class="label">难度级别:</span>
            <span class="value">${overviewData.difficulty || '中级'}</span>
          </div>
          <div class="metadata-item">
            <span class="label">预计时长:</span>
            <span class="value">${overviewData.duration || '45分钟'}</span>
          </div>
          <div class="metadata-item">
            <span class="label">适用年级:</span>
            <span class="value">${overviewData.grade || '高中'}</span>
          </div>
        </div>
      </div>
    `;
  }

  // 渲染概念面板
  renderConceptsPanel(conceptsData) {
    const panel = document.getElementById('concepts-panel');
    if (!panel || !conceptsData) return;

    panel.innerHTML = `
      <div class="concepts-content">
        <div class="concepts-grid">
          ${(conceptsData || []).map(concept => `
            <div class="concept-card">
              <h4 class="concept-name">${concept.name}</h4>
              <p class="concept-description">${concept.description}</p>
              <div class="concept-details">
                <p><strong>详细说明:</strong> ${concept.details}</p>
                ${concept.examples ? `
                  <div class="concept-examples">
                    <strong>示例:</strong>
                    <ul>
                      ${concept.examples.map(example => `<li>${example}</li>`).join('')}
                    </ul>
                  </div>
                ` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 渲染公式面板
  renderFormulasPanel(formulasData) {
    const panel = document.getElementById('formulas-panel');
    if (!panel || !formulasData) return;

    panel.innerHTML = `
      <div class="formulas-content">
        <div class="formulas-grid">
          ${(formulasData || []).map(formula => `
            <div class="formula-card">
              <h4 class="formula-name">${formula.name}</h4>
              <div class="formula-expression">
                <code>${formula.formula}</code>
              </div>
              <p class="formula-description">${formula.description}</p>
              ${formula.variables ? `
                <div class="formula-variables">
                  <strong>变量说明:</strong>
                  <ul>
                    ${Object.entries(formula.variables).map(([key, value]) => 
                      `<li><code>${key}</code>: ${value}</li>`
                    ).join('')}
                  </ul>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 渲染示意图面板
  renderDiagramsPanel(diagramsData) {
    const panel = document.getElementById('diagrams-panel');
    if (!panel || !diagramsData) return;

    panel.innerHTML = `
      <div class="diagrams-content">
        <div class="diagrams-grid">
          ${(diagramsData || []).map(diagram => `
            <div class="diagram-card">
              <h4 class="diagram-title">${diagram.title}</h4>
              <div class="diagram-placeholder">
                <div class="diagram-icon">📊</div>
                <p class="diagram-description">${diagram.description}</p>
              </div>
              <div class="diagram-caption">
                <p>${diagram.caption || ''}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 渲染交互面板
  renderInteractionsPanel(interactionsData) {
    const panel = document.getElementById('interactions-panel');
    if (!panel || !interactionsData) return;

    panel.innerHTML = `
      <div class="interactions-content">
        <div class="interactions-grid">
          ${(interactionsData || []).map(interaction => `
            <div class="interaction-card">
              <h4 class="interaction-title">${interaction.title}</h4>
              <p class="interaction-description">${interaction.description}</p>
              <div class="interaction-placeholder">
                <div class="interaction-icon">🎮</div>
                <p>交互组件占位符</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 渲染资源面板
  renderResourcesPanel(resourcesData) {
    const panel = document.getElementById('resources-panel');
    if (!panel || !resourcesData) return;

    panel.innerHTML = `
      <div class="resources-content">
        <div class="resources-sections">
          ${resourcesData.videos ? `
            <div class="resource-section">
              <h4>相关视频</h4>
              <div class="resource-list">
                ${resourcesData.videos.map(video => `
                  <div class="resource-item">
                    <div class="resource-icon">🎥</div>
                    <div class="resource-info">
                      <h5>${video.title}</h5>
                      <p>${video.description}</p>
                      <a href="${video.url}" target="_blank" class="resource-link">观看视频</a>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
          
          ${resourcesData.articles ? `
            <div class="resource-section">
              <h4>参考文章</h4>
              <div class="resource-list">
                ${resourcesData.articles.map(article => `
                  <div class="resource-item">
                    <div class="resource-icon">📄</div>
                    <div class="resource-info">
                      <h5>${article.title}</h5>
                      <p>${article.description}</p>
                      <a href="${article.url}" target="_blank" class="resource-link">阅读文章</a>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
          
          ${resourcesData.exercises ? `
            <div class="resource-section">
              <h4>练习题目</h4>
              <div class="resource-list">
                ${resourcesData.exercises.map(exercise => `
                  <div class="resource-item">
                    <div class="resource-icon">📝</div>
                    <div class="resource-info">
                      <h5>${exercise.title}</h5>
                      <p>${exercise.description}</p>
                      <span class="resource-meta">难度: ${exercise.difficulty}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }
}ror-display');
    const errorIcon = errorDisplay.querySelector('.error-icon');
    
    errorDisplay.classList.remove('show', 'success');
    if (errorIcon) errorIcon.textContent = '⚠️';
  }

  // 显示加载遮罩
  showLoading(message = '加载中...') {
    const loadingOverlay = document.getElementById('loading-overlay');
    const loadingText = loadingOverlay.querySelector('.loading-text');
    
    if (loadingText) loadingText.textContent = message;
    loadingOverlay.classList.add('show');
  }

  // 隐藏加载遮罩
  hideLoading() {
    const loadingOverlay = document.getElementById('loading-overlay');
    loadingOverlay.classList.remove('show');
  }

  // 处理重试
  handleRetry() {
    this.hideError();
    
    // 根据当前状态决定重试操作
    if (this.currentSection === 'generation-section') {
      this.startGeneration();
    }
  }

  // 重置表单
  resetForm() {
    const form = document.getElementById('course-form');
    if (form) {
      form.reset();
      this.formData = {};
      this.validationErrors = {};
      this.isFormValid = false;
      
      // 清除所有错误显示
      const errorElements = form.querySelectorAll('.form-error');
      errorElements.forEach(element => {
        element.textContent = '';
        element.style.display = 'none';
      });

      // 移除错误样式
      const inputElements = form.querySelectorAll('input, select');
      inputElements.forEach(element => {
        element.classList.remove('error', 'touched');
      });

      this.updateGenerateButton();
    }
  }

  // 渲染课件内容
  renderCoursewareContent(coursewareData) {
    if (!coursewareData) {
      console.warn('没有课件数据可渲染');
      return;
    }

    // 渲染各个面板的内容
    this.renderOverviewPanel(coursewareData.overview);
    this.renderConceptsPanel(coursewareData.concepts);
    this.renderFormulasPanel(coursewareData.formulas);
    this.renderDiagramsPanel(coursewareData.diagrams);
    this.renderInteractionsPanel(coursewareData.interactions);
    this.renderResourcesPanel(coursewareData.resources);
    
    // 显示导出面板
    this.showExportPanel();
  }

  // 渲染概述面板
  renderOverviewPanel(overviewData) {
    const panel = document.getElementById('overview-panel');
    if (!panel || !overviewData) return;

    panel.innerHTML = `
      <div class="overview-content">
        <div class="overview-header">
          <h3 class="overview-title">${overviewData.title || '课程概述'}</h3>
          <div class="overview-meta">
            <span class="duration">⏱️ ${overviewData.duration || '45分钟'}</span>
            <span class="difficulty">📊 ${overviewData.difficulty || '中级'}</span>
          </div>
        </div>
        
        <div class="overview-description">
          <p>${overviewData.description || '暂无描述'}</p>
        </div>
        
        <div class="overview-objectives">
          <h4>学习目标</h4>
          <ul class="objectives-list">
            ${(overviewData.objectives || []).map(objective => 
              `<li>${objective}</li>`
            ).join('')}
          </ul>
        </div>
        
        <div class="overview-keypoints">
          <h4>重点内容</h4>
          <ul class="keypoints-list">
            ${(overviewData.keyPoints || []).map(point => 
              `<li>${point}</li>`
            ).join('')}
          </ul>
        </div>
      </div>
    `;
  }

  // 渲染概念面板
  renderConceptsPanel(conceptsData) {
    const panel = document.getElementById('concepts-panel');
    if (!panel || !conceptsData) return;

    panel.innerHTML = `
      <div class="concepts-content">
        <div class="concepts-grid">
          ${conceptsData.map(concept => `
            <div class="concept-card ${concept.importance || 'medium'}">
              <div class="concept-header">
                <h4 class="concept-name">${concept.name}</h4>
                <span class="concept-importance ${concept.importance || 'medium'}">
                  ${concept.importance === 'high' ? '🔴 重要' : concept.importance === 'medium' ? '🟡 一般' : '🟢 了解'}
                </span>
              </div>
              <div class="concept-description">
                <p>${concept.description}</p>
              </div>
              <div class="concept-details">
                <p>${concept.details}</p>
              </div>
              ${concept.examples && concept.examples.length > 0 ? `
                <div class="concept-examples">
                  <h5>示例：</h5>
                  <ul>
                    ${concept.examples.map(example => `<li><code>${example}</code></li>`).join('')}
                  </ul>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 渲染公式面板
  renderFormulasPanel(formulasData) {
    const panel = document.getElementById('formulas-panel');
    if (!panel || !formulasData) return;

    panel.innerHTML = `
      <div class="formulas-content">
        <div class="formulas-list">
          ${formulasData.map(formula => `
            <div class="formula-card">
              <div class="formula-header">
                <h4 class="formula-name">${formula.name}</h4>
              </div>
              <div class="formula-expression">
                <code class="formula-code">${formula.formula}</code>
              </div>
              <div class="formula-description">
                <p>${formula.description}</p>
              </div>
              ${formula.properties && formula.properties.length > 0 ? `
                <div class="formula-properties">
                  <h5>性质：</h5>
                  <ul>
                    ${formula.properties.map(property => `<li>${property}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 检测触摸设备
  isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }

  // 处理触摸开始
  handleTouchStart(event) {
    const element = event.target;
    element.classList.add('touch-active');
    
    // 添加触摸反馈
    this.addTouchFeedback(element, event);
  }

  // 处理触摸结束
  handleTouchEnd(event) {
    const element = event.target;
    setTimeout(() => {
      element.classList.remove('touch-active');
    }, 150);
  }

  // 添加触摸反馈效果
  addTouchFeedback(element, event) {
    // 创建涟漪效果
    const ripple = document.createElement('span');
    ripple.classList.add('touch-ripple');
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    
    if (event.touches && event.touches[0]) {
      ripple.style.left = (event.touches[0].clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (event.touches[0].clientY - rect.top - size / 2) + 'px';
    }
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    // 移除涟漪效果
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }

  // 设置移动端手势支持
  setupMobileGestures() {
    if (!this.isTouchDevice()) return;

    // 设置触摸反馈
    this.setupTouchFeedback();

    // 标签页滑动手势
    const contentTabs = document.querySelector('.content-tabs');
    if (contentTabs) {
      this.setupTabSwipeGestures(contentTabs);
    }

    // 表单区域滑动手势
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
      this.setupSectionSwipeGestures(section);
    });

    // 长按手势支持
    this.setupLongPressGestures();

    // 双击缩放支持
    this.setupDoubleTapGestures();

    // 触摸优化
    this.setupTouchOptimizations();

    // 防止意外缩放
    this.preventAccidentalZoom();
  }

  // 设置触摸反馈
  setupTouchFeedback() {
    const touchElements = document.querySelectorAll('.btn, .action-btn, .tab-btn, .export-btn, .share-btn, .form-group input, .form-group select, .switch, .concept-card, .formula-card, .export-format-btn');
    
    touchElements.forEach(element => {
      // 触摸开始
      element.addEventListener('touchstart', (e) => {
        this.addTouchFeedback(element);
        this.createRippleEffect(element, e.touches[0]);
      }, { passive: true });
      
      // 触摸结束
      element.addEventListener('touchend', () => {
        this.removeTouchFeedback(element);
      }, { passive: true });
      
      // 触摸取消
      element.addEventListener('touchcancel', () => {
        this.removeTouchFeedback(element);
      }, { passive: true });
    });
  }

  // 添加触摸反馈
  addTouchFeedback(element) {
    element.classList.add('touch-active');
  }

  // 移除触摸反馈
  removeTouchFeedback(element) {
    setTimeout(() => {
      element.classList.remove('touch-active');
    }, 150);
  }

  // 创建波纹效果
  createRippleEffect(element, touch) {
    const rect = element.getBoundingClientRect();
    const ripple = document.createElement('span');
    const size = Math.max(rect.width, rect.height);
    const x = touch.clientX - rect.left - size / 2;
    const y = touch.clientY - rect.top - size / 2;
    
    ripple.className = 'touch-ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    // 移除波纹效果
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }

  // 设置触摸优化
  setupTouchOptimizations() {
    // 优化输入框焦点
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        // 延迟滚动到输入框，避免键盘弹出时的布局问题
        setTimeout(() => {
          input.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
          });
        }, 300);
      });

      // 输入框触摸优化
      input.addEventListener('touchstart', () => {
        input.style.transform = 'scale(1.02)';
      }, { passive: true });

      input.addEventListener('touchend', () => {
        input.style.transform = '';
      }, { passive: true });
    });

    // 优化滚动性能
    const scrollableElements = document.querySelectorAll('.content-panel, .options-panel, .export-panel, .content-tabs');
    scrollableElements.forEach(element => {
      element.style.webkitOverflowScrolling = 'touch';
      element.style.overflowScrolling = 'touch';
    });

    // 优化按钮触摸区域
    const buttons = document.querySelectorAll('.btn, .action-btn, .tab-btn');
    buttons.forEach(button => {
      // 确保最小触摸区域44px
      const rect = button.getBoundingClientRect();
      if (rect.height < 44) {
        button.style.minHeight = '44px';
        button.style.display = 'flex';
        button.style.alignItems = 'center';
        button.style.justifyContent = 'center';
      }
    });
  }

  // 防止意外缩放
  preventAccidentalZoom() {
    // 防止双击缩放
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
      const now = (new Date()).getTime();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    }, false);

    // 防止多点触控缩放
    document.addEventListener('touchstart', (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    });

    // 防止手势缩放
    document.addEventListener('gesturestart', (e) => {
      e.preventDefault();
    });
  }

  // 设置标签页滑动手势
  setupTabSwipeGestures(tabsContainer) {
    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    tabsContainer.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    }, { passive: true });

    tabsContainer.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      
      currentX = e.touches[0].clientX;
      const diffX = currentX - startX;
      
      // 添加滑动视觉反馈
      if (Math.abs(diffX) > 10) {
        tabsContainer.style.transform = `translateX(${diffX * 0.3}px)`;
      }
    }, { passive: true });

    tabsContainer.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      
      const diffX = currentX - startX;
      const threshold = 50;
      
      // 重置变换
      tabsContainer.style.transform = '';
      
      if (Math.abs(diffX) > threshold) {
        const activeTab = document.querySelector('.tab-btn.active');
        const tabs = Array.from(document.querySelectorAll('.tab-btn'));
        const currentIndex = tabs.indexOf(activeTab);
        
        if (diffX > 0 && currentIndex > 0) {
          // 向右滑动，切换到前一个标签
          tabs[currentIndex - 1].click();
        } else if (diffX < 0 && currentIndex < tabs.length - 1) {
          // 向左滑动，切换到后一个标签
          tabs[currentIndex + 1].click();
        }
      }
      
      isDragging = false;
    }, { passive: true });
  }

  // 设置区域滑动手势
  setupSectionSwipeGestures(section) {
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let isDragging = false;

    section.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      isDragging = true;
    }, { passive: true });

    section.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      
      currentX = e.touches[0].clientX;
      currentY = e.touches[0].clientY;
      
      const diffX = currentX - startX;
      const diffY = currentY - startY;
      
      // 检测水平滑动
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 20) {
        // 添加滑动提示
        this.showSwipeHint(diffX > 0 ? 'right' : 'left');
      }
    }, { passive: true });

    section.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      
      const diffX = currentX - startX;
      const diffY = currentY - startY;
      const threshold = 100;
      
      // 隐藏滑动提示
      this.hideSwipeHint();
      
      // 检测有效的水平滑动
      if (Math.abs(diffX) > threshold && Math.abs(diffX) > Math.abs(diffY)) {
        this.handleSectionSwipe(diffX > 0 ? 'right' : 'left');
      }
      
      isDragging = false;
    }, { passive: true });
  }

  // 处理区域滑动
  handleSectionSwipe(direction) {
    const sections = ['course-input-section', 'generation-section', 'content-display-section'];
    const currentIndex = sections.indexOf(this.currentSection);
    
    if (direction === 'right' && currentIndex > 0) {
      // 向右滑动，返回上一个区域
      const prevSection = sections[currentIndex - 1];
      if (this.canNavigateToSection(prevSection)) {
        this.switchSection(prevSection);
      }
    } else if (direction === 'left' && currentIndex < sections.length - 1) {
      // 向左滑动，前进到下一个区域
      const nextSection = sections[currentIndex + 1];
      if (this.canNavigateToSection(nextSection)) {
        this.switchSection(nextSection);
      }
    }
  }

  // 显示滑动提示
  showSwipeHint(direction) {
    let hint = document.querySelector('.swipe-hint');
    if (!hint) {
      hint = document.createElement('div');
      hint.className = 'swipe-hint';
      document.body.appendChild(hint);
    }
    
    hint.textContent = direction === 'right' ? '← 返回上一步' : '前进到下一步 →';
    hint.classList.add('show');
  }

  // 隐藏滑动提示
  hideSwipeHint() {
    const hint = document.querySelector('.swipe-hint');
    if (hint) {
      hint.classList.remove('show');
    }
  }

  // 设置长按手势
  setupLongPressGestures() {
    let longPressTimer;
    let isLongPress = false;

    document.addEventListener('touchstart', (e) => {
      isLongPress = false;
      longPressTimer = setTimeout(() => {
        isLongPress = true;
        this.handleLongPress(e);
      }, 800);
    }, { passive: true });

    document.addEventListener('touchend', () => {
      clearTimeout(longPressTimer);
    }, { passive: true });

    document.addEventListener('touchmove', () => {
      clearTimeout(longPressTimer);
    }, { passive: true });
  }

  // 处理长按
  handleLongPress(event) {
    const target = event.target;
    
    // 长按表单字段显示帮助
    if (target.matches('input, select, textarea')) {
      this.showFieldHelp(target);
    }
    
    // 长按按钮显示更多选项
    if (target.matches('.btn, .action-btn, .export-btn')) {
      this.showButtonOptions(target);
    }
    
    // 添加长按反馈
    target.classList.add('long-press-active');
    setTimeout(() => {
      target.classList.remove('long-press-active');
    }, 300);
  }

  // 显示字段帮助
  showFieldHelp(field) {
    const helpTexts = {
      'subject': '选择您要生成课件的学科',
      'grade': '选择适合的年级水平',
      'volume': '选择上册或下册',
      'title': '输入具体的课程标题',
      'difficulty': '选择课件的难度级别',
      'language': '选择课件的语言'
    };
    
    const helpText = helpTexts[field.name] || '长按获取帮助信息';
    this.showTooltip(field, helpText);
  }

  // 显示按钮选项
  showButtonOptions(button) {
    // 为不同按钮显示不同的选项
    if (button.classList.contains('generate-btn')) {
      this.showGenerateOptions();
    } else if (button.classList.contains('export-btn')) {
      this.showExportOptions();
    }
  }

  // 设置双击手势
  setupDoubleTapGestures() {
    let lastTap = 0;
    
    document.addEventListener('touchend', (e) => {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTap;
      
      if (tapLength < 500 && tapLength > 0) {
        this.handleDoubleTap(e);
      }
      
      lastTap = currentTime;
    }, { passive: true });
  }

  // 处理双击
  handleDoubleTap(event) {
    const target = event.target;
    
    // 双击标题区域返回顶部
    if (target.closest('.app-header')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // 双击内容区域切换全屏
    if (target.closest('.content-panel')) {
      this.toggleContentFullscreen(target.closest('.content-panel'));
    }
  }

  // 切换内容全屏
  toggleContentFullscreen(panel) {
    if (panel.classList.contains('fullscreen')) {
      panel.classList.remove('fullscreen');
      document.body.classList.remove('content-fullscreen');
    } else {
      panel.classList.add('fullscreen');
      document.body.classList.add('content-fullscreen');
    }
  }

  // 显示工具提示
  showTooltip(element, text) {
    let tooltip = document.querySelector('.mobile-tooltip');
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'mobile-tooltip';
      document.body.appendChild(tooltip);
    }
    
    tooltip.textContent = text;
    tooltip.classList.add('show');
    
    // 定位工具提示
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
    
    // 自动隐藏
    setTimeout(() => {
      tooltip.classList.remove('show');
    }, 3000);
  }

  // 渲染示意图面板
  renderDiagramsPanel(diagramsData) {
    const panel = document.getElementById('diagrams-panel');
    if (!panel || !diagramsData) return;

    panel.innerHTML = `
      <div class="diagrams-content">
        <div class="diagrams-grid">
          ${diagramsData.map(diagram => `
            <div class="diagram-card">
              <div class="diagram-header">
                <h4 class="diagram-title">${diagram.title}</h4>
                <span class="diagram-type">${diagram.type}</span>
              </div>
              <div class="diagram-container">
                ${diagram.svgContent || '<div class="diagram-placeholder">图表加载中...</div>'}
              </div>
              <div class="diagram-description">
                <p>${diagram.description}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 渲染交互面板
  renderInteractionsPanel(interactionsData) {
    const panel = document.getElementById('interactions-panel');
    if (!panel || !interactionsData) return;

    panel.innerHTML = `
      <div class="interactions-content">
        <div class="interactions-grid">
          ${interactionsData.map(interaction => `
            <div class="interaction-card" data-interaction-id="${interaction.id}">
              <div class="interaction-header">
                <h4 class="interaction-title">${interaction.title}</h4>
                <span class="interaction-type">${interaction.type}</span>
              </div>
              <div class="interaction-description">
                <p>${interaction.description}</p>
              </div>
              <div class="interaction-demo">
                ${this.renderInteractionDemo(interaction)}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // 绑定交互事件
    this.bindInteractionEvents();
  }

  // 渲染交互演示
  renderInteractionDemo(interaction) {
    switch (interaction.type) {
      case 'calculator':
        return `
          <div class="calculator-demo">
            <select class="function-select">
              ${interaction.config.functions.map(func => 
                `<option value="${func.expression}">${func.name}</option>`
              ).join('')}
            </select>
            <div class="calculator-input">
              <label>x = </label>
              <input type="number" class="x-input" placeholder="输入x值">
              <button class="calculate-btn">计算</button>
            </div>
            <div class="calculator-result">
              <span class="result-text">结果: <span class="result-value">-</span></span>
            </div>
          </div>
        `;
      
      case 'solver':
        return `
          <div class="solver-demo">
            <div class="solver-examples">
              ${interaction.config.examples.map(example => `
                <div class="example-item">
                  <code>${example.function}</code> → <span>${example.domain}</span>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      
      case 'checker':
        return `
          <div class="checker-demo">
            <select class="function-select">
              ${interaction.config.functions.map(func => 
                `<option value="${func.name}">${func.name}</option>`
              ).join('')}
            </select>
            <div class="checker-result">
              <div class="monotonicity-info">选择函数查看单调性</div>
            </div>
          </div>
        `;
      
      default:
        return '<div class="demo-placeholder">交互演示</div>';
    }
  }

  // 渲染资源面板
  renderResourcesPanel(resourcesData) {
    const panel = document.getElementById('resources-panel');
    if (!panel || !resourcesData) return;

    panel.innerHTML = `
      <div class="resources-content">
        <div class="resources-grid">
          ${resourcesData.map(resource => `
            <div class="resource-card" data-resource-type="${resource.type}">
              <div class="resource-thumbnail">
                <img src="${resource.thumbnail}" alt="${resource.title}" loading="lazy">
                <div class="resource-type-badge">${this.getResourceTypeLabel(resource.type)}</div>
              </div>
              <div class="resource-info">
                <h4 class="resource-title">${resource.title}</h4>
                <p class="resource-source">来源: ${resource.source}</p>
                <p class="resource-description">${resource.description}</p>
                <div class="resource-meta">
                  ${resource.duration ? `<span class="duration">⏱️ ${resource.duration}</span>` : ''}
                  ${resource.readTime ? `<span class="read-time">📖 ${resource.readTime}</span>` : ''}
                  ${resource.difficulty ? `<span class="difficulty">📊 ${resource.difficulty}</span>` : ''}
                  <span class="relevance">🎯 ${Math.round(resource.relevance * 100)}%</span>
                </div>
              </div>
              <div class="resource-actions">
                <button class="resource-btn primary" onclick="window.open('${resource.url}', '_blank')">
                  查看资源
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // 获取资源类型标签
  getResourceTypeLabel(type) {
    const labels = {
      video: '视频',
      exercise: '练习',
      article: '文章',
      tool: '工具',
      simulation: '模拟'
    };
    return labels[type] || type;
  }

  // 绑定交互事件
  bindInteractionEvents() {
    // 计算器交互
    document.querySelectorAll('.calculate-btn').forEach(btn => {
      btn.addEventListener('click', this.handleCalculatorClick.bind(this));
    });

    // 函数选择器交互
    document.querySelectorAll('.function-select').forEach(select => {
      select.addEventListener('change', this.handleFunctionSelect.bind(this));
    });
  }

  // 处理计算器点击
  handleCalculatorClick(event) {
    const card = event.target.closest('.interaction-card');
    const functionSelect = card.querySelector('.function-select');
    const xInput = card.querySelector('.x-input');
    const resultValue = card.querySelector('.result-value');

    const expression = functionSelect.value;
    const x = parseFloat(xInput.value);

    if (isNaN(x)) {
      resultValue.textContent = '请输入有效的x值';
      return;
    }

    try {
      // 简单的表达式计算（实际应用中应使用更安全的方法）
      const result = eval(expression.replace(/x/g, x));
      resultValue.textContent = result.toFixed(4);
    } catch (error) {
      resultValue.textContent = '计算错误';
    }
  }

  // 处理函数选择
  handleFunctionSelect(event) {
    const card = event.target.closest('.interaction-card');
    const interactionId = card.dataset.interactionId;
    
    if (interactionId === 'monotonicity-checker') {
      const selectedFunction = event.target.value;
      const resultDiv = card.querySelector('.checker-result');
      
      // 这里应该根据选择的函数显示相应的单调性信息
      // 简化演示
      resultDiv.innerHTML = `
        <div class="monotonicity-info">
          <h5>${selectedFunction} 的单调性：</h5>
          <p>在不同区间内具有不同的单调性，请参考具体分析。</p>
        </div>
      `;
    }
  }

  // 获取表单数据
  getFormData() {
    return { ...this.formData };
  }

  // 设置表单数据
  setFormData(data) {
    this.formData = { ...data };
    
    // 更新表单UI
    Object.keys(data).forEach(key => {
      const element = document.querySelector(`[name="${key}"]`);
      if (element) {
        if (element.type === 'checkbox') {
          element.checked = data[key];
        } else {
          element.value = data[key];
        }
      }
    });

    this.validateForm();
    this.updateGenerateButton();
  }
}

// 表单验证规则
const ValidationRules = {
  required: (value) => {
    return value !== null && value !== undefined && value.toString().trim() !== '';
  },

  minLength: (value, min) => {
    return value && value.toString().length >= min;
  },

  maxLength: (value, max) => {
    return !value || value.toString().length <= max;
  },

  pattern: (value, regex) => {
    return !value || regex.test(value.toString());
  },

  oneOf: (value, options) => {
    return !value || options.includes(value);
  }
};

// 表单字段配置
const FormFieldConfig = {
  subject: {
    required: true,
    label: '科目',
    errorMessages: {
      required: '请选择科目'
    }
  },
  
  grade: {
    required: true,
    label: '年级',
    errorMessages: {
      required: '请选择年级'
    }
  },
  
  volume: {
    required: true,
    label: '册数',
    errorMessages: {
      required: '请选择册数'
    }
  },
  
  title: {
    required: true,
    minLength: 2,
    maxLength: 100,
    label: '课程标题',
    errorMessages: {
      required: '请输入课程标题',
      minLength: '课程标题至少需要2个字符',
      maxLength: '课程标题不能超过100个字符'
    }
  },
  
  difficulty: {
    oneOf: ['basic', 'intermediate', 'advanced'],
    label: '难度级别',
    errorMessages: {
      oneOf: '请选择有效的难度级别'
    }
  },
  
  language: {
    oneOf: ['zh-CN', 'en-US'],
    label: '语言',
    errorMessages: {
      oneOf: '请选择有效的语言'
    }
  }
};

  // 导出相关UI管理方法
  
  // 显示导出面板
  showExportPanel() {
    const exportPanel = document.getElementById('export-options');
    if (exportPanel) {
      exportPanel.classList.add('show');
      this.initializeExportPanel();
    }
  }

  // 隐藏导出面板
  hideExportPanel() {
    const exportPanel = document.getElementById('export-options');
    if (exportPanel) {
      exportPanel.classList.remove('show');
    }
  }

  // 初始化导出面板
  initializeExportPanel() {
    // 绑定导出格式选择事件
    const formatBtns = document.querySelectorAll('.export-format-btn');
    formatBtns.forEach(btn => {
      btn.addEventListener('click', this.handleFormatSelect.bind(this));
    });

    // 绑定分享选项事件
    const shareOptionBtns = document.querySelectorAll('.share-option-btn');
    shareOptionBtns.forEach(btn => {
      btn.addEventListener('click', this.handleShareOptionSelect.bind(this));
    });

    // 绑定操作按钮事件
    const previewBtn = document.getElementById('preview-btn');
    const downloadBtn = document.getElementById('download-btn');
    const shareBtn = document.getElementById('share-btn');
    const copyLinkBtn = document.getElementById('copy-link-btn');

    if (previewBtn) {
      previewBtn.addEventListener('click', this.handlePreviewClick.bind(this));
    }
    if (downloadBtn) {
      downloadBtn.addEventListener('click', this.handleDownloadClick.bind(this));
    }
    if (shareBtn) {
      shareBtn.addEventListener('click', this.handleShareButtonClick.bind(this));
    }
    if (copyLinkBtn) {
      copyLinkBtn.addEventListener('click', this.handleCopyLinkClick.bind(this));
    }

    // 设置默认选择
    this.setDefaultExportOptions();
  }

  // 设置默认导出选项
  setDefaultExportOptions() {
    // 默认选择PPTX格式
    const defaultFormatBtn = document.querySelector('.export-format-btn[data-format="pptx"]');
    if (defaultFormatBtn) {
      defaultFormatBtn.classList.add('selected');
      this.selectedFormat = 'pptx';
      this.updateDownloadButton();
    }

    // 默认选择公开分享
    const defaultShareBtn = document.getElementById('share-public');
    if (defaultShareBtn) {
      defaultShareBtn.classList.add('selected');
      this.selectedShareOption = 'public';
    }
  }

  // 处理格式选择
  handleFormatSelect(event) {
    const btn = event.currentTarget;
    const format = btn.dataset.format;

    // 更新选择状态
    document.querySelectorAll('.export-format-btn').forEach(b => {
      b.classList.remove('selected');
    });
    btn.classList.add('selected');

    this.selectedFormat = format;
    this.updateDownloadButton();
  }

  // 处理分享选项选择
  handleShareOptionSelect(event) {
    const btn = event.currentTarget;
    const option = btn.id.replace('share-', '');

    // 更新选择状态
    document.querySelectorAll('.share-option-btn').forEach(b => {
      b.classList.remove('selected');
    });
    btn.classList.add('selected');

    this.selectedShareOption = option;
  }

  // 更新下载按钮
  updateDownloadButton() {
    const downloadBtn = document.getElementById('download-btn');
    if (downloadBtn && this.selectedFormat) {
      downloadBtn.disabled = false;
      const formatNames = {
        pptx: 'PowerPoint',
        pdf: 'PDF',
        html: 'HTML',
        docx: 'Word',
        json: 'JSON'
      };
      downloadBtn.querySelector('span').textContent = `下载${formatNames[this.selectedFormat]}`;
    }
  }

  // 处理预览点击
  handlePreviewClick(event) {
    if (!this.selectedFormat) {
      this.showError('请先选择导出格式');
      return;
    }

    // 获取当前课件内容
    const coursewareContent = this.getCurrentCoursewareContent();
    
    // 调用应用的预览方法
    if (window.app) {
      window.app.previewExport(this.selectedFormat, coursewareContent);
    }
  }

  // 处理下载点击
  async handleDownloadClick(event) {
    if (!this.selectedFormat) {
      this.showError('请先选择导出格式');
      return;
    }

    try {
      // 获取导出选项
      const exportOptions = this.getExportOptions();
      
      // 获取当前课件内容
      const coursewareContent = this.getCurrentCoursewareContent();
      
      // 调用应用的导出方法
      if (window.app) {
        await window.app.exportCourseware(this.selectedFormat, coursewareContent, exportOptions);
      }
    } catch (error) {
      console.error('导出失败:', error);
      this.showError('导出失败', error.message);
    }
  }

  // 处理分享按钮点击
  async handleShareButtonClick(event) {
    if (!this.selectedShareOption) {
      this.showError('请先选择分享选项');
      return;
    }

    try {
      // 获取分享选项
      const shareOptions = this.getShareOptions();
      
      // 获取当前课件内容
      const coursewareContent = this.getCurrentCoursewareContent();
      
      // 调用应用的分享方法
      if (window.app) {
        const result = await window.app.shareCourseware(coursewareContent, shareOptions);
        this.showShareResult(result);
      }
    } catch (error) {
      console.error('分享失败:', error);
      this.showError('分享失败', error.message);
    }
  }

  // 处理复制链接点击
  async handleCopyLinkClick(event) {
    const linkInput = document.getElementById('share-link-input');
    const copyBtn = event.currentTarget;
    
    if (!linkInput || !linkInput.value) {
      this.showError('没有可复制的链接');
      return;
    }

    try {
      // 调用应用的复制方法
      if (window.app) {
        const success = await window.app.copyShareLink(linkInput.value);
        if (success) {
          // 更新按钮状态
          copyBtn.classList.add('copied');
          copyBtn.querySelector('span').textContent = '已复制';
          
          setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.querySelector('span').textContent = '复制';
          }, 2000);
        }
      }
    } catch (error) {
      console.error('复制失败:', error);
      this.showError('复制失败', error.message);
    }
  }

  // 获取导出选项
  getExportOptions() {
    const options = {};
    
    // 获取复选框选项
    const checkboxes = document.querySelectorAll('.export-option input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
      options[checkbox.id] = checkbox.checked;
    });
    
    return options;
  }

  // 获取分享选项
  getShareOptions() {
    const options = {
      type: this.selectedShareOption
    };
    
    // 根据分享类型设置不同的选项
    switch (this.selectedShareOption) {
      case 'password':
        options.requirePassword = true;
        options.password = this.generateRandomPassword();
        break;
      case 'limited':
        options.expireDays = 7;
        options.maxAccess = 100;
        break;
      case 'public':
      default:
        options.expireDays = 30;
        break;
    }
    
    return options;
  }

  // 生成随机密码
  generateRandomPassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  // 获取当前课件内容
  getCurrentCoursewareContent() {
    // 这里应该返回当前显示的课件内容
    // 暂时返回演示数据
    return DEMO_DATA.sampleCourseware;
  }

  // 显示导出进度
  showExportProgress() {
    const progressElement = document.getElementById('export-progress');
    if (progressElement) {
      progressElement.style.display = 'block';
      this.updateExportProgress(0, '准备导出...');
    }
  }

  // 更新导出进度
  updateExportProgress(percentage, text) {
    const progressFill = document.querySelector('#export-progress .progress-fill');
    const progressText = document.querySelector('#export-progress .progress-text');
    const progressPercent = document.querySelector('#export-progress .progress-percent');
    
    if (progressFill) {
      progressFill.style.width = `${percentage}%`;
    }
    if (progressText) {
      progressText.textContent = text;
    }
    if (progressPercent) {
      progressPercent.textContent = `${Math.round(percentage)}%`;
    }
  }

  // 隐藏导出进度
  hideExportProgress() {
    const progressElement = document.getElementById('export-progress');
    if (progressElement) {
      progressElement.style.display = 'none';
    }
  }

  // 显示分享结果
  showShareResult(result) {
    const shareResultElement = document.getElementById('share-result');
    const shareLinkInput = document.getElementById('share-link-input');
    const shareExpires = document.getElementById('share-expires');
    const shareAccess = document.getElementById('share-access');
    
    if (shareResultElement && result.shareUrl) {
      // 显示分享结果面板
      shareResultElement.style.display = 'block';
      
      // 设置分享链接
      if (shareLinkInput) {
        shareLinkInput.value = result.shareUrl;
      }
      
      // 设置过期信息
      if (shareExpires && result.expiresAt) {
        const expiresDate = new Date(result.expiresAt);
        const daysLeft = Math.ceil((expiresDate - new Date()) / (1000 * 60 * 60 * 24));
        shareExpires.textContent = `链接${daysLeft}天后过期`;
      }
      
      // 设置访问次数
      if (shareAccess) {
        shareAccess.textContent = `访问次数：${result.accessCount || 0}`;
      }
    }
  }

  // 隐藏分享结果
  hideShareResult() {
    const shareResultElement = document.getElementById('share-result');
    if (shareResultElement) {
      shareResultElement.style.display = 'none';
    }
  }

  // 设置表单数据（用于恢复用户输入）
  setFormData(formData) {
    if (!formData) return;
    
    Object.keys(formData).forEach(key => {
      const element = document.querySelector(`[name="${key}"]`);
      if (element) {
        if (element.type === 'checkbox') {
          element.checked = formData[key];
        } else {
          element.value = formData[key];
        }
      }
    });
    
    // 重新验证表单
    this.validateForm();
    this.updateGenerateButton();
  }

  // 获取表单数据
  getFormData() {
    this.collectFormData();
    return { ...this.formData };
  }

  // 处理计算器点击（完整版本）
  handleCalculatorClick(event) {
    const card = event.target.closest('.interaction-card');
    const functionSelect = card.querySelector('.function-select');
    const xInput = card.querySelector('.x-input');
    const resultValue = card.querySelector('.result-value');

    const expression = functionSelect.value;
    const x = parseFloat(xInput.value);

    if (isNaN(x)) {
      resultValue.textContent = '请输入有效的x值';
      return;
    }

    try {
      // 简单的表达式计算（实际应用中应使用更安全的方法）
      const result = eval(expression.replace(/x/g, x));
      resultValue.textContent = isNaN(result) ? '计算错误' : result.toFixed(4);
    } catch (error) {
      resultValue.textContent = '计算错误';
    }
  }

  // 处理函数选择
  handleFunctionSelect(event) {
    const card = event.target.closest('.interaction-card');
    const interactionId = card.dataset.interactionId;
    
    if (interactionId === 'monotonicity-checker') {
      const resultDiv = card.querySelector('.checker-result .monotonicity-info');
      const selectedFunction = event.target.value;
      
      // 这里应该根据选择的函数显示相应的单调性信息
      // 暂时显示示例信息
      resultDiv.innerHTML = `
        <strong>${selectedFunction}</strong> 的单调性：<br>
        在区间 (-∞, 0) 上单调递减<br>
        在区间 (0, +∞) 上单调递增
      `;
    }
  }

  // 初始化导出按钮事件（更新现有方法）
  initializeExportButton() {
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        this.showExportPanel();
      });
    }
  }
}

// 导出UIManager类到全局作用域
window.UIManager = UIManager;

// 确保在DOM加载完成后初始化导出功能
document.addEventListener('DOMContentLoaded', () => {
  // 如果UIManager已经存在，添加导出功能
  if (window.uiManager) {
    window.uiManager.initializeExportButton();
  }
});
    window.uiManager.initializeExportButton();
  }
});