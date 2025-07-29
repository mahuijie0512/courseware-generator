// 应用状态管理系统
class StateManager {
  constructor() {
    // 初始状态定义
    this.initialState = {
      // 当前页面section
      currentSection: 'course-input-section',
      
      // 课程信息
      courseInfo: {
        subject: '',
        grade: '',
        volume: '',
        title: ''
      },
      
      // 生成选项
      generationOptions: {
        includeInteractions: true,
        searchOnlineResources: true,
        generateDiagrams: true,
        difficultyLevel: 'intermediate',
        language: 'zh-CN'
      },
      
      // 生成进度
      generationProgress: {
        percentage: 0,
        status: '',
        isGenerating: false,
        currentStep: '',
        steps: []
      },
      
      // 课件内容
      courseContent: null,
      
      // UI状态
      uiState: {
        activeTab: 'overview',
        optionsExpanded: false,
        exportPanelVisible: false,
        selectedExportFormat: null,
        exportOptions: {
          includeDiagrams: true,
          includeInteractions: true,
          includeResources: true,
          includeMetadata: false
        }
      },
      
      // 错误状态
      error: null,
      
      // 用户偏好
      userPreferences: {
        theme: 'light',
        autoSave: true,
        notifications: true
      },
      
      // 应用元数据
      metadata: {
        version: '1.0.0',
        lastUpdated: null,
        sessionId: this.generateSessionId()
      }
    };
    
    // 当前状态
    this.state = { ...this.initialState };
    
    // 状态变更监听器
    this.listeners = new Map();
    
    // 状态变更历史（用于撤销/重做）
    this.history = [];
    this.historyIndex = -1;
    this.maxHistorySize = 50;
    
    // 持久化配置
    this.persistenceConfig = {
      key: 'courseware-app-state',
      version: '1.0.0',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7天
      excludeFromPersistence: ['generationProgress', 'error', 'metadata.sessionId']
    };
    
    // 初始化
    this.init();
  }

  // 初始化状态管理器
  init() {
    try {
      // 加载持久化状态
      this.loadPersistedState();
      
      // 设置自动保存
      this.setupAutoSave();
      
      // 设置页面卸载保存
      this.setupUnloadSave();
      
      // 设置状态验证
      this.setupStateValidation();
      
      console.log('状态管理器初始化成功');
      
    } catch (error) {
      console.error('状态管理器初始化失败:', error);
      this.resetToInitialState();
    }
  }

