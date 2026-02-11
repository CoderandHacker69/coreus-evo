// Zdit - Code Editor
// Main JavaScript File

class ZditEditor {
  constructor() {
    this.files = new Map();
    this.currentFile = null;
    this.currentType = 'html';
    this.isSidebarOpen = false;
    
    this.init();
  }

  init() {
    this.loadFromStorage();
    this.setupElements();
    this.bindEvents();
    this.createDefaultFile();
    this.renderFileList();
    this.updateLineNumbers();
    this.updatePreview();
  }

  setupElements() {
    // Header
    this.menuBtn = document.getElementById('menuBtn');
    this.runBtn = document.getElementById('runBtn');
    this.saveBtn = document.getElementById('saveBtn');
    this.moreBtn = document.getElementById('moreBtn');
    this.filenameEl = document.getElementById('filename');

    // Sidebar
    this.sidebar = document.getElementById('sidebar');
    this.fileList = document.getElementById('fileList');
    this.newFileBtn = document.getElementById('newFileBtn');
    this.importBtn = document.getElementById('importBtn');
    this.exportBtn = document.getElementById('exportBtn');
    this.importInput = document.getElementById('importInput');

    // Editor
    this.tabs = document.getElementById('tabs');
    this.codeEditor = document.getElementById('codeEditor');
    this.lineNumbers = document.getElementById('lineNumbers');
    this.charCount = document.getElementById('charCount');
    this.lineCount = document.getElementById('lineCount');
    this.formatBtn = document.getElementById('formatBtn');
    this.copyBtn = document.getElementById('copyBtn');
    this.clearBtn = document.getElementById('clearBtn');

    // Preview
    this.previewFrame = document.getElementById('previewFrame');
    this.newWindowBtn = document.getElementById('newWindowBtn');
    this.refreshBtn = document.getElementById('refreshBtn');

    // Mobile
    this.mobileBar = document.getElementById('mobileBar');

    // Modal
    this.modalOverlay = document.getElementById('modalOverlay');
    this.modal = document.getElementById('modal');
    this.modalTitle = document.getElementById('modalTitle');
    this.modalContent = document.getElementById('modalContent');
    this.modalFooter = document.getElementById('modalFooter');
    this.modalClose = document.getElementById('modalClose');

    // Toast
    this.toastContainer = document.getElementById('toastContainer');
  }

  bindEvents() {
    // Sidebar toggle
    this.menuBtn.addEventListener('click', () => this.toggleSidebar());

    // Run code
    this.runBtn.addEventListener('click', () => this.runCode());
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        this.runCode();
      }
    });

    // Save
    this.saveBtn.addEventListener('click', () => this.saveCurrentFile());
    this.codeEditor.addEventListener('input', () => this.autoSave());
    this.codeEditor.addEventListener('keydown', (e) => this.handleEditorKeydown(e));

    // More options
    this.moreBtn.addEventListener('click', () => this.showMoreOptions());

    // File operations
    this.newFileBtn.addEventListener('click', () => this.showNewFileModal());
    this.importBtn.addEventListener('click', () => this.importInput.click());
    this.exportBtn.addEventListener('click', () => this.exportProject());
    this.importInput.addEventListener('change', (e) => this.handleImport(e));

    // Tabs
    this.tabs.addEventListener('click', (e) => {
      const tab = e.target.closest('.tab');
      if (tab) this.switchTab(tab.dataset.type);
    });

    // Editor
    this.codeEditor.addEventListener('input', () => this.handleEditorInput());
    this.codeEditor.addEventListener('scroll', () => this.syncScroll());

    // Toolbar
    this.formatBtn.addEventListener('click', () => this.formatCode());
    this.copyBtn.addEventListener('click', () => this.copyCode());
    this.clearBtn.addEventListener('click', () => this.clearCode());

    // Preview
    this.refreshBtn.addEventListener('click', () => this.updatePreview());
    this.newWindowBtn.addEventListener('click', () => this.openInNewWindow());

    // Mobile view switcher
    this.mobileBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.mobile-btn');
      if (btn) this.switchMobileView(btn.dataset.view);
    });

    // Modal
    this.modalClose.addEventListener('click', () => this.closeModal());
    this.modalOverlay.addEventListener('click', (e) => {
      if (e.target === this.modalOverlay) this.closeModal();
    });

    // Window resize
    window.addEventListener('resize', () => this.handleResize());
  }

  // File Management
  createDefaultFile() {
    if (this.files.size === 0) {
      const defaultFile = {
        name: 'untitled.html',
        type: 'html',
        html: this.getDefaultHTML(),
        css: this.getDefaultCSS(),
        js: this.getDefaultJS()
      };
      this.files.set('untitled.html', defaultFile);
      this.currentFile = 'untitled.html';
      this.loadFileContent();
    }
  }

  getDefaultHTML() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Project</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="container">
    <h1>Hello, World!</h1>
    <p>Start coding to see results here.</p>
    <button id="myButton">Click Me</button>
  </div>
  <script src="script.js"></script>
