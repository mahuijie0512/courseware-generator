// 导出管理器
class ExportManager {
  constructor() {
    this.supportedFormats = ['html', 'pdf', 'pptx', 'docx', 'json'];
    this.exportProgress = 0;
    this.isExporting = false;
    
    console.log('ExportManager 初始化');
  }

  // 显示导出面板
  showExportPanel() {
    const exportPanel = this.createExportPanel();
    document.body.appendChild(exportPanel);
    
    // 添加显示动画
    requestAnimationFrame(() => {
      exportPanel.classList.add('show');
    });
  }

  // 创建导出面板
  createExportPanel() {
    const panel = document.createElement('div');
    panel.className = 'export-panel-overlay';
    panel.innerHTML = `
      <div class="export-panel">
        <div class="export-header">
          <h3>导出课件</h3>
          <button class="close-btn" onclick="this.closest('.export-panel-overlay').remove()">×</button>
        </div>
        
        <div class="export-content">
          <div class="export-section">
            <h4>选择导出格式</h4>
            <div class="export-formats">
              <div class="format-option" data-format="html">
                <div class="format-icon">🌐</div>
                <div class="format-info">
                  <div class="format-name">HTML网页</div>
                  <div class="format-desc">支持交互功能，便于在线查看</div>
                  <div class="format-size">~500KB</div>
                </div>
              </div>
              
              <div class="format-option" data-format="pdf">
                <div class="format-icon">📄</div>
                <div class="format-info">
                  <div class="format-name">PDF文档</div>
                  <div class="format-desc">便于打印和分享</div>
                  <div class="format-size">~2MB</div>
                </div>
              </div>
              
              <div class="format-option" data-format="pptx">
                <div class="format-icon">📊</div>
                <div class="format-info">
                  <div class="format-name">PowerPoint</div>
                  <div class="format-desc">适合课堂演示</div>
                  <div class="format-size">~3MB</div>
                </div>
              </div>
              
              <div class="format-option" data-format="docx">
                <div class="format-icon">📝</div>
                <div class="format-info">
                  <div class="format-name">Word文档</div>
                  <div class="format-desc">便于编辑修改</div>
                  <div class="format-size">~1.5MB</div>
                </div>
              </div>
              
              <div class="format-option" data-format="json">
                <div class="format-icon">⚙️</div>
                <div class="format-info">
                  <div class="format-name">JSON数据</div>
                  <div class="format-desc">用于系统集成</div>
                  <div class="format-size">~100KB</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="export-section">
            <h4>导出选项</h4>
            <div class="export-options">
              <label class="option-checkbox">
                <input type="checkbox" id="include-images" checked>
                <span class="checkmark"></span>
                包含图片和图表
              </label>
              
              <label class="option-checkbox">
                <input type="checkbox" id="include-interactions" checked>
                <span class="checkmark"></span>
                包含交互组件
              </label>
              
              <label class="option-checkbox">
                <input type="checkbox" id="include-resources">
                <span class="checkmark"></span>
                包含外部资源链接
              </label>
              
              <label class="option-checkbox">
                <input type="checkbox" id="include-metadata">
                <span class="checkmark"></span>
                包含课件元数据
              </label>
            </div>
          </div>
          
          <div class="export-progress" id="export-progress" style="display: none;">
            <div class="progress-info">
              <span class="progress-text">正在导出...</span>
              <span class="progress-percent">0%</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill"></div>
            </div>
          </div>
        </div>
        
        <div class="export-actions">
          <button class="btn-secondary" onclick="this.closest('.export-panel-overlay').remove()">取消</button>
          <button class="btn-primary" id="start-export-btn">开始导出</button>
        </div>
      </div>
    `;

    // 绑定事件
    this.bindExportPanelEvents(panel);
    
    return panel;
  }

  // 绑定导出面板事件
  bindExportPanelEvents(panel) {
    // 格式选择
    const formatOptions = panel.querySelectorAll('.format-option');
    formatOptions.forEach(option => {
      option.addEventListener('click', () => {
        formatOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
      });
    });

    // 开始导出按钮
    const startExportBtn = panel.querySelector('#start-export-btn');
    startExportBtn.addEventListener('click', () => {
      const selectedFormat = panel.querySelector('.format-option.selected');
      if (selectedFormat) {
        const format = selectedFormat.dataset.format;
        const options = this.getExportOptions(panel);
        this.startExport(format, options, panel);
      } else {
        alert('请选择导出格式');
      }
    });
  }

  // 获取导出选项
  getExportOptions(panel) {
    return {
      includeImages: panel.querySelector('#include-images').checked,
      includeInteractions: panel.querySelector('#include-interactions').checked,
      includeResources: panel.querySelector('#include-resources').checked,
      includeMetadata: panel.querySelector('#include-metadata').checked
    };
  }

  // 开始导出
  async startExport(format, options, panel) {
    if (this.isExporting) return;
    
    this.isExporting = true;
    const progressSection = panel.querySelector('#export-progress');
    const startBtn = panel.querySelector('#start-export-btn');
    
    // 显示进度
    progressSection.style.display = 'block';
    startBtn.disabled = true;
    startBtn.textContent = '导出中...';
    
    try {
      // 模拟导出过程
      await this.simulateExport(format, options, progressSection);
      
      // 导出完成
      this.completeExport(format, panel);
      
    } catch (error) {
      this.handleExportError(error, panel);
    } finally {
      this.isExporting = false;
      startBtn.disabled = false;
      startBtn.textContent = '开始导出';
    }
  }

