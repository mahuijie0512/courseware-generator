// 页面导航管理系统
class NavigationManager {
  constructor() {
    this.currentSection = 'course-input-section';
    this.navigationHistory = [];
    this.maxHistorySize = 10;
    this.stateActions = null;
    this.stateSelectors = null;
    this.transitionDuration = 300;
    
    this.init();
  }

  init() {
    this.setupNavigationControls();
    this.setupKeyboardNavigation();
    this.setupBrowserNavigation();
    this.updateNavigationState();
  }

  // 设置状态管理器引用
  setStateManager(stateActions, stateSelectors) {
    this.stateActions = stateActions;
    this.stateSelectors = stateSelectors;
  }

  // 设置导航控件
  setupNavigationControls() {
    // 创建导航按钮
    this.createNavigationButtons();
    
    // 绑定导航事件
    this.bindNavigationEvents();
    
    // 创建进度指示器
    this.createProgressIndicator();
  }

  // 创建导航按钮
  createNavigationButtons() {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
      const navControls = document.createElement('div');
      navControls.className = 'nav-controls';
      
      const prevBtn = document.createElement('button');
      prevBtn.className = 'nav-btn nav-prev';
      prevBtn.innerHTML = '<span class="nav-icon">←</span> 上一步';
      prevBtn.addEventListener('click', () => this.navigatePrevious());
      
      const nextBtn = document.createElement('button');
      nextBtn.className = 'nav-btn nav-next';
      nextBtn.innerHTML = '下一步 <span class="nav-icon">→</span>';
      nextBtn.addEventListener('click', () => this.navigateNext());
      
      navControls.appendChild(prevBtn);
      navControls.appendChild(nextBtn);
      
      section.appendChild(navControls);
    });
  }

  // 绑定导航事件
  bindNavigationEvents() {
    // 监听section变更事件
    window.addEventListener('sectionChange', (event) => {
      this.handleSectionChange(event.detail);
    });
    
    // 监听状态变更
    if (window.stateManager) {
      window.stateManager.subscribe('navigation', (state, previousState) => {
        if (state.currentSection !== previousState.currentSection) {
          this.updateNavigationState();
        }
      });
    }
    
    // 监听表单提交事件
    document.addEventListener('submit', (event) => {
      if (event.target.id === 'course-form') {
        event.preventDefault();
        this.handleFormSubmission(event.target);
      }
    });
    
    // 监听表单输入变化
    document.addEventListener('input', (event) => {
      if (event.target.closest('#course-form')) {
        this.handleFormInputChange();
      }
    });
    
    // 监听用户流程事件
    window.addEventListener('userFlow', (event) => {
      console.log('用户流程事件:', event.detail);
    });
    
    // 监听过渡完成事件
    window.addEventListener('transitionComplete', (event) => {
      console.log('页面过渡完成:', event.detail);
    });
  }

  // 处理表单提交
  handleFormSubmission(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // 添加选项数据
    data.includeInteractions = document.getElementById('include-interactions')?.checked || false;
    data.searchResources = document.getElementById('search-resources')?.checked || false;
    data.generateDiagrams = document.getElementById('generate-diagrams')?.checked || false;
    data.difficulty = document.getElementById('difficulty')?.value || 'intermediate';
    data.language = document.getElementById('language')?.value || 'zh-CN';
    
    // 处理表单完成流程
    if (this.handleUserFlow('form-completed', data)) {
      // 开始生成流程
      this.startGenerationFlow(data);
    }
  }

  // 处理表单输入变化
  handleFormInputChange() {
    // 延迟验证以避免频繁触发
    clearTimeout(this.formValidationTimeout);
    this.formValidationTimeout = setTimeout(() => {
      this.validateAndUpdateForm();
    }, 300);
  }

  // 验证并更新表单状态
  validateAndUpdateForm() {
    const form = document.getElementById('course-form');
    if (!form) return;
    
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // 验证表单
    const isValid = this.validateFormData(data);
    
    // 更新生成按钮状态
    const generateBtn = document.getElementById('generate-btn');
    if (generateBtn) {
      generateBtn.disabled = !isValid;
      generateBtn.classList.toggle('disabled', !isValid);
    }
    
    // 更新导航状态
    this.updateNavigationState();
  }

  // 开始生成流程
  startGenerationFlow(data) {
    // 处理生成开始
    if (this.handleUserFlow('generation-started', data)) {
      // 模拟生成过程
      this.simulateGeneration(data);
    }
  }

  // 模拟生成过程
  async simulateGeneration(data) {
    try {
      // 获取进度管理器
      const progressManager = window.uiManager?.progressManager;
      
      if (progressManager) {
        // 开始进度
        progressManager.start();
        
        // 模拟各个步骤
        const steps = [
          { delay: 1000, message: '初始化生成环境...' },
          { delay: 1500, message: '生成课程概述...' },
          { delay: 2000, message: '提取重点概念...' },
          { delay: 1800, message: '搜索相关资源...' },
          { delay: 1200, message: '生成交互组件...' }
        ];
        
        for (let i = 0; i < steps.length; i++) {
          await new Promise(resolve => setTimeout(resolve, steps[i].delay));
          progressManager.nextStep(steps[i].message);
        }
        
        // 完成生成
        this.handleUserFlow('generation-completed', { 
          content: window.DEMO_DATA?.sampleCourseware 
        });
        
      } else {
        // 回退方案
        setTimeout(() => {
          this.handleUserFlow('generation-completed', { 
            content: window.DEMO_DATA?.sampleCourseware 
          });
        }, 3000);
      }
      
    } catch (error) {
      console.error('生成过程出错:', error);
      this.handleUserFlow('generation-failed', { 
        message: error.message || '生成过程中出现未知错误' 
      });
    }
  }

  // 创建进度指示器
  createProgressIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'navigation-progress';
    indicator.innerHTML = `
      <div class="progress-steps">
        <div class="step" data-section="course-input-section">
          <div class="step-number">1</div>
          <div class="step-label">输入信息</div>
        </div>
        <div class="step" data-section="generation-section">
          <div class="step-number">2</div>
          <div class="step-label">生成课件</div>
        </div>
        <div class="step" data-section="content-display-section">
          <div class="step-number">3</div>
          <div class="step-label">查看结果</div>
        </div>
      </div>
      <div class="progress-line">
        <div class="progress-fill"></div>
      </div>
    `;
    
    // 插入到页面顶部
    const header = document.querySelector('header');
    if (header && header.parentNode) {
      // 使用更兼容的方法插入元素
      header.parentNode.insertBefore(indicator, header.nextSibling);
    } else {
      // 如果没有header，插入到body的开头
      const body = document.body;
      if (body.firstChild) {
        body.insertBefore(indicator, body.firstChild);
      } else {
        body.appendChild(indicator);
      }
    }
  }

  // 设置键盘导航
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (event) => {
      // Alt + 左箭头：上一步
      if (event.altKey && event.key === 'ArrowLeft') {
        event.preventDefault();
        this.navigatePrevious();
      }
      
      // Alt + 右箭头：下一步
      if (event.altKey && event.key === 'ArrowRight') {
        event.preventDefault();
        this.navigateNext();
      }
      
      // Alt + 数字键：直接跳转
      if (event.altKey && /^[1-3]$/.test(event.key)) {
        event.preventDefault();
        const sectionIndex = parseInt(event.key) - 1;
        const sections = ['course-input-section', 'generation-section', 'content-display-section'];
        this.navigateToSection(sections[sectionIndex]);
      }
    });
  }

  // 设置浏览器导航
  setupBrowserNavigation() {
    // 监听浏览器前进后退
    window.addEventListener('popstate', (event) => {
      if (event.state && event.state.section) {
        this.navigateToSection(event.state.section, { updateHistory: false });
      }
    });
    
    // 设置初始历史状态
    history.replaceState(
      { section: this.currentSection }, 
      '', 
      `#${this.currentSection}`
    );
  }

  // 导航到指定section
  navigateToSection(sectionId, options = {}) {
    const { 
      updateHistory = true, 
      force = false,
      transition = true 
    } = options;
    
    // 验证导航有效性
    if (!force && !this.canNavigateToSection(sectionId)) {
      this.showNavigationError(`无法导航到 ${this.getSectionName(sectionId)}`);
      return false;
    }
    
    // 记录导航历史
    if (updateHistory) {
      this.addToHistory(this.currentSection);
      history.pushState(
        { section: sectionId }, 
        '', 
        `#${sectionId}`
      );
    }
    
    // 执行导航
    if (transition) {
      this.performTransition(this.currentSection, sectionId);
    } else {
      this.switchSectionImmediate(sectionId);
    }
    
    // 更新状态
    this.currentSection = sectionId;
    
    // 通过状态管理器更新
    if (this.stateActions) {
      this.stateActions.switchSection(sectionId);
    }
    
    // 更新导航状态
    this.updateNavigationState();
    
    return true;
  }

  // 执行过渡动画
  performTransition(fromSection, toSection) {
    const fromElement = document.getElementById(fromSection);
    const toElement = document.getElementById(toSection);
    
    if (!fromElement || !toElement) {
      this.switchSectionImmediate(toSection);
      return;
    }
    
    // 确定过渡方向
    const direction = this.getTransitionDirection(fromSection, toSection);
    
    // 添加过渡类
    fromElement.classList.add('section-leaving', `section-leave-${direction}`);
    toElement.classList.add('section-entering', `section-enter-${direction}`);
    
    // 显示目标section
    toElement.classList.add('active');
    
    // 执行动画
    requestAnimationFrame(() => {
      fromElement.classList.add('section-leave-active');
      toElement.classList.add('section-enter-active');
      
      setTimeout(() => {
        // 清理源section
        fromElement.classList.remove('active', 'section-leaving', 'section-leave-active', `section-leave-${direction}`);
        
        // 完成目标section
        toElement.classList.remove('section-entering', 'section-enter-active', `section-enter-${direction}`);
        
        // 触发过渡完成事件
        this.dispatchTransitionCompleteEvent(fromSection, toSection);
        
      }, this.transitionDuration);
    });
  }

  // 获取过渡方向
  getTransitionDirection(fromSection, toSection) {
    const sections = ['course-input-section', 'generation-section', 'content-display-section'];
    const fromIndex = sections.indexOf(fromSection);
    const toIndex = sections.indexOf(toSection);
    
    if (fromIndex < toIndex) {
      return 'forward'; // 向前
    } else if (fromIndex > toIndex) {
      return 'backward'; // 向后
    } else {
      return 'none'; // 同一页面
    }
  }

  // 分发过渡完成事件
  dispatchTransitionCompleteEvent(fromSection, toSection) {
    const event = new CustomEvent('transitionComplete', {
      detail: {
        fromSection,
        toSection,
        timestamp: Date.now()
      }
    });
    
    window.dispatchEvent(event);
  }

  // 立即切换section
  switchSectionImmediate(sectionId) {
    // 隐藏所有section
    document.querySelectorAll('.section').forEach(section => {
      section.classList.remove('active');
    });
    
    // 显示目标section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.add('active');
    }
  }

  // 上一步导航
  navigatePrevious() {
    const sections = ['course-input-section', 'generation-section', 'content-display-section'];
    const currentIndex = sections.indexOf(this.currentSection);
    
    if (currentIndex > 0) {
      this.navigateToSection(sections[currentIndex - 1]);
    } else if (this.navigationHistory.length > 0) {
      // 从历史记录中恢复
      const previousSection = this.navigationHistory.pop();
      this.navigateToSection(previousSection, { updateHistory: false });
    }
  }

  // 下一步导航
  navigateNext() {
    const sections = ['course-input-section', 'generation-section', 'content-display-section'];
    const currentIndex = sections.indexOf(this.currentSection);
    
    if (currentIndex < sections.length - 1) {
      this.navigateToSection(sections[currentIndex + 1]);
    }
  }

  // 检查是否可以导航到指定section
  canNavigateToSection(sectionId) {
    switch (sectionId) {
      case 'course-input-section':
        return true; // 总是可以返回到输入页面
        
      case 'generation-section':
        // 需要表单有效
        if (this.stateSelectors) {
          return this.stateSelectors.isFormValid();
        }
        // 回退到基本验证
        return window.uiManager ? window.uiManager.isFormValid : false;
        
      case 'content-display-section':
        // 需要有生成的内容
        if (this.stateSelectors) {
          return this.stateSelectors.hasContent() || this.stateSelectors.isGenerating();
        }
        // 回退到基本检查
        return window.uiManager ? window.uiManager.currentSection === 'content-display-section' : false;
        
      default:
        return false;
    }
  }

  // 添加到导航历史
  addToHistory(sectionId) {
    if (this.navigationHistory[this.navigationHistory.length - 1] !== sectionId) {
      this.navigationHistory.push(sectionId);
      
      // 限制历史大小
      if (this.navigationHistory.length > this.maxHistorySize) {
        this.navigationHistory.shift();
      }
    }
  }

  // 处理section变更
  handleSectionChange(detail) {
    this.currentSection = detail.newSection;
    this.updateNavigationState();
    this.updateProgressIndicator();
  }

  // 更新导航状态
  updateNavigationState() {
    const sections = ['course-input-section', 'generation-section', 'content-display-section'];
    const currentIndex = sections.indexOf(this.currentSection);
    
    // 更新导航按钮状态
    document.querySelectorAll('.nav-prev').forEach(btn => {
      btn.disabled = currentIndex <= 0 && this.navigationHistory.length === 0;
      btn.classList.toggle('disabled', btn.disabled);
    });
    
    document.querySelectorAll('.nav-next').forEach(btn => {
      const canGoNext = currentIndex < sections.length - 1 && 
                       this.canNavigateToSection(sections[currentIndex + 1]);
      btn.disabled = !canGoNext;
      btn.classList.toggle('disabled', btn.disabled);
    });
    
    // 更新按钮文本
    this.updateNavigationButtonText();
  }

  // 更新导航按钮文本
  updateNavigationButtonText() {
    const sections = ['course-input-section', 'generation-section', 'content-display-section'];
    const sectionNames = ['输入信息', '生成课件', '查看结果'];
    const currentIndex = sections.indexOf(this.currentSection);
    
    document.querySelectorAll('.nav-prev').forEach(btn => {
      if (currentIndex > 0) {
        btn.innerHTML = `<span class="nav-icon">←</span> ${sectionNames[currentIndex - 1]}`;
      } else {
        btn.innerHTML = '<span class="nav-icon">←</span> 上一步';
      }
    });
    
    document.querySelectorAll('.nav-next').forEach(btn => {
      if (currentIndex < sections.length - 1) {
        btn.innerHTML = `${sectionNames[currentIndex + 1]} <span class="nav-icon">→</span>`;
      } else {
        btn.innerHTML = '下一步 <span class="nav-icon">→</span>';
      }
    });
  }

  // 更新进度指示器
  updateProgressIndicator() {
    const sections = ['course-input-section', 'generation-section', 'content-display-section'];
    const currentIndex = sections.indexOf(this.currentSection);
    
    // 更新步骤状态
    document.querySelectorAll('.navigation-progress .step').forEach((step, index) => {
      step.classList.remove('active', 'completed');
      
      if (index < currentIndex) {
        step.classList.add('completed');
      } else if (index === currentIndex) {
        step.classList.add('active');
      }
    });
    
    // 更新进度条
    const progressFill = document.querySelector('.navigation-progress .progress-fill');
    if (progressFill) {
      const progress = (currentIndex / (sections.length - 1)) * 100;
      progressFill.style.width = `${progress}%`;
    }
  }

  // 获取section名称
  getSectionName(sectionId) {
    const names = {
      'course-input-section': '课程信息输入',
      'generation-section': '课件生成',
      'content-display-section': '内容展示'
    };
    return names[sectionId] || sectionId;
  }

  // 显示导航错误
  showNavigationError(message) {
    if (window.uiManager) {
      window.uiManager.showError(message, '导航失败');
    } else {
      console.warn(message);
    }
  }

  // 获取导航状态
  getNavigationState() {
    const sections = ['course-input-section', 'generation-section', 'content-display-section'];
    const currentIndex = sections.indexOf(this.currentSection);
    
    return {
      currentSection: this.currentSection,
      currentIndex,
      canGoBack: currentIndex > 0 || this.navigationHistory.length > 0,
      canGoForward: currentIndex < sections.length - 1 && 
                   this.canNavigateToSection(sections[currentIndex + 1]),
      progress: (currentIndex / (sections.length - 1)) * 100,
      history: [...this.navigationHistory]
    };
  }

  // 重置导航
  resetNavigation() {
    this.currentSection = 'course-input-section';
    this.navigationHistory = [];
    this.navigateToSection('course-input-section', { force: true });
  }

  // 用户操作流程控制
  handleUserFlow(action, data = {}) {
    switch (action) {
      case 'form-completed':
        return this.handleFormCompleted(data);
      case 'generation-started':
        return this.handleGenerationStarted(data);
      case 'generation-completed':
        return this.handleGenerationCompleted(data);
      case 'generation-failed':
        return this.handleGenerationFailed(data);
      case 'content-viewed':
        return this.handleContentViewed(data);
      case 'export-requested':
        return this.handleExportRequested(data);
      default:
        console.warn(`未知的用户操作: ${action}`);
        return false;
    }
  }

  // 处理表单完成
  handleFormCompleted(data) {
    // 验证表单数据
    if (!this.validateFormData(data)) {
      this.showNavigationError('表单数据不完整，无法继续');
      return false;
    }

    // 启用生成按钮和导航
    this.updateNavigationState();
    
    // 记录用户流程
    this.recordUserAction('form-completed', data);
    
    return true;
  }

  // 处理生成开始
  handleGenerationStarted(data) {
    // 导航到生成页面
    const success = this.navigateToSection('generation-section');
    
    if (success) {
      // 禁用返回按钮（生成过程中）
      this.setNavigationLocked(true);
      
      // 记录用户流程
      this.recordUserAction('generation-started', data);
    }
    
    return success;
  }

  // 处理生成完成
  handleGenerationCompleted(data) {
    // 解锁导航
    this.setNavigationLocked(false);
    
    // 导航到内容展示页面
    const success = this.navigateToSection('content-display-section');
    
    if (success) {
      // 记录用户流程
      this.recordUserAction('generation-completed', data);
      
      // 更新导航状态
      this.updateNavigationState();
    }
    
    return success;
  }

  // 处理生成失败
  handleGenerationFailed(data) {
    // 解锁导航
    this.setNavigationLocked(false);
    
    // 显示错误并允许返回
    this.showNavigationError(data.message || '生成失败，请重试');
    
    // 记录用户流程
    this.recordUserAction('generation-failed', data);
    
    // 更新导航状态
    this.updateNavigationState();
    
    return true;
  }

  // 处理内容查看
  handleContentViewed(data) {
    // 记录用户流程
    this.recordUserAction('content-viewed', data);
    
    // 启用导出功能
    this.enableExportNavigation();
    
    return true;
  }

  // 处理导出请求
  handleExportRequested(data) {
    // 记录用户流程
    this.recordUserAction('export-requested', data);
    
    // 可以在这里添加导出相关的导航逻辑
    return true;
  }

  // 验证表单数据
  validateFormData(data) {
    const requiredFields = ['subject', 'grade', 'volume', 'title'];
    return requiredFields.every(field => data[field] && data[field].trim().length > 0);
  }

  // 设置导航锁定状态
  setNavigationLocked(locked) {
    this.navigationLocked = locked;
    
    // 更新导航按钮状态
    document.querySelectorAll('.nav-btn').forEach(btn => {
      if (locked) {
        btn.classList.add('locked');
        btn.disabled = true;
      } else {
        btn.classList.remove('locked');
        btn.disabled = false;
      }
    });
    
    // 更新键盘导航
    if (locked) {
      document.removeEventListener('keydown', this.keyboardHandler);
    } else {
      document.addEventListener('keydown', this.keyboardHandler);
    }
  }

  // 启用导出导航
  enableExportNavigation() {
    const exportButtons = document.querySelectorAll('.export-btn, .share-btn');
    exportButtons.forEach(btn => {
      btn.disabled = false;
      btn.classList.remove('disabled');
    });
  }

  // 记录用户操作
  recordUserAction(action, data) {
    const actionRecord = {
      action,
      data,
      timestamp: Date.now(),
      section: this.currentSection,
      sessionId: this.getSessionId()
    };
    
    // 存储到本地存储或发送到分析服务
    this.storeUserAction(actionRecord);
    
    // 触发用户流程事件
    this.dispatchUserFlowEvent(actionRecord);
  }

  // 存储用户操作记录
  storeUserAction(actionRecord) {
    try {
      const existingActions = JSON.parse(localStorage.getItem('user-actions') || '[]');
      existingActions.push(actionRecord);
      
      // 限制存储数量
      if (existingActions.length > 100) {
        existingActions.shift();
      }
      
      localStorage.setItem('user-actions', JSON.stringify(existingActions));
    } catch (error) {
      console.warn('无法存储用户操作记录:', error);
    }
  }

  // 分发用户流程事件
  dispatchUserFlowEvent(actionRecord) {
    const event = new CustomEvent('userFlow', {
      detail: actionRecord
    });
    
    window.dispatchEvent(event);
  }

  // 获取会话ID
  getSessionId() {
    if (!this.sessionId) {
      this.sessionId = 'nav_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
    }
    return this.sessionId;
  }

  // 获取用户流程统计
  getUserFlowStats() {
    try {
      const actions = JSON.parse(localStorage.getItem('user-actions') || '[]');
      const stats = {
        totalActions: actions.length,
        actionsByType: {},
        sessionActions: actions.filter(a => a.sessionId === this.getSessionId()),
        averageTimePerSection: this.calculateAverageTimePerSection(actions)
      };
      
      // 统计各类操作数量
      actions.forEach(action => {
        stats.actionsByType[action.action] = (stats.actionsByType[action.action] || 0) + 1;
      });
      
      return stats;
    } catch (error) {
      console.warn('无法获取用户流程统计:', error);
      return null;
    }
  }

  // 计算各section平均停留时间
  calculateAverageTimePerSection(actions) {
    const sectionTimes = {};
    let lastAction = null;
    
    actions.forEach(action => {
      if (lastAction && lastAction.section === action.section) {
        const duration = action.timestamp - lastAction.timestamp;
        if (!sectionTimes[action.section]) {
          sectionTimes[action.section] = [];
        }
        sectionTimes[action.section].push(duration);
      }
      lastAction = action;
    });
    
    // 计算平均值
    const averages = {};
    Object.keys(sectionTimes).forEach(section => {
      const times = sectionTimes[section];
      averages[section] = times.reduce((sum, time) => sum + time, 0) / times.length;
    });
    
    return averages;
  }

  // 销毁导航管理器
  destroy() {
    // 移除事件监听器
    if (this.keyboardHandler) {
      document.removeEventListener('keydown', this.keyboardHandler);
    }
    if (this.popstateHandler) {
      window.removeEventListener('popstate', this.popstateHandler);
    }
    
    // 清理超时
    if (this.formValidationTimeout) {
      clearTimeout(this.formValidationTimeout);
    }
    
    // 清理DOM元素
    const progressIndicator = document.querySelector('.navigation-progress');
    if (progressIndicator) {
      progressIndicator.remove();
    }
    
    document.querySelectorAll('.nav-controls').forEach(control => {
      control.remove();
    });
    
    // 清理状态
    this.navigationHistory = [];
    this.stateActions = null;
    this.stateSelectors = null;
    
    console.log('导航管理器已销毁');
  }

  // 获取导航调试信息
  getDebugInfo() {
    return {
      currentSection: this.currentSection,
      navigationHistory: [...this.navigationHistory],
      navigationLocked: this.navigationLocked || false,
      sessionId: this.getSessionId(),
      userFlowStats: this.getUserFlowStats(),
      navigationState: this.getNavigationState()
    };
  }
}

// 导出导航管理器
window.NavigationManager = NavigationManager;