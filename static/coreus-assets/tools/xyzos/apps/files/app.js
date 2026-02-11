// File Manager App
const FilesApp = {
    currentPath: ['home', 'user'],
    fs: null,
    os: null,
    
    init() {
        this.fs = window.parent.FileSystem;
        this.os = window.parent.XyzosOS;
        
        if (!this.fs) {
            console.error('FileSystem not available from iframe');
            document.getElementById('filesGrid').innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #94a3b8;">File system unavailable</div>';
            return;
        }
        
        this.renderFiles();
        
        document.querySelectorAll('.files-nav-item').forEach(item => {
            const handleClick = (e) => {
                e.preventDefault();
                document.querySelectorAll('.files-nav-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                this.currentPath = this.fs.resolvePath(item.dataset.path);
                this.renderFiles();
            };
            item.addEventListener('click', handleClick);
            item.addEventListener('touchstart', handleClick, { passive: false });
        });
        
        this.bindButton('newFolderBtn', () => this.createFolder());
        this.bindButton('newFileBtn', () => this.createFile());
        this.bindButton('deleteBtn', () => this.deleteSelected());
        this.bindButton('refreshBtn', () => this.renderFiles());
        this.bindButton('goUpBtn', () => this.goUp());
    },
    
    bindButton(id, handler) {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener('click', handler);
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                handler();
            }, { passive: false });
        }
    },
    
    renderFiles() {
        const grid = document.getElementById('filesGrid');
        const pathDisplay = document.getElementById('currentPath');
        if (!grid) return;
        
        grid.innerHTML = '';
        
        if (!this.fs) {
            grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #94a3b8;">File system not available</div>';
            return;
        }
        
        pathDisplay.textContent = this.fs.getPathString();
        
        const files = this.fs.listDir(this.currentPath);
        
        if (!files || files.length === 0) {
            grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #94a3b8;">Empty directory</div>';
            return;
        }
        
        files.forEach(file => {
            const item = document.createElement('div');
            item.className = 'file-item';
            item.innerHTML = `
                <div class="icon">${file.isDir ? '📁' : '📄'}</div>
                <div class="name">${file.name}</div>
            `;
            
            const handleTap = (e) => {
                e.preventDefault();
                grid.querySelectorAll('.file-item').forEach(i => i.classList.remove('selected'));
                item.classList.add('selected');
            };
            
            const handleDoubleTap = (e) => {
                e.preventDefault();
                if (file.isDir) {
                    this.currentPath.push(file.name);
                    this.renderFiles();
                } else {
                    this.openFile(file.name);
                }
            };
            
            let lastTap = 0;
            item.addEventListener('click', (e) => {
                const currentTime = new Date().getTime();
                const tapLength = currentTime - lastTap;
                if (tapLength < 300 && tapLength > 0) {
                    handleDoubleTap(e);
                } else {
                    handleTap(e);
                }
                lastTap = currentTime;
            });
            
            item.addEventListener('touchstart', (e) => {
                handleTap(e);
            }, { passive: false });
            
            item.dataset.name = file.name;
            item.dataset.isDir = file.isDir;
            grid.appendChild(item);
        });
    },
    
    openFile(filename) {
        if (!this.fs) return;
        const fullPath = [...this.currentPath, filename].join('/');
        const content = this.fs.readFile(fullPath);
        if (content !== null) {
            this.openInNotepad(filename, content);
        }
    },
    
    openInNotepad(filename, content) {
        const notepadContent = `
            <div style="height: 100%; display: flex; flex-direction: column;">
                <div style="display: flex; gap: 0.5rem; padding: 0.5rem; background: #1e293b; border-bottom: 1px solid #334155;">
                    <button id="npSave" style="padding: 0.5rem 1rem; border: none; border-radius: 6px; background: #22c55e; color: white; cursor: pointer;">💾 Save</button>
                    <button id="npClose" style="padding: 0.5rem 1rem; border: none; border-radius: 6px; background: #ef4444; color: white; cursor: pointer;">✕ Close</button>
                </div>
                <div style="padding: 0.5rem; background: #0f172a; color: #94a3b8; font-size: 0.75rem; border-bottom: 1px solid #334155;">
                    Editing: ${filename}
                </div>
                <textarea id="npArea" style="flex: 1; width: 100%; padding: 1rem; border: none; background: #0f172a; color: #f8fafc; font-family: 'Consolas', monospace; font-size: 0.875rem; resize: none; outline: none;">${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</textarea>
            </div>
        `;
        
        if (window.parent.createWindow) {
            const winId = window.parent.createWindow(`Notepad - ${filename}`, '📝', notepadContent, { width: 600, height: 450 });
            
            setTimeout(() => {
                const win = document.getElementById(winId);
                if (!win) return;
                const saveBtn = win.querySelector('#npSave');
                const area = win.querySelector('#npArea');
                const closeBtn = win.querySelector('#npClose');
                
                if (saveBtn) {
                    saveBtn.addEventListener('click', () => {
                        const fullPath = [...this.currentPath, filename].join('/');
                        this.fs.writeFile(fullPath, area.value);
                        alert('File saved!');
                    });
                    saveBtn.addEventListener('touchstart', (e) => {
                        e.preventDefault();
                        const fullPath = [...this.currentPath, filename].join('/');
                        this.fs.writeFile(fullPath, area.value);
                        alert('File saved!');
                    }, { passive: false });
                }
                
                if (closeBtn) {
                    closeBtn.addEventListener('click', () => {
                        if (window.parent.closeWindow) window.parent.closeWindow(winId);
                    });
                    closeBtn.addEventListener('touchstart', (e) => {
                        e.preventDefault();
                        if (window.parent.closeWindow) window.parent.closeWindow(winId);
                    }, { passive: false });
                }
            }, 100);
        }
    },
    
    createFolder() {
        const name = prompt('Enter folder name:');
        if (name && this.fs) {
            if (this.fs.createDir(name)) {
                this.renderFiles();
            } else {
                alert('Could not create folder. Name may already exist.');
            }
        }
    },
    
    createFile() {
        const name = prompt('Enter file name:');
        if (name && this.fs) {
            if (this.fs.createFile(name, '')) {
                this.renderFiles();
                this.openFile(name);
            } else {
                alert('Could not create file. Name may already exist.');
            }
        }
    },
    
    deleteSelected() {
        const selected = document.querySelector('.file-item.selected');
        if (selected) {
            const name = selected.dataset.name;
            const isDir = selected.dataset.isDir === 'true';
            if (confirm(`Delete ${isDir ? 'folder' : 'file'} "${name}"?`)) {
                if (this.fs && this.fs.deleteItem(name)) {
                    this.renderFiles();
                } else {
                    alert('Could not delete item.');
                }
            }
        } else {
            alert('Select an item to delete.');
        }
    },
    
    goUp() {
        if (this.currentPath.length > 0) {
            this.currentPath.pop();
            this.renderFiles();
        }
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    FilesApp.init();
});
