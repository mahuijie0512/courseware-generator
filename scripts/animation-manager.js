// 动画管理器类
class AnimationManager {
  constructor() {
    this.activeAnimations = new Map();
    this.animationQueue = [];
    this.isProcessingQueue = false;
    this.observers = new Map();
    
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.setupAnimationEventListeners();
    this.setupPerformanceOptimizations();
  }

  // 设置交叉观察器用于滚动动画
  setupIntersectionObserver() {
    if ('IntersectionObserver' in window) {
      this.intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.triggerScrollAnimation(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '50px'
      });
    }
  }

  // 设置动画事件监听器
  setupAnimationEventListeners() {
    document.addEventListener('animationend', this.handleAnimationEnd.bind(this));
    document.addEventListener('transitionend', this.handleTransitionEnd.bind(this));
  }

  // 性能优化设置
  setupPerformanceOptimizations() {
    // 检测用户偏好
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // 监听偏好变化
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.prefersReducedMotion = e.matches;
      if (this.prefersReducedMotion) {
        this.disableAllAnimations();
      }
    });

    // 检测设备性能
    this.isLowPerformanceDevice = this.detectLowPerformanceDevice();
  }

  // 检测低性能设备
  detectLowPerformanceDevice() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    const memory = navigator.deviceMemory;
    const cores = navigator.hardwareConcurrency;

    // 基于网络、内存和CPU核心数判断
    const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
    const isLowMemory = memory && memory < 4;
    const isLowCores = cores && cores < 4;

    return isSlowConnection || isLowMemory || isLowCores;
  }

  // 页面切换动画
  animatePageTransition(fromSection, toSection, direction = 'forward') {
    if (this.prefersReducedMotion) {
      this.instantPageSwitch(fromSection, toSection);
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const animationId = `page-transition-${Date.now()}`;
      
      // 设置动画类
      const exitClass = direction === 'forward' ? 'slide-out-left' : 'slide-out-right';
      const enterClass = direction === 'forward' ? 'slide-in-right' : 'slide-in-left';

      // 开始退出动画
      if (fromSection) {
        fromSection.classList.add('section-leaving', exitClass);
      }

      // 准备进入动画
      toSection.classList.add('section-entering', enterClass);
      toSection.style.display = 'block';

      // 执行动画
      requestAnimationFrame(() => {
        if (fromSection) {
          fromSection.classList.add('section-leave-active');
        }
        toSection.classList.add('section-enter-active');

        // 动画完成处理
        const cleanup = () => {
          if (fromSection) {
            fromSection.classList.remove('active', 'section-leaving', exitClass, 'section-leave-active');
            fromSection.style.display = 'none';
          }
          
          toSection.classList.remove('section-entering', enterClass, 'section-enter-active');
          toSection.classList.add('active');
          
          this.activeAnimations.delete(animationId);
          resolve();
        };

        this.activeAnimations.set(animationId, {
          cleanup,
          timeout: setTimeout(cleanup, 600)
        });
      });
    });
  }

  // 即时页面切换（无动画）
  instantPageSwitch(fromSection, toSection) {
    if (fromSection) {
      fromSection.classList.remove('active');
      fromSection.style.display = 'none';
    }
    
    toSection.classList.add('active');
    toSection.style.display = 'block';
  }

  // 元素进入动画
  animateElementsIn(container, options = {}) {
    const {
      selector = '.animate-in',
      delay = 100,
      duration = 600,
      easing = 'ease-out'
    } = options;

    const elements = container.querySelectorAll(selector);
    
    elements.forEach((element, index) => {
      if (this.prefersReducedMotion) {
        element.style.opacity = '1';
        element.style.transform = 'none';
        return;
      }

      // 初始状态
      element.style.opacity = '0';
      element.style.transform = 'translateY(30px)';
      element.style.transition = `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`;

      // 延迟执行动画
      setTimeout(() => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }, index * delay);
    });
  }

  // 按钮点击动画
  animateButtonClick(button) {
    if (this.prefersReducedMotion) return;

    button.classList.add('btn-clicking');
    
    setTimeout(() => {
      button.classList.remove('btn-clicking');
    }, 150);
  }

  // 表单验证动画
  animateValidationFeedback(input, isValid) {
    if (this.prefersReducedMotion) {
      input.classList.toggle('validation-success', isValid);
      input.classList.toggle('validation-error', !isValid);
      return;
    }

    // 清除之前的动画类
    input.classList.remove('validation-success', 'validation-error');
    
    // 强制重绘
    input.offsetHeight;
    
    // 添加新的动画类
    if (isValid) {
      input.classList.add('validation-success');
    } else {
      input.classList.add('validation-error');
    }
  }

  // 进度条动画
  animateProgress(progressBar, targetPercentage, duration = 1000) {
    if (this.prefersReducedMotion) {
      progressBar.style.width = `${targetPercentage}%`;
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const startPercentage = parseFloat(progressBar.style.width) || 0;
      const difference = targetPercentage - startPercentage;
      const startTime = performance.now();

      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // 使用缓动函数
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const currentPercentage = startPercentage + (difference * easeOutCubic);
        
        progressBar.style.width = `${currentPercentage}%`;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };

      requestAnimationFrame(animate);
    });
  }

  // 步骤指示器动画
  animateStepProgress(step, status) {
    if (this.prefersReducedMotion) {
      step.classList.add(status);
      return;
    }

    // 添加动画类
    step.classList.add(`step-${status}-animation`);
    
    setTimeout(() => {
      step.classList.remove(`step-${status}-animation`);
      step.classList.add(status);
    }, 500);
  }

  // 内容加载动画
  animateContentLoad(container) {
    const items = container.querySelectorAll('.content-item, .concept-card, .formula-card');
    
    items.forEach((item, index) => {
      if (this.prefersReducedMotion) {
        item.style.opacity = '1';
        item.style.transform = 'none';
        return;
      }

      // 初始状态
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px) scale(0.95)';
      item.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';

      // 延迟动画
      setTimeout(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateY(0) scale(1)';
      }, index * 100);
    });
  }

  // 悬停动画
  setupHoverAnimations() {
    if (this.prefersReducedMotion || this.isLowPerformanceDevice) return;

    // 按钮悬停
    document.querySelectorAll('.btn, .action-btn').forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        if (!btn.disabled) {
          btn.classList.add('btn-hover');
        }
      });

      btn.addEventListener('mouseleave', () => {
        btn.classList.remove('btn-hover');
      });
    });

    // 卡片悬停
    document.querySelectorAll('.concept-card, .formula-card, .export-format-btn').forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.classList.add('card-hover');
      });

      card.addEventListener('mouseleave', () => {
        card.classList.remove('card-hover');
      });
    });
  }

  // 滚动触发动画
  triggerScrollAnimation(element) {
    if (this.prefersReducedMotion) return;

    element.classList.add('animate-in-view');
    this.intersectionObserver.unobserve(element);
  }

  // 观察滚动动画元素
  observeScrollAnimations() {
    if (!this.intersectionObserver) return;

    const elements = document.querySelectorAll('[data-animate-scroll]');
    elements.forEach(element => {
      this.intersectionObserver.observe(element);
    });
  }

  // 加载动画
  showLoadingAnimation(container, message = '加载中...') {
    if (this.prefersReducedMotion) {
      container.innerHTML = `<div class="loading-simple">${message}</div>`;
      return;
    }

    container.innerHTML = `
      <div class="loading-animation">
        <div class="loading-spinner"></div>
        <div class="loading-text">${message}</div>
        <div class="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;
  }

  // 成功动画
  showSuccessAnimation(element, message) {
    if (this.prefersReducedMotion) {
      element.textContent = message;
      return;
    }

    element.innerHTML = `
      <div class="success-animation">
        <div class="success-icon">✓</div>
        <div class="success-message">${message}</div>
      </div>
    `;

    element.classList.add('animate-success');
    
    setTimeout(() => {
      element.classList.remove('animate-success');
    }, 2000);
  }

  // 错误动画
  showErrorAnimation(element, message) {
    if (this.prefersReducedMotion) {
      element.textContent = message;
      return;
    }

    element.innerHTML = `
      <div class="error-animation">
        <div class="error-icon">✕</div>
        <div class="error-message">${message}</div>
      </div>
    `;

    element.classList.add('animate-error');
    
    setTimeout(() => {
      element.classList.remove('animate-error');
    }, 3000);
  }

  // 微交互动画
  addMicroInteraction(element, type = 'bounce') {
    if (this.prefersReducedMotion) return;

    element.classList.add(`micro-${type}`);
    
    setTimeout(() => {
      element.classList.remove(`micro-${type}`);
    }, 300);
  }

  // 处理动画结束事件
  handleAnimationEnd(event) {
    const element = event.target;
    
    // 清理临时动画类
    const tempClasses = [
      'validation-success', 'validation-error',
      'btn-clicking', 'card-hover', 'btn-hover',
      'animate-success', 'animate-error'
    ];
    
    tempClasses.forEach(className => {
      if (element.classList.contains(className)) {
        element.classList.remove(className);
      }
    });
  }

  // 处理过渡结束事件
  handleTransitionEnd(event) {
    // 可以在这里处理特定的过渡结束逻辑
  }

  // 禁用所有动画
  disableAllAnimations() {
    document.documentElement.classList.add('no-animations');
    
    // 清除所有活动动画
    this.activeAnimations.forEach(animation => {
      if (animation.timeout) {
        clearTimeout(animation.timeout);
      }
      if (animation.cleanup) {
        animation.cleanup();
      }
    });
    
    this.activeAnimations.clear();
  }

  // 启用动画
  enableAnimations() {
    document.documentElement.classList.remove('no-animations');
  }

  // 队列动画
  queueAnimation(animationFn, delay = 0) {
    this.animationQueue.push({ fn: animationFn, delay });
    
    if (!this.isProcessingQueue) {
      this.processAnimationQueue();
    }
  }

  // 处理动画队列
  async processAnimationQueue() {
    this.isProcessingQueue = true;
    
    while (this.animationQueue.length > 0) {
      const { fn, delay } = this.animationQueue.shift();
      
      if (delay > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      try {
        await fn();
      } catch (error) {
        console.warn('动画执行失败:', error);
      }
    }
    
    this.isProcessingQueue = false;
  }

  // 创建自定义动画
  createCustomAnimation(element, keyframes, options = {}) {
    if (this.prefersReducedMotion) {
      return Promise.resolve();
    }

    const {
      duration = 300,
      easing = 'ease-out',
      fill = 'forwards'
    } = options;

    if (element.animate) {
      return element.animate(keyframes, {
        duration,
        easing,
        fill
      }).finished;
    } else {
      // 回退到CSS动画
      return this.fallbackCSSAnimation(element, keyframes, options);
    }
  }

  // CSS动画回退
  fallbackCSSAnimation(element, keyframes, options) {
    return new Promise((resolve) => {
      const animationName = `custom-animation-${Date.now()}`;
      
      // 创建CSS关键帧
      const style = document.createElement('style');
      style.textContent = `
        @keyframes ${animationName} {
          ${keyframes.map((frame, index) => {
            const percentage = (index / (keyframes.length - 1)) * 100;
            const properties = Object.entries(frame)
              .map(([key, value]) => `${key}: ${value}`)
              .join('; ');
            return `${percentage}% { ${properties} }`;
          }).join('\n')}
        }
      `;
      
      document.head.appendChild(style);
      
      // 应用动画
      element.style.animation = `${animationName} ${options.duration || 300}ms ${options.easing || 'ease-out'} ${options.fill || 'forwards'}`;
      
      // 清理
      setTimeout(() => {
        element.style.animation = '';
        document.head.removeChild(style);
        resolve();
      }, options.duration || 300);
    });
  }

  // 销毁动画管理器
  destroy() {
    // 清理观察器
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }

    // 清理事件监听器
    document.removeEventListener('animationend', this.handleAnimationEnd);
    document.removeEventListener('transitionend', this.handleTransitionEnd);

    // 清理活动动画
    this.activeAnimations.forEach(animation => {
      if (animation.timeout) {
        clearTimeout(animation.timeout);
      }
      if (animation.cleanup) {
        animation.cleanup();
      }
    });

    this.activeAnimations.clear();
    this.animationQueue = [];
  }
}

// 全局动画管理器实例
window.AnimationManager = AnimationManager;