  // 生成会话ID
  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
  }

  // 获取状态
  getState(path = null) {
    if (!path) {
      return { ...this.state };
    }
    
    return this.getNestedValue(this.state, path);
  }

  // 设置状态
  setState(updates, options = {}) {
    const { 
      silent = false, 
      skipHistory = false, 
      skipPersistence = false,
      merge = true 
    } = options;
    
    try {
      // 保存当前状态到历史
      if (!skipHistory) {
        this.saveToHistory();
      }
      
      // 更新状态
      const previousState = { ...this.state };
      
      if (merge) {
        this.state = this.deepMerge(this.state, updates);
      } else {
        this.state = { ...updates };
      }
      
      // 更新元数据
      this.state.metadata.lastUpdated = new Date().toISOString();
      
      // 验证状态
      this.validateState();
      
      // 触发监听器
      if (!silent) {
        this.notifyListeners(updates, previousState);
      }
      
      // 持久化状态
      if (!skipPersistence) {
        this.persistState();
      }
      
      return true;
      
    } catch (error) {
      console.error('状态更新失败:', error);
      return false;
    }
  }

  // 批量更新状态
  batchUpdate(updates, options = {}) {
    const batchOptions = { ...options, silent: true };
    
    updates.forEach((update, index) => {
      const isLast = index === updates.length - 1;
      this.setState(update, { 
        ...batchOptions, 
        silent: !isLast || options.silent 
      });
    });
  }

  // 重置状态
  resetState(section = null) {
    if (section) {
      // 重置特定部分
      const sectionState = this.getNestedValue(this.initialState, section);
      if (sectionState) {
        this.setState({ [section]: sectionState });
      }
    } else {
      // 重置整个状态
      this.setState(this.initialState, { merge: false });
    }
  }

  // 重置到初始状态
  resetToInitialState() {
    this.state = { ...this.initialState };
    this.history = [];
    this.historyIndex = -1;
    this.clearPersistedState();
    this.notifyListeners(this.state, {});
  }

  // 添加状态监听器
  subscribe(key, callback, options = {}) {
    const { 
      immediate = false, 
      filter = null,
      debounce = 0 
    } = options;
    
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }
    
    const listener = {
      callback: debounce > 0 ? this.debounce(callback, debounce) : callback,
      filter,
      options
    };
    
    this.listeners.get(key).push(listener);
    
    // 立即触发回调
    if (immediate) {
      callback(this.state, {});
    }
    
    // 返回取消订阅函数
    return () => this.unsubscribe(key, listener);
  }

  // 取消订阅
  unsubscribe(key, listener) {
    if (this.listeners.has(key)) {
      const listeners = this.listeners.get(key);
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
      
      if (listeners.length === 0) {
        this.listeners.delete(key);
      }
    }
  }

  // 通知监听器
  notifyListeners(updates, previousState) {
    this.listeners.forEach((listeners, key) => {
      listeners.forEach(listener => {
        try {
          // 应用过滤器
          if (listener.filter && !listener.filter(updates, previousState)) {
            return;
          }
          
          listener.callback(this.state, previousState, updates);
          
        } catch (error) {
          console.error(`监听器 ${key} 执行失败:`, error);
        }
      });
    });
    
    // 触发全局状态变更事件
    this.dispatchStateChangeEvent(updates, previousState);
  }

  // 分发状态变更事件
  dispatchStateChangeEvent(updates, previousState) {
    const event = new CustomEvent('stateChange', {
      detail: {
        state: this.state,
        updates,
        previousState,
        timestamp: Date.now()
      }
    });
    
    window.dispatchEvent(event);
  }

  // 状态历史管理
  saveToHistory() {
    // 移除当前位置之后的历史
    if (this.historyIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1);
    }
    
    // 添加当前状态到历史
    this.history.push(JSON.stringify(this.state));
    
    // 限制历史大小
    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    } else {
      this.historyIndex++;
    }
  }

  // 撤销
  undo() {
    if (this.canUndo()) {
      this.historyIndex--;
      const previousState = JSON.parse(this.history[this.historyIndex]);
      this.setState(previousState, { 
        merge: false, 
        skipHistory: true, 
        silent: false 
      });
      return true;
    }
    return false;
  }

  // 重做
  redo() {
    if (this.canRedo()) {
      this.historyIndex++;
      const nextState = JSON.parse(this.history[this.historyIndex]);
      this.setState(nextState, { 
        merge: false, 
        skipHistory: true, 
        silent: false 
      });
      return true;
    }
    return false;
  }

  // 检查是否可以撤销
  canUndo() {
    return this.historyIndex > 0;
  }

  // 检查是否可以重做
  canRedo() {
    return this.historyIndex < this.history.length - 1;
  }

  // 状态持久化
  persistState() {
    if (!this.state.userPreferences.autoSave) {
      return;
    }
    
    try {
      const stateToPersist = this.filterStateForPersistence(this.state);
      const persistenceData = {
        state: stateToPersist,
        version: this.persistenceConfig.version,
        timestamp: Date.now()
      };
      
      localStorage.setItem(
        this.persistenceConfig.key, 
        JSON.stringify(persistenceData)
      );
      
    } catch (error) {
      console.warn('状态持久化失败:', error);
    }
  }

  // 加载持久化状态
  loadPersistedState() {
    try {
      const persistedData = localStorage.getItem(this.persistenceConfig.key);
      
      if (!persistedData) {
        return;
      }
      
      const { state, version, timestamp } = JSON.parse(persistedData);
      
      // 检查版本兼容性
      if (version !== this.persistenceConfig.version) {
        console.warn('持久化状态版本不兼容，使用默认状态');
        this.clearPersistedState();
        return;
      }
      
      // 检查数据是否过期
      if (Date.now() - timestamp > this.persistenceConfig.maxAge) {
        console.warn('持久化状态已过期，使用默认状态');
        this.clearPersistedState();
        return;
      }
      
      // 合并持久化状态
      this.state = this.deepMerge(this.initialState, state);
      
      console.log('成功加载持久化状态');
      
    } catch (error) {
      console.warn('加载持久化状态失败:', error);
      this.clearPersistedState();
    }
  }

  // 清除持久化状态
  clearPersistedState() {
    try {
      localStorage.removeItem(this.persistenceConfig.key);
    } catch (error) {
      console.warn('清除持久化状态失败:', error);
    }
  }

  // 过滤需要持久化的状态
  filterStateForPersistence(state) {
    const filtered = { ...state };
    
    this.persistenceConfig.excludeFromPersistence.forEach(path => {
      this.deleteNestedValue(filtered, path);
    });
    
    return filtered;
  }

  // 设置自动保存
  setupAutoSave() {
    // 定期保存状态
    setInterval(() => {
      if (this.state.userPreferences.autoSave) {
        this.persistState();
      }
    }, 30000); // 每30秒保存一次
  }

  // 设置页面卸载保存
  setupUnloadSave() {
    window.addEventListener('beforeunload', () => {
      this.persistState();
    });
    
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.persistState();
      }
    });
  }

  // 设置状态验证
  setupStateValidation() {
    // 定期验证状态完整性
    setInterval(() => {
      this.validateState();
    }, 60000); // 每分钟验证一次
  }

  // 验证状态
  validateState() {
    try {
      // 验证必需字段
      const requiredFields = [
        'currentSection',
        'courseInfo',
        'generationOptions',
        'uiState'
      ];
      
      requiredFields.forEach(field => {
        if (!(field in this.state)) {
          throw new Error(`缺少必需字段: ${field}`);
        }
      });
      
      // 验证currentSection值
      const validSections = [
        'course-input-section',
        'generation-section',
        'content-display-section'
      ];
      
      if (!validSections.includes(this.state.currentSection)) {
        console.warn('无效的currentSection值，重置为默认值');
        this.state.currentSection = 'course-input-section';
      }
      
      return true;
      
    } catch (error) {
      console.error('状态验证失败:', error);
      return false;
    }
  }

  // 深度合并对象
  deepMerge(target, source) {
    const result = { ...target };
    
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (this.isObject(source[key]) && this.isObject(result[key])) {
          result[key] = this.deepMerge(result[key], source[key]);
        } else {
          result[key] = source[key];
        }
      }
    }
    
    return result;
  }

  // 获取嵌套值
  getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
  }

  // 设置嵌套值
  setNestedValue(obj, path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((current, key) => {
      if (!current[key] || !this.isObject(current[key])) {
        current[key] = {};
      }
      return current[key];
    }, obj);
    
    target[lastKey] = value;
  }

  // 删除嵌套值
  deleteNestedValue(obj, path) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((current, key) => {
      return current && current[key] ? current[key] : null;
    }, obj);
    
    if (target && target.hasOwnProperty(lastKey)) {
      delete target[lastKey];
    }
  }

  // 检查是否为对象
  isObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  // 防抖函数
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // 获取状态快照
  getSnapshot() {
    return {
      state: JSON.parse(JSON.stringify(this.state)),
      timestamp: Date.now(),
      version: this.persistenceConfig.version
    };
  }

  // 恢复状态快照
  restoreSnapshot(snapshot) {
    if (snapshot.version !== this.persistenceConfig.version) {
      throw new Error('快照版本不兼容');
    }
    
    this.setState(snapshot.state, { merge: false });
  }

  // 导出状态
  exportState() {
    const exportData = {
      state: this.filterStateForPersistence(this.state),
      metadata: {
        exportTime: new Date().toISOString(),
        version: this.persistenceConfig.version,
        userAgent: navigator.userAgent
      }
    };
    
    return JSON.stringify(exportData, null, 2);
  }

  // 导入状态
  importState(stateData) {
    try {
      const importData = JSON.parse(stateData);
      
      if (!importData.state || !importData.metadata) {
        throw new Error('无效的状态数据格式');
      }
      
      if (importData.metadata.version !== this.persistenceConfig.version) {
        throw new Error('状态数据版本不兼容');
      }
      
      this.setState(importData.state, { merge: false });
      
      return true;
      
    } catch (error) {
      console.error('导入状态失败:', error);
      return false;
    }
  }

  // 获取状态统计信息
  getStateStats() {
    return {
      stateSize: JSON.stringify(this.state).length,
      historySize: this.history.length,
      historyIndex: this.historyIndex,
      listenersCount: Array.from(this.listeners.values()).reduce((sum, arr) => sum + arr.length, 0),
      lastUpdated: this.state.metadata.lastUpdated,
      sessionId: this.state.metadata.sessionId
    };
  }

  // 清理资源
  destroy() {
    // 清除所有监听器
    this.listeners.clear();
    
    // 清除历史
    this.history = [];
    this.historyIndex = -1;
    
    // 最后一次保存
    this.persistState();
    
    console.log('状态管理器已销毁');
  }
}

