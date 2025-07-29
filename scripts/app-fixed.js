// 主应用程序入口 - 修复版本
class App {
  constructor() {
    this.stateManager = null;
    this.uiManager = null;
    this.coursewareManager = null;
    this.isInitialized = false;
    
    console.log('App 构造函数开始');
    this.init();
  }

  async init() {
    try {
      console.log('App init 开始');
      // 等待DOM加载完成
      if (document.readyState === 'loading') {
        console.log('等待DOM加载完成');
        document.addEventListener('DOMContentLoaded', () => this.initializeApp());
      } else {
        console.log('DOM已加载，直接初始化');
        this.initializeApp();
      }
    } catch (error) {
      console.error('应用初始化失败:', error);
      this.showInitError(error);
    }
  }

  initializeApp() {
    console.log('开始初始化应用组件');
    
    try {
      // 检查必要的全局对象是否存在
      this.checkDependencies();
      
      // 初始化错误处理系统
      console.log('初始化错误处理系统');
      this.errorHandler = new ErrorHandler();
      
      // 初始化动画管理器
      console.log('初始化动画管理器');
      this.animationManager = new AnimationManager();
      
      // 初始化状态管理器
      console.log('初始化状态管理器');
      this.stateManager = new StateManager();
      
      // 初始化状态动作创建器和选择器
      console.log('初始化状态动作和选择器');
      this.stateActions = new StateActions(this.stateManager);
      this.stateSelectors = new StateSelectors(this.stateManager);
      
      // 初始化UI管理器
      console.log('初始化UI管理器');
      this.uiManager = new UIManager();
      
      // 连接UI管理器与状态管理器和动画管理器
      console.log('连接管理器');
      this.uiManager.setStateManager(this.stateActions, this.stateSelectors);
      this.uiManager.setAnimationManager(this.animationManager);
      this.uiManager.setErrorHandler(this.errorHandler);
      
      // 初始化导航管理器
      console.log('初始化导航管理器');
      this.navigationManager = new NavigationManager();
      this.navigationManager.setStateManager(this.stateActions, this.stateSelectors);
      this.navigationManager.setAnimationManager(this.animationManager);
      this.navigationManager.setErrorHandler(this.errorHandler);
      
      // 初始化课件管理器（如果存在）
      if (window.CoursewareManager) {
        console.log('初始化课件管理器');
        this.coursewareManager = new CoursewareManager();
      } else {
        console.warn('CoursewareManager 不存在，跳过初始化');
      }
      
      // 设置组件间的状态通信
      console.log('设置状态通信');
      this.setupStateIntegration();
      
      // 设置全局引用
      console.log('设置全局引用');
      this.setupGlobalReferences();
      
      this.isInitialized = true;
      
      console.log('应用初始化成功');
      
      // 执行初始化后的操作
      this.postInitialize();
      
    } catch (error) {
      console.error('应用组件初始化失败:', error);
      this.handleInitializationError(error);
    }
  }

  // 检查依赖项
  checkDependencies() {
    console.log('检查依赖项');
    
    const requiredClasses = [
      'ErrorHandler',
      'AnimationManager', 
      'StateManager',
      'StateActions',
      'StateSelectors',
      'UIManager',
      'NavigationManager'
    ];
    
    const missingClasses = [];
    
    requiredClasses.forEach(className => {
      if (!window[className]) {
        missingClasses.push(className);
      }
    });
    
    if (missingClasses.length > 0) {
      throw new Error(`缺少必要的类: ${missingClasses.join(', ')}`);
    }
    
    // 检查DEMO_DATA
    if (!window.DEMO_DATA) {
      throw new Error('DEMO_DATA 未加载');
    }
    
    console.log('所有依赖项检查通过');
  }

  // 设置全局引用
  setupGlobalReferences() {
    window.app = this;
    window.stateManager = this.stateManager;
    window.stateActions = this.stateActions;
    window.stateSelectors = this.stateSelectors;
    window.uiManager = this.uiManager;
    window.navigationManager = this.navigationManager;
    window.animationManager = this.animationManager;
    window.errorHandler = this.errorHandler;
    
    if (this.coursewareManager) {
      window.coursewareManager = this.coursewareManager;
    }
  }

  // 处理初始化错误
  handleInitializationError(error) {
    console.error('处理初始化错误:', error);
    
    // 如果错误处理器已初始化，使用它
    if (this.errorHandler) {
      this.errorHandler.showError(
        '应用初始化失败',
        '应用无法正常启动，请刷新页面重试',
        {
          type: 'global',
          canRetry: true,
          onRetry: () => window.location.reload(),
          details: error
        }
      );
    } else {
      // 回退到基本错误显示
      this.showInitError(error);
    }
  }

