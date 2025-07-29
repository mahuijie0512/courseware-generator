// 主应用程序入口
class App {
  constructor() {
    this.stateManager = null;
    this.uiManager = null;
    this.coursewareManager = null;
    this.isInitialized = false;
    
    this.init();
  }

  async init() {
    try {
      // 等待DOM加载完成
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.initializeApp());
      } else {
        this.initializeApp();
      }
    } catch (error) {
      console.error('应用初始化失败:', error);
      this.showInitError();
    }
  }

  initializeApp() {
    try {
      // 初始化错误处理系统
      this.errorHandler = new ErrorHandler();
      
      // 初始化动画管理器
      this.animationManager = new AnimationManager();
      
      // 初始化状态管理器
      this.stateManager = new StateManager();
      
      // 初始化状态动作创建器和选择器
      this.stateActions = new StateActions(this.stateManager);
      this.stateSelectors = new StateSelectors(this.stateManager);
      
      // 初始化UI管理器
      this.uiManager = new UIManager();
      
      // 连接UI管理器与状态管理器和动画管理器
      this.uiManager.setStateManager(this.stateActions, this.stateSelectors);
      this.uiManager.setAnimationManager(this.animationManager);
      this.uiManager.setErrorHandler(this.errorHandler);
      
      // 初始化导航管理器
      this.navigationManager = new NavigationManager();
      this.navigationManager.setStateManager(this.stateActions, this.stateSelectors);
      this.navigationManager.setAnimationManager(this.animationManager);
      this.navigationManager.setErrorHandler(this.errorHandler);
      
      // 初始化课件管理器（稍后实现）
      // this.coursewareManager = new CoursewareManager();
      
      // 设置组件间的状态通信
      this.setupStateIntegration();
      
      // 设置全局引用
      window.app = this;
      window.stateManager = this.stateManager;
      window.stateActions = this.stateActions;
      window.stateSelectors = this.stateSelectors;
      window.uiManager = this.uiManager;
      window.navigationManager = this.navigationManager;
      window.animationManager = this.animationManager;
      window.errorHandler = this.errorHandler;
      // window.coursewareManager = this.coursewareManager;
      
      this.isInitialized = true;
      
      console.log('应用初始化成功');
      
      // 执行初始化后的操作
      this.postInitialize();
      
    } catch (error) {
      console.error('应用组件初始化失败:', error);
      this.handleInitializationError(error);
    }
  }

  // 处理初始化错误
  handleInitializationError(error) {
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
      this.showInitError();
    }
  }

  // 设置组件间的状态通信
  setupStateIntegration() {
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
    // 从状态管理器恢复状态
    this.restoreStateFromManager();
    
    // 检查URL参数，看是否需要自动填充表单
    this.checkUrlParams();
    
    // 设置键盘快捷键
    this.setupKeyboardShortcuts();
    
    // 设置性能监控
    this.setupPerformanceMonitoring();
  }

  // 从状态管理器恢复状态
  restoreStateFromManager() {
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
    if (Object.keys(formData).length > 0) {
      this.stateManager.setState({
        courseInfo: { ...this.stateManager.getState('courseInfo'), ...formData }
      });
      console.log('从URL参数自动填充表单:', formData);
    }
  }

  // 恢复用户数据 (已由状态管理器处理)
  restoreUserData() {
    // 此方法已被状态管理器的持久化功能替代
    // 状态管理器会自动处理数据的保存和恢复
    console.log('用户数据恢复由状态管理器处理');
  }

  // 保存用户数据 (已由状态管理器处理)
  saveUserData() {
    // 此方法已被状态管理器的持久化功能替代
    // 状态管理器会自动处理数据的保存
    if (this.stateManager) {
      this.stateManager.persistState();
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
          this.uiManager.hideError();
        } else if (loadingOverlay && loadingOverlay.classList.contains('show')) {
          this.uiManager.hideLoading();
        }
      }
      
      // F5: 刷新但保存表单数据
      if (event.key === 'F5') {
        this.saveUserData();
      }
    });
  }

  // 设置性能监控
  setupPerformanceMonitoring() {
    // 监控页面加载性能
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = performance.getEntriesByType('navigation')[0];
          if (perfData) {
            console.log('页面加载性能:', {
              domContentLoaded: Math.round(perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart),
              loadComplete: Math.round(perfData.loadEventEnd - perfData.loadEventStart),
              totalTime: Math.round(perfData.loadEventEnd - perfData.fetchStart)
            });
          }
        }, 0);
      });
    }

    // 监控内存使用（如果支持）
    if ('memory' in performance) {
      setInterval(() => {
        const memory = performance.memory;
        if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
          console.warn('内存使用率过高:', {
            used: Math.round(memory.usedJSHeapSize / 1024 / 1024),
            total: Math.round(memory.totalJSHeapSize / 1024 / 1024),
            limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024)
          });
        }
      }, 30000); // 每30秒检查一次
    }
  }

  // 显示初始化错误
  showInitError() {
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
      ">
        <h3 style="color: #ef4444; margin-bottom: 1rem;">应用初始化失败</h3>
        <p style="margin-bottom: 1.5rem; color: #64748b;">
          抱歉，应用无法正常启动。请刷新页面重试。
        </p>
        <button onclick="window.location.reload()" style="
          background: #2563eb;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          cursor: pointer;
        ">
          刷新页面
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

  // 导出应用数据
  exportAppData() {
    const appData = {
      formData: this.uiManager?.getFormData(),
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };
    
    const dataStr = JSON.stringify(appData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `courseware-data-${Date.now()}.json`;
    link.click();
    
    URL.revokeObjectURL(link.href);
  }

  // 导入应用数据
  importAppData(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const appData = JSON.parse(event.target.result);
          
          if (appData.formData) {
            this.uiManager.setFormData(appData.formData);
            resolve(appData);
          } else {
            reject(new Error('无效的数据格式'));
          }
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('文件读取失败'));
      reader.readAsText(file);
    });
  }

  // 导出课件功能
  async exportCourseware(format, content, options = {}) {
    try {
      // 显示导出进度
      this.uiManager.showExportProgress();
      
      // 调用模拟API
      const result = await MockAPI.exportCourseware(format, content, options);
      
      // 隐藏导出进度
      this.uiManager.hideExportProgress();
      
      // 显示成功消息
      this.uiManager.showSuccess('导出成功！', `文件已生成：${result.filename}`);
      
      // 模拟下载
      this.simulateDownload(result.downloadUrl, result.filename);
      
      return result;
      
    } catch (error) {
      this.uiManager.hideExportProgress();
      this.uiManager.showError('导出失败', error.message);
      throw error;
    }
  }

  // 分享课件功能
  async shareCourseware(content, shareOptions = {}) {
    try {
      // 调用模拟API
      const result = await MockAPI.shareContent(content, shareOptions);
      
      // 显示分享结果
      this.uiManager.showShareResult(result);
      
      return result;
      
    } catch (error) {
      this.uiManager.showError('分享失败', error.message);
      throw error;
    }
  }

  // 模拟文件下载
  simulateDownload(url, filename) {
    // 创建虚拟下载链接
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log(`模拟下载文件: ${filename}`);
  }

  // 复制分享链接到剪贴板
  async copyShareLink(shareUrl) {
    try {
      await Utils.copyToClipboard(shareUrl);
      this.uiManager.showSuccess('复制成功', '分享链接已复制到剪贴板');
      return true;
    } catch (error) {
      this.uiManager.showError('复制失败', '无法复制到剪贴板，请手动复制');
      return false;
    }
  }

  // 预览导出内容
  previewExport(format, content) {
    // 创建预览窗口
    const previewWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes');
    
    if (!previewWindow) {
      this.uiManager.showError('预览失败', '请允许弹出窗口以查看预览');
      return;
    }
    
    // 根据格式生成预览内容
    let previewContent = '';
    
    switch (format) {
      case 'html':
        previewContent = this.generateHtmlPreview(content);
        break;
      case 'pdf':
        previewContent = this.generatePdfPreview(content);
        break;
      case 'pptx':
        previewContent = this.generatePptxPreview(content);
        break;
      case 'docx':
        previewContent = this.generateDocxPreview(content);
        break;
      case 'json':
        previewContent = this.generateJsonPreview(content);
        break;
      default:
        previewContent = this.generateDefaultPreview(content);
    }
    
    previewWindow.document.write(previewContent);
    previewWindow.document.close();
  }

  // 生成HTML预览
  generateHtmlPreview(content) {
    return `
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${content.overview?.title || '课件预览'}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; margin: 2rem; }
          .header { border-bottom: 2px solid #2563eb; padding-bottom: 1rem; margin-bottom: 2rem; }
          .title { color: #2563eb; margin: 0; }
          .section { margin-bottom: 2rem; }
          .section h2 { color: #1f2937; border-left: 4px solid #2563eb; padding-left: 1rem; }
          .concept-card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; }
          .formula { background: #f3f4f6; padding: 1rem; border-radius: 4px; text-align: center; font-family: monospace; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 class="title">${content.overview?.title || '课件内容'}</h1>
          <p>${content.overview?.description || ''}</p>
        </div>
        
        <div class="section">
          <h2>学习目标</h2>
          <ul>
            ${(content.overview?.objectives || []).map(obj => `<li>${obj}</li>`).join('')}
          </ul>
        </div>
        
        <div class="section">
          <h2>重点概念</h2>
          ${(content.concepts || []).map(concept => `
            <div class="concept-card">
              <h3>${concept.name}</h3>
              <p>${concept.description}</p>
              <p><strong>详细说明：</strong>${concept.details}</p>
            </div>
          `).join('')}
        </div>
        
        <div class="section">
          <h2>重要公式</h2>
          ${(content.formulas || []).map(formula => `
            <div class="formula">
              <h4>${formula.name}</h4>
              <p><code>${formula.formula}</code></p>
              <p>${formula.description}</p>
            </div>
          `).join('')}
        </div>
      </body>
      </html>
    `;
  }

  // 生成PDF预览
  generatePdfPreview(content) {
    return `
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <title>PDF预览 - ${content.overview?.title || '课件'}</title>
        <style>
          body { font-family: serif; margin: 2rem; background: #f5f5f5; }
          .pdf-preview { background: white; padding: 2rem; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
          .page-header { text-align: center; border-bottom: 1px solid #ccc; padding-bottom: 1rem; }
          .content { margin-top: 2rem; }
          .page-number { text-align: center; margin-top: 2rem; color: #666; }
        </style>
      </head>
      <body>
        <div class="pdf-preview">
          <div class="page-header">
            <h1>${content.overview?.title || '课件内容'}</h1>
            <p>PDF格式预览</p>
          </div>
          <div class="content">
            <p>这是PDF格式的预览。实际导出的PDF文件将包含完整的课件内容，包括格式化的文本、图表和布局。</p>
            <h2>内容概要</h2>
            <ul>
              <li>课程概述和学习目标</li>
              <li>重点概念详解</li>
              <li>公式和定理</li>
              <li>示意图和图表</li>
              <li>练习和资源链接</li>
            </ul>
          </div>
          <div class="page-number">第 1 页</div>
        </div>
      </body>
      </html>
    `;
  }

  // 生成PowerPoint预览
  generatePptxPreview(content) {
    return `
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <title>PowerPoint预览 - ${content.overview?.title || '课件'}</title>
        <style>
          body { font-family: sans-serif; margin: 0; background: #f0f0f0; }
          .slide-container { display: flex; flex-direction: column; align-items: center; padding: 2rem; }
          .slide { width: 800px; height: 600px; background: white; border: 1px solid #ccc; margin-bottom: 2rem; padding: 2rem; box-sizing: border-box; }
          .slide-title { color: #2563eb; font-size: 2rem; text-align: center; margin-bottom: 2rem; }
          .slide-content { font-size: 1.2rem; line-height: 1.8; }
          .slide-number { text-align: center; color: #666; margin-top: 1rem; }
        </style>
      </head>
      <body>
        <div class="slide-container">
          <div class="slide">
            <h1 class="slide-title">${content.overview?.title || '课件标题'}</h1>
            <div class="slide-content">
              <p>PowerPoint格式预览</p>
              <p>实际的PPT文件将包含多个幻灯片，每个幻灯片都经过精心设计，适合课堂演示。</p>
            </div>
            <div class="slide-number">幻灯片 1</div>
          </div>
          
          <div class="slide">
            <h2 class="slide-title">学习目标</h2>
            <div class="slide-content">
              <ul>
                ${(content.overview?.objectives || []).map(obj => `<li>${obj}</li>`).join('')}
              </ul>
            </div>
            <div class="slide-number">幻灯片 2</div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // 生成Word预览
  generateDocxPreview(content) {
    return `
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <title>Word预览 - ${content.overview?.title || '课件'}</title>
        <style>
          body { font-family: 'Times New Roman', serif; margin: 0; background: #f5f5f5; }
          .doc-container { max-width: 800px; margin: 2rem auto; background: white; padding: 3rem; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
          .doc-title { text-align: center; font-size: 2rem; margin-bottom: 2rem; }
          .doc-content { line-height: 2; }
          .doc-header { border-bottom: 1px solid #ccc; padding-bottom: 1rem; margin-bottom: 2rem; }
        </style>
      </head>
      <body>
        <div class="doc-container">
          <div class="doc-header">
            <h1 class="doc-title">${content.overview?.title || '课件文档'}</h1>
            <p style="text-align: center;">Word文档格式预览</p>
          </div>
          <div class="doc-content">
            <p>这是Word文档格式的预览。实际导出的Word文件将包含完整的课件内容，便于编辑和修改。</p>
            <h2>文档结构</h2>
            <ol>
              <li>课程概述</li>
              <li>学习目标</li>
              <li>重点概念</li>
              <li>公式和定理</li>
              <li>示例和练习</li>
              <li>参考资源</li>
            </ol>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // 生成JSON预览
  generateJsonPreview(content) {
    const jsonContent = JSON.stringify(content, null, 2);
    return `
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <title>JSON预览 - ${content.overview?.title || '课件'}</title>
        <style>
          body { font-family: monospace; margin: 2rem; background: #1e1e1e; color: #d4d4d4; }
          .json-container { background: #2d2d2d; padding: 2rem; border-radius: 8px; overflow: auto; }
          .json-key { color: #9cdcfe; }
          .json-string { color: #ce9178; }
          .json-number { color: #b5cea8; }
          .json-boolean { color: #569cd6; }
        </style>
      </head>
      <body>
        <h1>JSON数据格式预览</h1>
        <p>这是课件数据的JSON格式，适合系统集成和数据交换。</p>
        <div class="json-container">
          <pre>${this.syntaxHighlightJson(jsonContent)}</pre>
        </div>
      </body>
      </html>
    `;
  }

  // JSON语法高亮
  syntaxHighlightJson(json) {
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      let cls = 'json-number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'json-key';
        } else {
          cls = 'json-string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'json-boolean';
      } else if (/null/.test(match)) {
        cls = 'json-null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    });
  }

  // 生成默认预览
  generateDefaultPreview(content) {
    return `
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <title>预览 - ${content.overview?.title || '课件'}</title>
        <style>
          body { font-family: sans-serif; margin: 2rem; }
          .preview-header { text-align: center; margin-bottom: 2rem; }
        </style>
      </head>
      <body>
        <div class="preview-header">
          <h1>${content.overview?.title || '课件预览'}</h1>
          <p>通用格式预览</p>
        </div>
        <div class="preview-content">
          <p>这是课件内容的通用预览。选择具体的导出格式以获得更详细的预览。</p>
        </div>
      </body>
      </html>
    `;
  }
}

// 页面卸载前保存数据
window.addEventListener('beforeunload', () => {
  if (window.app && window.app.uiManager) {
    window.app.saveUserData();
  }
});

// 处理页面可见性变化
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // 页面隐藏时保存数据
    if (window.app && window.app.uiManager) {
      window.app.saveUserData();
    }
  }
});

// 启动应用
const app = new App();