// 状态动作创建器
class StateActions {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }

  // 课程信息相关动作
  updateCourseInfo(courseInfo) {
    return this.stateManager.setState({
      courseInfo: { ...this.stateManager.getState('courseInfo'), ...courseInfo }
    });
  }

  setCourseField(field, value) {
    return this.stateManager.setState({
      courseInfo: { 
        ...this.stateManager.getState('courseInfo'), 
        [field]: value 
      }
    });
  }

  resetCourseInfo() {
    return this.stateManager.setState({
      courseInfo: this.stateManager.initialState.courseInfo
    });
  }

  // 生成选项相关动作
  updateGenerationOptions(options) {
    return this.stateManager.setState({
      generationOptions: { ...this.stateManager.getState('generationOptions'), ...options }
    });
  }

  toggleGenerationOption(option) {
    const currentOptions = this.stateManager.getState('generationOptions');
    return this.stateManager.setState({
      generationOptions: {
        ...currentOptions,
        [option]: !currentOptions[option]
      }
    });
  }

  // 进度相关动作
  startGeneration(steps = []) {
    return this.stateManager.setState({
      generationProgress: {
        percentage: 0,
        status: '开始生成...',
        isGenerating: true,
        currentStep: '',
        steps: steps
      }
    });
  }

  updateProgress(percentage, status, currentStep = '') {
    const currentProgress = this.stateManager.getState('generationProgress');
    return this.stateManager.setState({
      generationProgress: {
        ...currentProgress,
        percentage,
        status,
        currentStep
      }
    });
  }

  completeGeneration(courseContent) {
    return this.stateManager.batchUpdate([
      {
        generationProgress: {
          percentage: 100,
          status: '生成完成！',
          isGenerating: false,
          currentStep: '',
          steps: []
        }
      },
      {
        courseContent: courseContent,
        currentSection: 'content-display-section'
      }
    ]);
  }

  failGeneration(error) {
    return this.stateManager.setState({
      generationProgress: {
        percentage: 0,
        status: '生成失败',
        isGenerating: false,
        currentStep: '',
        steps: []
      },
      error: {
        title: '生成失败',
        message: error.message || '未知错误',
        timestamp: new Date().toISOString()
      }
    });
  }

  // UI状态相关动作
  switchSection(section) {
    return this.stateManager.setState({
      currentSection: section
    });
  }

  switchTab(tab) {
    return this.stateManager.setState({
      uiState: {
        ...this.stateManager.getState('uiState'),
        activeTab: tab
      }
    });
  }

  toggleOptions(expanded = null) {
    const currentState = this.stateManager.getState('uiState');
    return this.stateManager.setState({
      uiState: {
        ...currentState,
        optionsExpanded: expanded !== null ? expanded : !currentState.optionsExpanded
      }
    });
  }

  toggleExportPanel(visible = null) {
    const currentState = this.stateManager.getState('uiState');
    return this.stateManager.setState({
      uiState: {
        ...currentState,
        exportPanelVisible: visible !== null ? visible : !currentState.exportPanelVisible
      }
    });
  }

  setExportFormat(format) {
    return this.stateManager.setState({
      uiState: {
        ...this.stateManager.getState('uiState'),
        selectedExportFormat: format
      }
    });
  }

  updateExportOptions(options) {
    const currentState = this.stateManager.getState('uiState');
    return this.stateManager.setState({
      uiState: {
        ...currentState,
        exportOptions: {
          ...currentState.exportOptions,
          ...options
        }
      }
    });
  }

  // 错误处理相关动作
  setError(title, message) {
    return this.stateManager.setState({
      error: {
        title,
        message,
        timestamp: new Date().toISOString()
      }
    });
  }

  clearError() {
    return this.stateManager.setState({
      error: null
    });
  }

  // 用户偏好相关动作
  updateUserPreferences(preferences) {
    return this.stateManager.setState({
      userPreferences: {
        ...this.stateManager.getState('userPreferences'),
        ...preferences
      }
    });
  }

  setTheme(theme) {
    return this.stateManager.setState({
      userPreferences: {
        ...this.stateManager.getState('userPreferences'),
        theme
      }
    });
  }

  toggleAutoSave() {
    const currentPrefs = this.stateManager.getState('userPreferences');
    return this.stateManager.setState({
      userPreferences: {
        ...currentPrefs,
        autoSave: !currentPrefs.autoSave
      }
    });
  }

  // 内容相关动作
  setCourseContent(content) {
    return this.stateManager.setState({
      courseContent: content
    });
  }

  clearCourseContent() {
    return this.stateManager.setState({
      courseContent: null
    });
  }

  // 复合动作
  resetApplication() {
    return this.stateManager.setState(this.stateManager.initialState, { merge: false });
  }

  initializeFromFormData(formData) {
    return this.stateManager.batchUpdate([
      {
        courseInfo: {
          ...this.stateManager.getState('courseInfo'),
          ...formData
        }
      },
      {
        currentSection: 'course-input-section'
      }
    ]);
  }
}