  // 模拟导出过程
  async simulateExport(format, options, progressSection) {
    const steps = [
      { name: '准备数据...', duration: 800 },
      { name: '生成内容...', duration: 1500 },
      { name: '处理格式...', duration: 1200 },
      { name: '优化文件...', duration: 1000 },
      { name: '完成导出...', duration: 500 }
    ];

    const progressBar = progressSection.querySelector('.progress-fill');
    const progressText = progressSection.querySelector('.progress-text');
    const progressPercent = progressSection.querySelector('.progress-percent');

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const progress = Math.round(((i + 1) / steps.length) * 100);
      
      progressText.textContent = step.name;
      progressPercent.textContent = `${progress}%`;
      progressBar.style.width = `${progress}%`;
      
      await new Promise(resolve => setTimeout(resolve, step.duration));
    }
  }

  // 完成导出
  completeExport(format, panel) {
    const filename = this.generateFilename(format);
    
    // 创建下载链接
    const downloadUrl = this.generateDownloadUrl(format);
    
    // 显示成功消息
    const successHtml = `
      <div class="export-success">
        <div class="success-icon">✅</div>
        <h4>导出成功！</h4>
        <p>文件已生成：<strong>${filename}</strong></p>
        <div class="download-actions">
          <a href="${downloadUrl}" download="${filename}" class="btn-primary">
            <span class="download-icon">⬇️</span>
            下载文件
          </a>
          <button class="btn-secondary" onclick="this.closest('.export-panel-overlay').remove()">
            关闭
          </button>
        </div>
      </div>
    `;
    
    const exportContent = panel.querySelector('.export-content');
    exportContent.innerHTML = successHtml;
    
    // 隐藏操作按钮
    const exportActions = panel.querySelector('.export-actions');
    exportActions.style.display = 'none';
  }

  // 处理导出错误
  handleExportError(error, panel) {
    const errorHtml = `
      <div class="export-error">
        <div class="error-icon">❌</div>
        <h4>导出失败</h4>
        <p>${error.message || '导出过程中出现未知错误'}</p>
        <button class="btn-primary" onclick="location.reload()">
          重试
        </button>
      </div>
    `;
    
    const exportContent = panel.querySelector('.export-content');
    exportContent.innerHTML = errorHtml;
  }

  // 生成文件名
  generateFilename(format) {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const title = window.app?.uiManager?.formData?.title || '课件';
    return `${title}_${timestamp}.${format}`;
  }

  // 生成下载URL（模拟）
  generateDownloadUrl(format) {
    // 在实际项目中，这里会是真实的文件URL
    const blob = this.createMockFile(format);
    return URL.createObjectURL(blob);
  }

  // 创建模拟文件
  createMockFile(format) {
    let content = '';
    let mimeType = '';

    switch (format) {
      case 'html':
        content = this.generateHtmlContent();
        mimeType = 'text/html';
        break;
      case 'json':
        content = this.generateJsonContent();
        mimeType = 'application/json';
        break;
      case 'pdf':
        content = 'PDF文件内容（模拟）';
        mimeType = 'application/pdf';
        break;
      case 'pptx':
        content = 'PowerPoint文件内容（模拟）';
        mimeType = 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        break;
      case 'docx':
        content = 'Word文档内容（模拟）';
        mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
      default:
        content = '未知格式';
        mimeType = 'text/plain';
    }

    return new Blob([content], { type: mimeType });
  }

  // 生成HTML内容
  generateHtmlContent() {
    const courseware = window.DEMO_DATA?.sampleCourseware;
    if (!courseware) return '<html><body><h1>课件内容</h1></body></html>';

    return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${courseware.overview?.title || '课件'}</title>
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
        <h1 class="title">${courseware.overview?.title || '课件内容'}</h1>
        <p>${courseware.overview?.description || ''}</p>
    </div>
    
    <div class="section">
        <h2>学习目标</h2>
        <ul>
            ${(courseware.overview?.objectives || []).map(obj => `<li>${obj}</li>`).join('')}
        </ul>
    </div>
    
    <div class="section">
        <h2>重点概念</h2>
        ${(courseware.concepts || []).map(concept => `
            <div class="concept-card">
                <h3>${concept.name}</h3>
                <p>${concept.description}</p>
                <p><strong>详细说明：</strong>${concept.details}</p>
            </div>
        `).join('')}
    </div>
    
    <div class="section">
        <h2>重要公式</h2>
        ${(courseware.formulas || []).map(formula => `
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

  // 生成JSON内容
  generateJsonContent() {
    const courseware = window.DEMO_DATA?.sampleCourseware;
    const formData = window.app?.uiManager?.formData;
    
    const exportData = {
      metadata: {
        title: formData?.title || '未命名课件',
        subject: formData?.subject || '',
        grade: formData?.grade || '',
        volume: formData?.volume || '',
        exportTime: new Date().toISOString(),
        version: '1.0.0'
      },
      content: courseware || {},
      settings: {
        difficulty: formData?.difficulty || 'intermediate',
        language: formData?.language || 'zh-CN'
      }
    };
    
    return JSON.stringify(exportData, null, 2);
  }
}

// 导出到全局作用域
window.ExportManager = ExportManager;

console.log('ExportManager 加载完成');