</body>
</html>`;
  }

  getDefaultCSS() {
    return `* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

h1 {
  color: #333;
  margin-bottom: 10px;
}

p {
  color: #666;
  margin-bottom: 20px;
}

button {
  padding: 12px 30px;
  font-size: 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

button:active {
  transform: translateY(0);
}`;
  }

  getDefaultJS() {
    return `// Your JavaScript code here
document.getElementById('myButton').addEventListener('click', function() {
  this.textContent = 'Clicked!';
  this.style.background = '#764ba2';
  
  setTimeout(() => {
    this.textContent = 'Click Me';
    this.style.background = '#667eea';
  }, 1000);
});

console.log('Hello from Zdit!');`;
  }

  loadFromStorage() {
    try {
      const saved = localStorage.getItem('zdit-files');
      if (saved) {
        const data = JSON.parse(saved);
        this.files = new Map(Object.entries(data));
      }
    } catch (e) {
      console.warn('Could not load saved files:', e);
    }
  }

  saveToStorage() {
    try {
      const data = Object.fromEntries(this.files);
      localStorage.setItem('zdit-files', JSON.stringify(data));
    } catch (e) {
      console.warn('Could not save files:', e);
    }
  }

  autoSave() {
    if (this.currentFile) {
      const file = this.files.get(this.currentFile);
      if (file) {
        file[this.currentType] = this.codeEditor.value;
        this.saveToStorage();
        this.updatePreview();
      }
    }
  }

  saveCurrentFile() {
    this.autoSave();
    this.showToast('File saved!', 'success');
  }

  loadFileContent() {
    if (!this.currentFile) return;

    const file = this.files.get(this.currentFile);
    if (file) {
      this.filenameEl.textContent = file.name;
      this.codeEditor.value = file[this.currentType] || '';
      this.updateLineNumbers();
      this.updateCharCount();
      this.highlightSyntax();
    }
  }

  switchTab(type) {
    // Save current content
    if (this.currentFile) {
      const file = this.files.get(this.currentFile);
      if (file) {
        file[this.currentType] = this.codeEditor.value;
      }
    }

    this.currentType = type;

    // Update tab UI
    this.tabs.querySelectorAll('.tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.type === type);
    });

    this.loadFileContent();
    this.autoSave();
  }

  // File List
  renderFileList() {
    this.fileList.innerHTML = '';
    this.files.forEach((file, name) => {
      const item = document.createElement('div');
      item.className = `file-item${name === this.currentFile ? ' active' : ''}`;
      item.innerHTML = `
        <span class="file-icon">${this.getFileIcon(file.type)}</span>
        <span class="file-name">${name}</span>
        <span class="file-delete" data-name="${name}">×</span>
      `;
      item.addEventListener('click', (e) => {
        if (!e.target.classList.contains('file-delete')) {
          this.openFile(name);
        }
      });
      this.fileList.appendChild(item);
    });
  }

  getFileIcon(type) {
    const icons = {
      html: '📄',
      css: '🎨',
      js: '⚡',
      json: '📋',
      txt: '📝'
    };
    return icons[type] || '📄';
  }

  openFile(name) {
    // Save current content
    if (this.currentFile) {
      const file = this.files.get(this.currentFile);
      if (file) {
        file[this.currentType] = this.codeEditor.value;
      }
    }

    this.currentFile = name;
    const file = this.files.get(name);
    this.currentType = file.type === 'json' ? 'js' : 'html';

    // Switch to HTML tab for HTML files
    if (file.type === 'html') {
      this.switchTab('html');
    } else if (file.type === 'css') {
      this.switchTab('css');
    } else {
      this.switchTab('js');
    }

    this.renderFileList();
    this.closeSidebar();
  }

  showNewFileModal() {
    this.modalTitle.textContent = 'New File';
    this.modalContent.innerHTML = `
      <div class="input-group">
        <label for="newFileName">File Name</label>
        <input type="text" id="newFileName" placeholder="myfile.html" value="">
      </div>
      <div class="input-group">
        <label for="newFileType">Type</label>
        <select id="newFileType" style="width:100%;padding:10px;background:var(--bg-tertiary);border:1px solid var(--border);border-radius:var(--radius);color:var(--text-primary);">
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="js">JavaScript</option>
        </select>
      </div>
    `;
    this.modalFooter.innerHTML = `
      <button class="btn-secondary" id="cancelNewFile">Cancel</button>
      <button class="btn-secondary" id="createNewFile" style="background:var(--accent);border-color:var(--accent);">Create</button>
    `;
    this.modalOverlay.classList.add('open');

    document.getElementById('newFileName').focus();

    document.getElementById('cancelNewFile').addEventListener('click', () => this.closeModal());
    document.getElementById('createNewFile').addEventListener('click', () => this.createNewFile());
  }

  createNewFile() {
    const name = document.getElementById('newFileName').value.trim() || 'untitled.html';
    const type = document.getElementById('newFileType').value;

    if (this.files.has(name)) {
      this.showToast('File already exists!', 'error');
      return;
    }

    const extensions = { html: '.html', css: '.css', js: '.js' };
    const fileName = name.endsWith(extensions[type]) ? name : name + extensions[type];

    const newFile = {
      name: fileName,
      type: type,
      html: type === 'html' ? this.getDefaultHTML() : '',
      css: type === 'css' ? '/* CSS Code */' : '',
      js: type === 'js' ? '// JavaScript Code' : ''
    };

    this.files.set(fileName, newFile);
    this.saveToStorage();
    this.renderFileList();
    this.openFile(fileName);
    this.closeModal();
    this.showToast('File created!', 'success');
  }

  deleteFile(name) {
    if (this.files.size <= 1) {
      this.showToast('Cannot delete the only file!', 'error');
      return;
    }

    this.files.delete(name);
    this.saveToStorage();

    if (this.currentFile === name) {
      const firstFile = this.files.keys().next().value;
      this.openFile(firstFile);
    }

    this.renderFileList();
    this.showToast('File deleted!', 'success');
  }

  // Import/Export
  handleImport(e) {
    const importedFiles = Array.from(e.target.files);
    let imported = 0;

    importedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target.result;
        const name = file.name;
        const type = this.getFileType(name);

        let fileData = { name, type };

        if (type === 'html') {
          fileData.html = content;
          fileData.css = '';
          fileData.js = '';
        } else if (type === 'css') {
          fileData.html = '';
          fileData.css = content;
          fileData.js = '';
        } else if (type === 'js') {
          fileData.html = '';
          fileData.css = '';
          fileData.js = content;
        }

        this.files.set(name, fileData);
        imported++;
        this.renderFileList();

        if (imported === importedFiles.length) {
          this.showToast(`Imported ${imported} file(s)!`, 'success');
        }
      };
      reader.readAsText(file);
    });

    e.target.value = '';
  }

  getFileType(name) {
    const ext = name.split('.').pop().toLowerCase();
    if (ext === 'html' || ext === 'htm') return 'html';
    if (ext === 'css') return 'css';
    if (ext === 'js') return 'js';
    return 'txt';
  }

  exportProject() {
    const projectData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      files: Object.fromEntries(this.files)
    };

    const blob = new Blob([JSON.stringify(projectData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zdit-project-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.showToast('Project exported!', 'success');
  }

  // Preview
  updatePreview() {
    if (!this.currentFile) return;

    const file = this.files.get(this.currentFile);
    if (!file) return;

    let html = file.html;

    // Inject CSS
    if (file.css) {
      html = html.replace('</head>', `<style>${file.css}</style></head>`);
    }

    // Inject JS
    if (file.js) {
      html = html.replace('</body>', `<script>${file.js}<\/script></body>`);
    }

    this.previewFrame.srcdoc = html;

    // Check if content is dark
    const isDark = file.css && (file.css.includes('background:') || file.css.includes('background-color:'));
    this.previewFrame.setAttribute('data-dark', isDark);
  }

  runCode() {
    this.updatePreview();
    this.showToast('Preview updated!', 'success');
  }

  openInNewWindow() {
    if (!this.currentFile) return;

    const file = this.files.get(this.currentFile);
    if (!file) return;

    let html = file.html;

    if (file.css) {
      html = html.replace('</head>', `<style>${file.css}</style></head>`);
    }

    if (file.js) {
      html = html.replace('</body>', `<script>${file.js}<\/script></body>`);
    }

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');

    this.showToast('Opened in new window!', 'success');
  }

  // Editor Features
  handleEditorInput() {
    this.updateLineNumbers();
    this.updateCharCount();
    this.autoSave();
  }

  syncScroll() {
    this.lineNumbers.scrollTop = this.codeEditor.scrollTop;
  }

  updateLineNumbers() {
    const lines = this.codeEditor.value.split('\n').length;
    const numbers = Array.from({ length: lines }, (_, i) => i + 1).join('\n');
    this.lineNumbers.textContent = numbers;
  }

  updateCharCount() {
    const chars = this.codeEditor.value.length;
    const lines = this.codeEditor.value.split('\n').length;
    this.charCount.textContent = `${chars.toLocaleString()} chars`;
    this.lineCount.textContent = `${lines} line${lines !== 1 ? 's' : ''}`;
  }

  handleEditorKeydown(e) {
    // Tab handling
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = this.codeEditor.selectionStart;
      const end = this.codeEditor.selectionEnd;
      const value = this.codeEditor.value;
      this.codeEditor.value = value.substring(0, start) + '  ' + value.substring(end);
      this.codeEditor.selectionStart = this.codeEditor.selectionEnd = start + 2;
      this.handleEditorInput();
    }
  }

  formatCode() {
    const value = this.codeEditor.value;

    try {
      // Simple formatting - not perfect but helps
      let formatted = value;

      if (this.currentType === 'html') {
        formatted = this.formatHTML(value);
      } else if (this.currentType === 'css') {
        formatted = this.formatCSS(value);
      } else if (this.currentType === 'js') {
        formatted = this.formatJS(value);
      }

      this.codeEditor.value = formatted;
      this.updateLineNumbers();
      this.updateCharCount();
      this.autoSave();
      this.showToast('Code formatted!', 'success');
    } catch (e) {
      this.showToast('Could not format code', 'error');
    }
  }

  formatHTML(html) {
    let formatted = '';
    const indent = '  ';
    let level = 0;

    html = html.replace(/>\s+</g, '><');

    html.split(/(<[^>]+>)/g).forEach(token => {
      if (!token.trim()) return;

      if (token.startsWith('</')) {
        level--;
        formatted += indent.repeat(level) + token + '\n';
      } else if (token.startsWith('<')) {
        formatted += indent.repeat(level) + token + '\n';
        if (!token.endsWith('/>') && !token.includes('</')) {
          level++;
        }
      } else {
        formatted += indent.repeat(level) + token + '\n';
      }
    });

    return formatted.trim();
  }

  formatCSS(css) {
    return css.replace(/\s*([{}:;,])\s*/g, '$1')
              .replace(/;\}/g, '}')
              .replace(/\{\s*/g, '{\n  ')
              .replace(/\}\s*/g, '\n}\n')
              .replace(/:\s*/g, ': ')
              .split('\n')
              .map(line => line.trim() ? '  ' + line : '')
              .join('\n');
  }

  formatJS(js) {
    let formatted = '';
    let indent = '';
    const lines = js.split('\n');

    lines.forEach(line => {
      line = line.trim();
      if (!line) return;

      if (line.includes('}') || line.includes(']')) {
        indent = indent.slice(0, -2);
      }

      formatted += indent + line + '\n';

      if (line.includes('{') || line.includes('[')) {
        indent += '  ';
      }
    });

    return formatted;
  }

  copyCode() {
    navigator.clipboard.writeText(this.codeEditor.value).then(() => {
      this.showToast('Code copied!', 'success');
    }).catch(() => {
      this.showToast('Could not copy code', 'error');
    });
  }

  clearCode() {
    if (confirm('Clear all code in this tab?')) {
      this.codeEditor.value = '';
      this.updateLineNumbers();
      this.updateCharCount();
      this.autoSave();
    }
  }

  // Syntax Highlighting
  highlightSyntax() {
    // Basic syntax highlighting is complex to implement
    // For now, we'll keep the textarea plain
    // A more advanced version would use a library like CodeMirror or Monaco
  }

  // UI Methods
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.sidebar.classList.toggle('open', this.isSidebarOpen);
  }

  closeSidebar() {
    this.isSidebarOpen = false;
    this.sidebar.classList.remove('open');
  }

  switchMobileView(view) {
    const editorContainer = document.getElementById('editorContainer');
    const previewContainer = document.querySelector('.preview-container');
    const sidebar = document.getElementById('sidebar');

    // Update mobile buttons
    this.mobileBar.querySelectorAll('.mobile-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === view);
    });

    if (view === 'editor') {
      editorContainer.classList.remove('hidden');
      previewContainer.classList.remove('hidden');
      sidebar.classList.remove('open');
    } else if (view === 'preview') {
      editorContainer.classList.add('hidden');
      previewContainer.classList.remove('hidden');
      sidebar.classList.remove('open');
    } else if (view === 'files') {
      editorContainer.classList.add('hidden');
      previewContainer.classList.add('hidden');
      sidebar.classList.add('open');
    }
  }

  showMoreOptions() {
    this.modalTitle.textContent = 'Options';
    this.modalContent.innerHTML = `
      <div class="input-group">
        <button class="btn-secondary" id="clearAllData" style="width:100%;justify-content:center;background:#ef4444;border-color:#ef4444;">
          Clear All Data
        </button>
        <p style="margin-top:8px;font-size:0.75rem;color:var(--text-muted);">
          This will delete all saved files and reset the editor.
        </p>
      </div>
    `;
    this.modalFooter.innerHTML = `
      <button class="btn-secondary" id="closeModal">Close</button>
    `;
    this.modalOverlay.classList.add('open');

    document.getElementById('clearAllData').addEventListener('click', () => {
      if (confirm('Are you sure you want to delete ALL files? This cannot be undone!')) {
        this.files.clear();
        localStorage.removeItem('zdit-files');
        this.createDefaultFile();
        this.renderFileList();
        this.loadFileContent();
        this.closeModal();
        this.showToast('All data cleared!', 'success');
      }
    });

    document.getElementById('closeModal').addEventListener('click', () => this.closeModal());
  }

  closeModal() {
    this.modalOverlay.classList.remove('open');
  }

  showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideIn 0.3s ease reverse';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  handleResize() {
    // Handle resize events if needed
  }
}

// Initialize editor when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.zdit = new ZditEditor();
});