// 状态选择器
class StateSelectors {
  constructor(stateManager) {
    this.stateManager = stateManager;
  }

  // 基础选择器
  getCurrentSection() {
    return this.stateManager.getState('currentSection');
  }

  getCourseInfo() {
    return this.stateManager.getState('courseInfo');
  }

  getGenerationOptions() {
    return this.stateManager.getState('generationOptions');
  }

  getGenerationProgress() {
    return this.stateManager.getState('generationProgress');
  }

  getCourseContent() {
    return this.stateManager.getState('courseContent');
  }

  getUIState() {
    return this.stateManager.getState('uiState');
  }

  getError() {
    return this.stateManager.getState('error');
  }

  getUserPreferences() {
    return this.stateManager.getState('userPreferences');
  }

  // 计算选择器
  isFormValid() {
    const courseInfo = this.getCourseInfo();
    return !!(courseInfo.subject && courseInfo.grade && courseInfo.volume && courseInfo.title);
  }

  isGenerating() {
    return this.getGenerationProgress()?.isGenerating || false;
  }

  hasError() {
    return this.getError() !== null;
  }

  hasContent() {
    return this.getCourseContent() !== null;
  }

  getProgressPercentage() {
    return this.getGenerationProgress()?.percentage || 0;
  }

  getCurrentTab() {
    return this.getUIState()?.activeTab || 'overview';
  }

  isOptionsExpanded() {
    return this.getUIState()?.optionsExpanded || false;
  }

  isExportPanelVisible() {
    return this.getUIState()?.exportPanelVisible || false;
  }

  getSelectedExportFormat() {
    return this.getUIState()?.selectedExportFormat;
  }

  getExportOptions() {
    return this.getUIState()?.exportOptions || {};
  }

  // 复合选择器
  getFormData() {
    return {
      ...this.getCourseInfo(),
      ...this.getGenerationOptions()
    };
  }

  getAppStatus() {
    return {
      currentSection: this.getCurrentSection(),
      isGenerating: this.isGenerating(),
      hasError: this.hasError(),
      hasContent: this.hasContent(),
      isFormValid: this.isFormValid(),
      progressPercentage: this.getProgressPercentage()
    };
  }

  canNavigateToSection(section) {
    switch (section) {
      case 'course-input-section':
        return true;
      case 'generation-section':
        return this.isFormValid();
      case 'content-display-section':
        return this.hasContent();
      default:
        return false;
    }
  }
}

// 导出状态管理器和相关类
window.StateManager = StateManager;
window.StateActions = StateActions;
window.StateSelectors = StateSelectors;