  // 设置组件间的状态通信
  setupStateIntegration() {
    if (!this.stateManager) return;
    
    // 监听状态变化并同步到UI
    this.stateManager.subscribe('ui-sync', (state, previousState, updates) => {
      this.syncStateToUI(state, updates);
    });
    
    // 监听表单数据变化
    this.stateManager.subscribe('form-data', (state) => {
      if (this.uiManager && state.courseInfo) {
        this.uiManager.setFormData(state.courseInfo);
      }
    }, { 
      filter: (updates) => 'courseInfo' in updates 
    });
    
    // 监听生成选项变化
    this.stateManager.subscribe('generation-options', (state) => {
      if (this.uiManager && state.generationOptions) {
        this.uiManager.setGenerationOptions(state.generationOptions);
      }
    }, { 
      filter: (updates) => 'generationOptions' in updates 
    });
    
    // 监听section切换
    this.stateManager.subscribe('section-change', (state, previousState) => {
      if (state.currentSection !== previousState.currentSection) {
        this.handleSectionChange(state.currentSection, previousState.currentSection);
      }
    });
    
    // 监听进度更新
    this.stateManager.subscribe('progress-update', (state) => {
      if (this.uiManager && state.generationProgress) {
        this.uiManager.updateProgress(state.generationProgress);
      }
    }, { 
      filter: (updates) => 'generationProgress' in updates 
    });
    
    // 监听内容更新
    this.stateManager.subscribe('content-update', (state) => {
      if (this.uiManager && state.courseContent) {
        this.uiManager.displayContent(state.courseContent);
      }
    }, { 
      filter: (updates) => 'courseContent' in updates 
    });
    
    // 监听错误状态
    this.stateManager.subscribe('error-handling', (state) => {
      if (this.uiManager && state.error) {
        this.uiManager.showError(state.error.title, state.error.message);
      }
    }, { 
      filter: (updates) => 'error' in updates && updates.error !== null 
    });
  }

  // 同步状态到UI
  syncStateToUI(state, updates) {
    if (!this.uiManager) return;
    
    // 同步UI状态
    if ('uiState' in updates) {
      const uiState = state.uiState;
      
      // 同步活动标签
      if (uiState.activeTab) {
        this.uiManager.switchTab(uiState.activeTab);
      }
      
      // 同步选项面板状态
      if (typeof uiState.optionsExpanded === 'boolean') {
        this.uiManager.toggleOptions(uiState.optionsExpanded);
      }
      
      // 同步导出面板状态
      if (typeof uiState.exportPanelVisible === 'boolean') {
        this.uiManager.toggleExportPanel(uiState.exportPanelVisible);
      }
    }
  }

  // 处理section切换
  handleSectionChange(newSection, previousSection) {
    if (this.uiManager) {
      this.uiManager.switchSection(newSection);
    }
    
    // 更新导航指示器
    this.updateNavigationIndicator(newSection);
    
    // 记录用户行为
    console.log(`页面切换: ${previousSection} -> ${newSection}`);
  }

  // 更新导航指示器
  updateNavigationIndicator(currentSection) {
    const indicator = document.querySelector('.nav-indicator');
    if (!indicator) return;
    
    const sectionIndex = {
      'course-input-section': 0,
      'generation-section': 1,
      'content-display-section': 2
    };
    
    const index = sectionIndex[currentSection] || 0;
    indicator.style.transform = `translateX(${index * 100}%)`;
  }

  postInitialize() {
    console.log('执行初始化后操作');
    
    // 从状态管理器恢复状态
    this.restoreStateFromManager();
    
    // 检查URL参数，看是否需要自动填充表单
    this.checkUrlParams();
    
    // 设置键盘快捷键
    this.setupKeyboardShortcuts();
  }

  // 从状态管理器恢复状态
  restoreStateFromManager() {
    if (!this.stateManager) return;
    
    const state = this.stateManager.getState();
    
    // 恢复当前section
    if (state.currentSection) {
      this.handleSectionChange(state.currentSection, 'course-input-section');
    }
    
    // 恢复表单数据
    if (state.courseInfo && this.uiManager) {
      this.uiManager.setFormData(state.courseInfo);
    }
    
    // 恢复生成选项
    if (state.generationOptions && this.uiManager) {
      this.uiManager.setGenerationOptions(state.generationOptions);
    }
    
    // 恢复UI状态
    if (state.uiState) {
      this.syncStateToUI(state, { uiState: state.uiState });
    }
  }

