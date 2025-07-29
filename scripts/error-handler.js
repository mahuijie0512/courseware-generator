// 全局错误处理和用户提示系统
class ErrorHandler {
  constructor() {
    this.errorQueue = [];
    this.isProcessing = false;
    this.maxRetries = 3;
    this.retryDelay = 1000;
    this.errorHistory = [];
    this.maxHistorySize = 50;
    
    this.init();
  }

  init() {
    // 设置全局错误监听
    this.setupGlobalErrorHandling();
    
    // 初始化错误显示元素
    this.initializeErrorElements();
    
    // 设置键盘快捷键
    this.setupKeyboardShortcuts();
    
    console.log('错误处理系统初始化完成');
  }

  // 设置全局错误处理
  setupGlobalErrorHandling() {
    // 捕获未处理的JavaScript错误
    window.addEventListener('error', (event) => {
      this.handleGlobalError({
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
        timestamp: new Date().toISOString()
      });
    });

    // 捕获未处理的Promise拒绝
    window.addEventListener('unhandledrejection', (event) => {
      this.handleGlobalError({
        type: 'promise',
        message: event.reason?.message || '未处理的Promise拒绝',
        reason: event.reason,
        timestamp: new Date().toISOString()
      });
    });

    // 捕获资源加载错误
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.handleResourceError({
          type: 'resource',
          element: event.target.tagName,
          source: event.target.src || event.target.href,
          message: '资源加载失败',
          timestamp: new Date().toISOString()
        });
      }
    }, true);

    // 网络连接状态监听
    window.addEventListener('online', () => {
      this.showSuccess('网络连接已恢复', '您现在可以继续使用应用');
    });

    window.addEventListener('offline', () => {
      this.showWarning('网络连接中断', '请检查您的网络连接');
    });
  }

  // 初始化错误显示元素
  initializeErrorElements() {
    // 确保错误显示元素存在
    if (!document.getElementById('error-display')) {
      this.createErrorDisplay();
    }

    // 创建通知容器
    if (!document.getElementById('notification-container')) {
      this.createNotificationContainer();
    }

    // 创建确认对话框
    if (!document.getElementById('confirm-dialog')) {
      this.createConfirmDialog();
    }
  }

  // 创建错误显示组件
  createErrorDisplay() {
    const errorDisplay = document.createElement('div');
    errorDisplay.id = 'error-display';
    errorDisplay.className = 'error-message';
    errorDisplay.innerHTML = `
      <div class="error-content">
        <div class="error-icon">⚠️</div>
        <div class="error-text">
          <h4 class="error-title">操作失败</h4>
          <p class="error-description"></p>
          <div class="error-details" style="display: none;">
            <button class="details-toggle">显示详细信息</button>
            <div class="error-stack"></div>
          </div>
        </div>
        <div class="error-actions">
          <button class="retry-btn">重试</button>
          <button class="dismiss-btn">关闭</button>
        </div>
      </div>
    `;
    document.body.appendChild(errorDisplay);

    // 绑定事件
    this.bindErrorDisplayEvents(errorDisplay);
  }

  // 创建通知容器
  createNotificationContainer() {
    const container = document.createElement('div');
    container.id = 'notification-container';
    container.className = 'notification-container';
    document.body.appendChild(container);
  }

  // 创建确认对话框
  createConfirmDialog() {
    const dialog = document.createElement('div');
    dialog.id = 'confirm-dialog';
    dialog.className = 'confirm-dialog';
    dialog.innerHTML = `
      <div class="confirm-overlay"></div>
      <div class="confirm-content">
        <div class="confirm-header">
          <h3 class="confirm-title">确认操作</h3>
        </div>
        <div class="confirm-body">
          <p class="confirm-message"></p>
        </div>
        <div class="confirm-actions">
          <button class="confirm-cancel">取消</button>
          <button class="confirm-ok">确认</button>
        </div>
      </div>
    `;
    document.body.appendChild(dialog);

    // 绑定事件
    this.bindConfirmDialogEvents(dialog);
  }

  // 绑定错误显示事件
  bindErrorDisplayEvents(errorDisplay) {
    const retryBtn = errorDisplay.querySelector('.retry-btn');
    const dismissBtn = errorDisplay.querySelector('.dismiss-btn');
    const detailsToggle = errorDisplay.querySelector('.details-toggle');

    if (retryBtn) {
      retryBtn.addEventListener('click', () => this.handleRetry());
    }

    if (dismissBtn) {
      dismissBtn.addEventListener('click', () => this.hideError());
    }

    if (detailsToggle) {
      detailsToggle.addEventListener('click', () => this.toggleErrorDetails());
    }

    // 点击遮罩关闭
    errorDisplay.addEventListener('click', (event) => {
      if (event.target === errorDisplay) {
        this.hideError();
      }
    });
  }

  // 绑定确认对话框事件
  bindConfirmDialogEvents(dialog) {
    const cancelBtn = dialog.querySelector('.confirm-cancel');
    const okBtn = dialog.querySelector('.confirm-ok');
    const overlay = dialog.querySelector('.confirm-overlay');

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => this.hideConfirm(false));
    }

    if (okBtn) {
      okBtn.addEventListener('click', () => this.hideConfirm(true));
    }

    if (overlay) {
      overlay.addEventListener('click', () => this.hideConfirm(false));
    }
  }

  // 设置键盘快捷键
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
      // ESC键关闭错误提示
      if (event.key === 'Escape') {
        const errorDisplay = document.getElementById('error-display');
        const confirmDialog = document.getElementById('confirm-dialog');
        
        if (errorDisplay && errorDisplay.classList.contains('show')) {
          this.hideError();
          event.preventDefault();
        } else if (confirmDialog && confirmDialog.classList.contains('show')) {
          this.hideConfirm(false);
          event.preventDefault();
        }
      }

      // Enter键确认对话框
      if (event.key === 'Enter') {
        const confirmDialog = document.getElementById('confirm-dialog');
        if (confirmDialog && confirmDialog.classList.contains('show')) {
          this.hideConfirm(true);
          event.preventDefault();
        }
      }
    });
  }

  // 处理全局JavaScript错误
  handleGlobalError(errorInfo) {
    console.error('全局错误:', errorInfo);
    
    // 记录错误历史
    this.addToErrorHistory(errorInfo);

    // 根据错误类型决定处理方式
    if (this.shouldShowGlobalError(errorInfo)) {
      this.showError(
        '应用出现异常',
        this.formatErrorMessage(errorInfo),
        {
          type: 'global',
          canRetry: false,
          details: errorInfo
        }
      );
    }
  }

  // 处理资源加载错误
  handleResourceError(errorInfo) {
    console.warn('资源加载错误:', errorInfo);
    
    this.addToErrorHistory(errorInfo);

    // 尝试重新加载资源
    if (this.shouldRetryResource(errorInfo)) {
      this.retryResourceLoad(errorInfo);
    } else {
      this.showWarning(
        '资源加载失败',
        `无法加载 ${errorInfo.element}: ${errorInfo.source}`
      );
    }
  }

  // 显示错误提示
  showError(title, message, options = {}) {
    const {
      type = 'error',
      canRetry = true,
      autoHide = false,
      hideDelay = 5000,
      details = null,
      onRetry = null
    } = options;

    const errorDisplay = document.getElementById('error-display');
    if (!errorDisplay) return;

    // 更新错误内容
    const errorTitle = errorDisplay.querySelector('.error-title');
    const errorDescription = errorDisplay.querySelector('.error-description');
    const errorIcon = errorDisplay.querySelector('.error-icon');
    const retryBtn = errorDisplay.querySelector('.retry-btn');
    const errorDetails = errorDisplay.querySelector('.error-details');
    const errorStack = errorDisplay.querySelector('.error-stack');

    if (errorTitle) errorTitle.textContent = title;
    if (errorDescription) errorDescription.textContent = message;
    
    // 设置图标
    if (errorIcon) {
      const icons = {
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️',
        global: '🚨'
      };
      errorIcon.textContent = icons[type] || '❌';
    }

    // 设置重试按钮
    if (retryBtn) {
      retryBtn.style.display = canRetry ? 'block' : 'none';
      this.currentRetryHandler = onRetry;
    }

    // 设置错误详情
    if (details && errorDetails && errorStack) {
      errorDetails.style.display = 'block';
      errorStack.textContent = this.formatErrorDetails(details);
    } else if (errorDetails) {
      errorDetails.style.display = 'none';
    }

    // 显示错误
    errorDisplay.classList.remove('success', 'warning', 'info');
    errorDisplay.classList.add('show', type);

    // 自动隐藏
    if (autoHide) {
      setTimeout(() => this.hideError(), hideDelay);
    }

    // 记录错误显示
    this.addToErrorHistory({
      type: 'display',
      title,
      message,
      timestamp: new Date().toISOString()
    });
  }

  // 显示成功提示
  showSuccess(title, message, options = {}) {
    const { autoHide = true, hideDelay = 3000 } = options;
    
    this.showNotification({
      type: 'success',
      title,
      message,
      icon: '✅',
      autoHide,
      hideDelay
    });
  }

  // 显示警告提示
  showWarning(title, message, options = {}) {
    const { autoHide = true, hideDelay = 4000 } = options;
    
    this.showNotification({
      type: 'warning',
      title,
      message,
      icon: '⚠️',
      autoHide,
      hideDelay
    });
  }

  // 显示信息提示
  showInfo(title, message, options = {}) {
    const { autoHide = true, hideDelay = 3000 } = options;
    
    this.showNotification({
      type: 'info',
      title,
      message,
      icon: 'ℹ️',
      autoHide,
      hideDelay
    });
  }

  // 显示通知
  showNotification(options) {
    const {
      type = 'info',
      title,
      message,
      icon = 'ℹ️',
      autoHide = true,
      hideDelay = 3000,
      actions = []
    } = options;

    const container = document.getElementById('notification-container');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const actionsHtml = actions.map(action => 
      `<button class="notification-action" data-action="${action.key}">${action.label}</button>`
    ).join('');

    notification.innerHTML = `
      <div class="notification-content">
        <div class="notification-icon">${icon}</div>
        <div class="notification-text">
          <div class="notification-title">${title}</div>
          <div class="notification-message">${message}</div>
        </div>
        <div class="notification-actions">
          ${actionsHtml}
          <button class="notification-close">×</button>
        </div>
      </div>
    `;

    // 绑定事件
    const closeBtn = notification.querySelector('.notification-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.hideNotification(notification));
    }

    // 绑定动作按钮事件
    const actionBtns = notification.querySelectorAll('.notification-action');
    actionBtns.forEach(btn => {
      btn.addEventListener('click', (event) => {
        const actionKey = event.target.dataset.action;
        const action = actions.find(a => a.key === actionKey);
        if (action && action.handler) {
          action.handler();
        }
        this.hideNotification(notification);
      });
    });

    // 添加到容器
    container.appendChild(notification);

    // 触发进入动画
    requestAnimationFrame(() => {
      notification.classList.add('show');
    });

    // 自动隐藏
    if (autoHide) {
      setTimeout(() => this.hideNotification(notification), hideDelay);
    }

    return notification;
  }

  // 隐藏通知
  hideNotification(notification) {
    if (!notification) return;

    notification.classList.remove('show');
    notification.classList.add('hide');

    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }

  // 显示确认对话框
  showConfirm(title, message, options = {}) {
    const {
      confirmText = '确认',
      cancelText = '取消',
      type = 'confirm'
    } = options;

    return new Promise((resolve) => {
      const dialog = document.getElementById('confirm-dialog');
      if (!dialog) {
        resolve(false);
        return;
      }

      const titleElement = dialog.querySelector('.confirm-title');
      const messageElement = dialog.querySelector('.confirm-message');
      const confirmBtn = dialog.querySelector('.confirm-ok');
      const cancelBtn = dialog.querySelector('.confirm-cancel');

      if (titleElement) titleElement.textContent = title;
      if (messageElement) messageElement.textContent = message;
      if (confirmBtn) confirmBtn.textContent = confirmText;
      if (cancelBtn) cancelBtn.textContent = cancelText;

      // 设置样式
      dialog.classList.remove('danger', 'warning');
      if (type === 'danger') {
        dialog.classList.add('danger');
      } else if (type === 'warning') {
        dialog.classList.add('warning');
      }

      // 显示对话框
      dialog.classList.add('show');

      // 保存resolve函数
      this.currentConfirmResolve = resolve;

      // 聚焦到确认按钮
      if (confirmBtn) {
        setTimeout(() => confirmBtn.focus(), 100);
      }
    });
  }

  // 隐藏确认对话框
  hideConfirm(result) {
    const dialog = document.getElementById('confirm-dialog');
    if (!dialog) return;

    dialog.classList.remove('show');

    if (this.currentConfirmResolve) {
      this.currentConfirmResolve(result);
      this.currentConfirmResolve = null;
    }
  }

  // 隐藏错误提示
  hideError() {
    const errorDisplay = document.getElementById('error-display');
    if (!errorDisplay) return;

    errorDisplay.classList.remove('show');
    this.currentRetryHandler = null;
  }

  // 切换错误详情显示
  toggleErrorDetails() {
    const errorDetails = document.querySelector('.error-details');
    const detailsToggle = document.querySelector('.details-toggle');
    const errorStack = document.querySelector('.error-stack');

    if (!errorDetails || !detailsToggle || !errorStack) return;

    const isVisible = errorStack.style.display !== 'none';
    
    if (isVisible) {
      errorStack.style.display = 'none';
      detailsToggle.textContent = '显示详细信息';
    } else {
      errorStack.style.display = 'block';
      detailsToggle.textContent = '隐藏详细信息';
    }
  }

  // 处理重试
  handleRetry() {
    if (this.currentRetryHandler) {
      this.hideError();
      this.currentRetryHandler();
    } else {
      // 默认重试逻辑
      this.hideError();
      
      // 根据当前状态决定重试操作
      if (window.app && window.app.uiManager) {
        const currentSection = window.app.uiManager.currentSection;
        
        switch (currentSection) {
          case 'generation-section':
            if (window.app.uiManager.validateForm()) {
              window.app.uiManager.startGeneration();
            }
            break;
          default:
            this.showInfo('重试', '请重新尝试您的操作');
        }
      }
    }
  }

  // 错误恢复机制
  async attemptRecovery(errorType, context = {}) {
    switch (errorType) {
      case 'network':
        return this.recoverFromNetworkError(context);
      case 'validation':
        return this.recoverFromValidationError(context);
      case 'generation':
        return this.recoverFromGenerationError(context);
      case 'export':
        return this.recoverFromExportError(context);
      default:
        return false;
    }
  }

  // 网络错误恢复
  async recoverFromNetworkError(context) {
    // 检查网络连接
    if (!navigator.onLine) {
      this.showWarning('网络连接中断', '请检查您的网络连接后重试');
      return false;
    }

    // 尝试重新连接
    try {
      const response = await fetch('/api/health', { 
        method: 'GET',
        timeout: 5000 
      });
      
      if (response.ok) {
        this.showSuccess('网络连接已恢复', '您可以继续使用应用');
        return true;
      }
    } catch (error) {
      console.warn('网络恢复检查失败:', error);
    }

    return false;
  }

  // 验证错误恢复
  recoverFromValidationError(context) {
    if (window.app && window.app.uiManager) {
      // 重新验证表单
      const isValid = window.app.uiManager.validateForm();
      
      if (isValid) {
        this.showSuccess('验证通过', '表单信息已完善');
        return true;
      } else {
        // 滚动到第一个错误字段
        const firstErrorField = document.querySelector('.form-group input.error, .form-group select.error');
        if (firstErrorField) {
          firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
          firstErrorField.focus();
        }
      }
    }
    
    return false;
  }

  // 生成错误恢复
  async recoverFromGenerationError(context) {
    if (window.app && window.app.uiManager) {
      // 重置进度管理器
      if (window.app.uiManager.progressManager) {
        window.app.uiManager.progressManager.reset();
      }

      // 切换回输入页面
      window.app.uiManager.switchSection('course-input-section');
      
      this.showInfo('已重置', '请重新填写信息并生成课件');
      return true;
    }
    
    return false;
  }

  // 导出错误恢复
  recoverFromExportError(context) {
    // 隐藏导出进度
    if (window.app && window.app.uiManager) {
      window.app.uiManager.hideLoading();
    }

    // 重置导出状态
    const exportBtn = document.getElementById('download-btn');
    if (exportBtn) {
      exportBtn.disabled = false;
      exportBtn.textContent = '下载';
    }

    this.showInfo('导出已重置', '请重新选择格式并导出');
    return true;
  }

  // 格式化错误消息
  formatErrorMessage(errorInfo) {
    switch (errorInfo.type) {
      case 'javascript':
        return `脚本错误: ${errorInfo.message}`;
      case 'promise':
        return `异步操作失败: ${errorInfo.message}`;
      case 'resource':
        return `资源加载失败: ${errorInfo.source}`;
      case 'network':
        return `网络请求失败: ${errorInfo.message}`;
      case 'validation':
        return `数据验证失败: ${errorInfo.message}`;
      default:
        return errorInfo.message || '未知错误';
    }
  }

  // 格式化错误详情
  formatErrorDetails(details) {
    if (typeof details === 'string') {
      return details;
    }

    if (details.error && details.error.stack) {
      return details.error.stack;
    }

    return JSON.stringify(details, null, 2);
  }

  // 判断是否应该显示全局错误
  shouldShowGlobalError(errorInfo) {
    // 过滤掉一些不重要的错误
    const ignoredErrors = [
      'Script error',
      'Non-Error promise rejection captured',
      'ResizeObserver loop limit exceeded'
    ];

    return !ignoredErrors.some(ignored => 
      errorInfo.message && errorInfo.message.includes(ignored)
    );
  }

  // 判断是否应该重试资源加载
  shouldRetryResource(errorInfo) {
    // 只对特定类型的资源进行重试
    const retryableElements = ['SCRIPT', 'LINK', 'IMG'];
    return retryableElements.includes(errorInfo.element);
  }

  // 重试资源加载
  retryResourceLoad(errorInfo) {
    // 实现资源重新加载逻辑
    console.log('尝试重新加载资源:', errorInfo.source);
    
    // 这里可以实现具体的资源重新加载逻辑
    // 例如重新创建script标签或重新设置src属性
  }

  // 添加到错误历史
  addToErrorHistory(errorInfo) {
    this.errorHistory.unshift({
      ...errorInfo,
      id: Date.now() + Math.random(),
      timestamp: errorInfo.timestamp || new Date().toISOString()
    });

    // 限制历史大小
    if (this.errorHistory.length > this.maxHistorySize) {
      this.errorHistory = this.errorHistory.slice(0, this.maxHistorySize);
    }
  }

  // 获取错误历史
  getErrorHistory() {
    return [...this.errorHistory];
  }

  // 清除错误历史
  clearErrorHistory() {
    this.errorHistory = [];
  }

  // 导出错误报告
  exportErrorReport() {
    const report = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      errors: this.errorHistory,
      appState: window.app ? window.app.getAppState() : null
    };

    const reportStr = JSON.stringify(report, null, 2);
    const blob = new Blob([reportStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `error-report-${Date.now()}.json`;
    link.click();

    URL.revokeObjectURL(url);

    this.showSuccess('错误报告已导出', '报告文件已下载到您的设备');
  }

  // 销毁错误处理器
  destroy() {
    // 移除事件监听器
    window.removeEventListener('error', this.handleGlobalError);
    window.removeEventListener('unhandledrejection', this.handleGlobalError);

    // 清理数据
    this.errorQueue = [];
    this.errorHistory = [];
    this.currentRetryHandler = null;
    this.currentConfirmResolve = null;

    console.log('错误处理系统已销毁');
  }
}

// 导出错误处理器
window.ErrorHandler = ErrorHandler;