  // 检查URL参数
  checkUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const formData = {};
    
    // 支持的URL参数
    const supportedParams = ['subject', 'grade', 'volume', 'title', 'difficulty', 'language'];
    
    supportedParams.forEach(param => {
      const value = urlParams.get(param);
      if (value) {
        formData[param] = decodeURIComponent(value);
      }
    });
    
    // 如果有URL参数，更新状态管理器
    if (Object.keys(formData).length > 0 && this.stateManager) {
      this.stateManager.setState({
        courseInfo: { ...this.stateManager.getState('courseInfo'), ...formData }
      });
      console.log('从URL参数自动填充表单:', formData);
    }
  }

  // 设置键盘快捷键
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
      // Ctrl/Cmd + Enter: 提交表单
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        const generateBtn = document.getElementById('generate-btn');
        if (generateBtn && !generateBtn.disabled) {
          generateBtn.click();
        }
      }
      
      // Escape: 关闭错误提示或加载遮罩
      if (event.key === 'Escape') {
        const errorDisplay = document.getElementById('error-display');
        const loadingOverlay = document.getElementById('loading-overlay');
        
        if (errorDisplay && errorDisplay.classList.contains('show')) {
          if (this.uiManager) {
            this.uiManager.hideError();
          }
        } else if (loadingOverlay && loadingOverlay.classList.contains('show')) {
          if (this.uiManager) {
            this.uiManager.hideLoading();
          }
        }
      }
      
      // F5: 刷新但保存表单数据
      if (event.key === 'F5') {
        this.saveUserData();
      }
    });
  }

  // 保存用户数据
  saveUserData() {
    if (this.stateManager) {
      this.stateManager.persistState();
    }
  }

  // 显示初始化错误
  showInitError(error) {
    console.error('显示初始化错误:', error);
    
    const errorHtml = `
      <div class="init-error" style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        text-align: center;
        z-index: 9999;
        max-width: 500px;
      ">
        <h3 style="color: #ef4444; margin-bottom: 1rem;">应用初始化失败</h3>
        <p style="margin-bottom: 1rem; color: #64748b;">
          抱歉，应用无法正常启动。
        </p>
        <details style="margin-bottom: 1.5rem; text-align: left;">
          <summary style="cursor: pointer; color: #2563eb;">查看错误详情</summary>
          <pre style="background: #f8f9fa; padding: 1rem; border-radius: 4px; margin-top: 0.5rem; font-size: 12px; overflow: auto;">
${error ? error.stack || error.message || error : '未知错误'}
          </pre>
        </details>
        <button onclick="window.location.reload()" style="
          background: #2563eb;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
          margin-right: 0.5rem;
        ">
          刷新页面
        </button>
        <button onclick="this.parentElement.remove()" style="
          background: #6b7280;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
        ">
          关闭
        </button>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', errorHtml);
  }

  // 获取应用状态
  getAppState() {
    if (this.stateManager) {
      return {
        ...this.stateManager.getState(),
        isInitialized: this.isInitialized,
        hasErrors: Object.keys(this.uiManager?.validationErrors || {}).length > 0
      };
    }
    
    return {
      isInitialized: this.isInitialized,
      currentSection: this.uiManager?.currentSection,
      formData: this.uiManager?.getFormData(),
      hasErrors: Object.keys(this.uiManager?.validationErrors || {}).length > 0
    };
  }

  // 重置应用
  resetApp() {
    try {
      // 清除本地存储
      localStorage.removeItem('courseware-form-data');
      
      // 重置UI
      if (this.uiManager) {
        this.uiManager.resetForm();
        this.uiManager.switchSection('course-input-section');
      }
      
      // 清除URL参数
      if (window.history && window.history.replaceState) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
      
      console.log('应用已重置');
      
    } catch (error) {
      console.error('重置应用失败:', error);
    }
  }
}

// 页面卸载前保存数据
window.addEventListener('beforeunload', () => {
  if (window.app && window.app.saveUserData) {
    window.app.saveUserData();
  }
});

// 处理页面可见性变化
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // 页面隐藏时保存数据
    if (window.app && window.app.saveUserData) {
      window.app.saveUserData();
    }
  }
});

// 启动应用
console.log('准备启动应用');
const app = new App();