// Xyzos OS - Main Operating System JavaScript

// ==================== Global State ====================
const XyzosOS = {
    version: '1.0.0',
    isRunning: false,
    currentUser: 'user',
    windows: [],
    activeWindow: null,
    startMenuOpen: false,
    settings: {}
};

// ==================== File System ====================
const FileSystem = {
    STORAGE_KEY: 'xyzos_filesystem',
    currentPath: ['home', 'user'],
    
    init() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                XyzosOS.fileSystem = JSON.parse(stored);
            } else {
                this.createDefaultFS();
            }
        } catch (e) {
            this.createDefaultFS();
        }
    },
    
    createDefaultFS() {
        XyzosOS.fileSystem = {
            'home': {
                'user': {
                    'Documents': {
                        'readme.txt': 'Welcome to Xyzos OS!'
                    },
                    'Pictures': {},
                    'Music': {},
                    'Downloads': {},
                    'Videos': {}
                }
            }
        };
        this.save();
    },
    
    save() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(XyzosOS.fileSystem));
    },
    
    getNode(path) {
        let node = XyzosOS.fileSystem;
        for (const part of path) {
            if (node && typeof node === 'object' && part in node) {
                node = node[part];
            } else {
                return null;
            }
        }
        return node;
    },
    
    getPathString() {
        return '/' + this.currentPath.join('/');
    },
    
    changeDir(name) {
        if (name === '/' || name === '~') {
            this.currentPath = ['home', 'user'];
            return true;
        }
        if (name === '..') {
            if (this.currentPath.length > 0) {
                this.currentPath.pop();
                return true;
            }
            return false;
        }
        const node = this.getNode(this.currentPath);
        if (node && typeof node === 'object' && name in node && typeof node[name] === 'object') {
            this.currentPath.push(name);
            return true;
        }
        return false;
    },
    
    listDir(path = null) {
        const targetPath = path ? this.resolvePath(path) : [...this.currentPath];
        const node = this.getNode(targetPath);
        if (node && typeof node === 'object') {
            return Object.entries(node).map(([name, value]) => ({
                name,
                isDir: typeof value === 'object'
            }));
        }
        return [];
    },
    
    resolvePath(path) {
        if (!path) return [...this.currentPath];
        if (Array.isArray(path)) return path;
        if (path.startsWith('/')) {
            const parts = path.split('/').filter(p => p);
            if (parts[0] === 'home') return ['home', ...parts.slice(1)];
            return parts;
        }
        if (path.startsWith('~')) {
            return ['home', 'user', ...path.slice(1).split('/').filter(p => p)];
        }
        return [...this.currentPath, ...path.split('/').filter(p => p)];
    },
    
    readFile(path) {
        const parts = path.split('/').filter(p => p);
        let node = XyzosOS.fileSystem;
        for (const part of parts) {
            if (node && typeof node === 'object' && part in node) {
                node = node[part];
            } else {
                return null;
            }
        }
        return typeof node === 'string' ? node : null;
    },
    
    writeFile(path, content) {
        const parts = path.split('/').filter(p => p);
        const filename = parts.pop();
        const targetPath = this.resolvePath(parts.join('/'));
        const node = this.getNode(targetPath);
        if (node && typeof node === 'object') {
            node[filename] = content;
            this.save();
            return true;
        }
        return false;
    },
    
    createFile(name, content = '') {
        const node = this.getNode(this.currentPath);
        if (node && typeof node === 'object' && !(name in node)) {
            node[name] = content;
            this.save();
            return true;
        }
        return false;
    },
    
    createDir(name) {
        const node = this.getNode(this.currentPath);
        if (node && typeof node === 'object' && !(name in node)) {
            node[name] = {};
            this.save();
            return true;
        }
        return false;
    },
    
    deleteItem(name) {
        const node = this.getNode(this.currentPath);
        if (node && typeof node === 'object' && name in node) {
            delete node[name];
            this.save();
            return true;
        }
        return false;
    },
    
    copyItem(src, dst) {
        const srcNode = this.readFile(src);
        if (srcNode !== null) {
            return this.writeFile(dst, srcNode);
        }
        return false;
    },
    
    moveItem(src, dst) {
        if (this.copyItem(src, dst)) {
            const srcParts = src.split('/').filter(p => p);
            const filename = srcParts.pop();
            const srcNode = this.getNode(this.resolvePath(srcParts.join('/')));
            if (srcNode && filename in srcNode) {
                delete srcNode[filename];
                this.save();
                return true;
            }
        }
        return false;
    },
    
    isDir(path) {
        const node = this.getNode(this.resolvePath(path));
        return node && typeof node === 'object';
    }
};

// ==================== Apps Manifest ====================
let appsManifest = { apps: [] };

async function loadAppsManifest() {
    try {
        const response = await fetch('apps/manifest.json');
        if (response.ok) {
            appsManifest = await response.json();
            return;
        }
    } catch (e) {}
    // Default apps
    appsManifest = {
        apps: [
            { id: 'terminal', name: 'yterminal', icon: '💻', path: 'terminal/', description: 'Command line', category: 'System' },
            { id: 'files', name: 'File Manager', icon: '📁', path: 'files/', description: 'Browse files', category: 'Utilities' },
            { id: 'settings', name: 'Settings', icon: '⚙️', path: 'settings/', description: 'System settings', category: 'System' },
            { id: 'calculator', name: 'Calculator', icon: '🔢', path: 'calculator/', description: 'Calculator', category: 'Utilities' },
            { id: 'paint', name: 'Paint', icon: '🎨', path: 'paint/', description: 'Drawing app', category: 'Creativity' },
            { id: 'snake', name: 'Snake', icon: '🐍', path: 'snake/', description: 'Snake game', category: 'Games' },
            { id: 'tetris', name: 'Tetris', icon: '🧱', path: 'tetris/', description: 'Tetris game', category: 'Games' },
            { id: 'notepad', name: 'Notepad', icon: '📝', path: 'notepad/', description: 'Text editor', category: 'Utilities' },
            { id: 'appstore', name: 'App Store', icon: '📦', path: 'appstore/', description: 'App store', category: 'System' },
            { id: 'browser', name: 'Browser', icon: '🌐', path: 'browser/', description: 'Web browser', category: 'Internet' },
            { id: 'weather', name: 'Weather', icon: '🌤️', path: 'weather/', description: 'Weather app', category: 'Utilities' },
            { id: 'clock', name: 'Clock', icon: '⏰', path: 'clock/', description: 'Clock app', category: 'Utilities' },
            { id: 'about', name: 'About', icon: 'ℹ️', path: 'about/', description: 'About OS', category: 'System' },
            { id: 'gallery', name: 'Gallery', icon: '🖼️', path: 'gallery/', description: 'Photo gallery', category: 'Multimedia' },
            { id: 'music', name: 'Music', icon: '🎵', path: 'music/', description: 'Music player', category: 'Multimedia' },
            { id: 'game2048', name: '2048', icon: '🎲', path: '2048/', description: '2048 game', category: 'Games' },
            { id: 'chess', name: 'Chess', icon: '♟️', path: 'chess/', description: 'Chess game', category: 'Games' },
            { id: 'memory', name: 'Memory', icon: '🧠', path: 'memory/', description: 'Memory game', category: 'Games' },
            { id: 'tictactoe', name: 'Tic-Tac-Toe', icon: '❌', path: 'tictactoe/', description: 'Tic-Tac-Toe', category: 'Games' }
        ]
    };
}

// ==================== Window Management ====================
let windowIdCounter = 0;

function createWindow(title, icon, content, options = {}) {
    const id = 'window-' + (++windowIdCounter);
    const container = document.getElementById('windowsContainer');
    
    const win = document.createElement('div');
    win.className = 'window';
    win.id = id;
    win.style.width = (options.width || 600) + 'px';
    win.style.height = (options.height || 400) + 'px';
    win.style.left = (options.left || 100 + windowIdCounter * 30) + 'px';
    win.style.top = (options.top || 50 + windowIdCounter * 30) + 'px';
    
    win.innerHTML = `
        <div class="window-header">
            <div class="window-controls">
                <div class="window-control close" data-action="close"></div>
                <div class="window-control minimize" data-action="minimize"></div>
                <div class="window-control maximize" data-action="maximize"></div>
            </div>
            <span class="window-title">${icon} ${title}</span>
        </div>
        <div class="window-content">${content}</div>
        <div class="window-resize"></div>
    `;
    
    container.appendChild(win);
    
    win.querySelector('.window-control.close').addEventListener('click', () => closeWindow(id));
    win.querySelector('.window-control.minimize').addEventListener('click', () => minimizeWindow(id));
    win.querySelector('.window-control.maximize').addEventListener('click', () => maximizeWindow(id));
    
    makeDraggable(win);
    makeResizable(win);
    win.addEventListener('mousedown', () => focusWindow(id));
    win.addEventListener('touchstart', () => focusWindow(id));
    
    addToTaskbar(id, title, icon);
    focusWindow(id);
    
    return id;
}

function makeDraggable(win) {
    const header = win.querySelector('.window-header');
    let isDragging = false;
    let startX, startY, startLeft, startTop;
    
    header.addEventListener('mousedown', dragStart);
    header.addEventListener('touchstart', dragStart, { passive: false });
    
    function dragStart(e) {
        if (e.target.closest('.window-controls')) return;
        e.preventDefault();
        isDragging = true;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        startX = clientX;
        startY = clientY;
        startLeft = win.offsetLeft;
        startTop = win.offsetTop;
        win.style.zIndex = getMaxZIndex() + 1;
        
        document.addEventListener('mousemove', dragMove);
        document.addEventListener('touchmove', dragMove, { passive: false });
        document.addEventListener('mouseup', dragEnd);
        document.addEventListener('touchend', dragEnd);
    }
    
    function dragMove(e) {
        if (!isDragging) return;
        e.preventDefault();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        win.style.left = (startLeft + (clientX - startX)) + 'px';
        win.style.top = (startTop + (clientY - startY)) + 'px';
    }
    
    function dragEnd() {
        isDragging = false;
        document.removeEventListener('mousemove', dragMove);
        document.removeEventListener('touchmove', dragMove);
        document.removeEventListener('mouseup', dragEnd);
        document.removeEventListener('touchend', dragEnd);
    }
}

function makeResizable(win) {
    const resizer = win.querySelector('.window-resize');
    let isResizing = false;
    let startX, startY, startWidth, startHeight;
    
    resizer.addEventListener('mousedown', resizeStart);
    resizer.addEventListener('touchstart', resizeStart, { passive: false });
    
    function resizeStart(e) {
        e.preventDefault();
        isResizing = true;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        startX = clientX;
        startY = clientY;
        startWidth = win.offsetWidth;
        startHeight = win.offsetHeight;
        
        document.addEventListener('mousemove', resizeMove);
        document.addEventListener('touchmove', resizeMove, { passive: false });
        document.addEventListener('mouseup', resizeEnd);
        document.addEventListener('touchend', resizeEnd);
    }
    
    function resizeMove(e) {
        if (!isResizing) return;
        e.preventDefault();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        win.style.width = Math.max(300, startWidth + (clientX - startX)) + 'px';
        win.style.height = Math.max(200, startHeight + (clientY - startY)) + 'px';
    }
    
    function resizeEnd() {
        isResizing = false;
        document.removeEventListener('mousemove', resizeMove);
        document.removeEventListener('touchmove', resizeMove);
        document.removeEventListener('mouseup', resizeEnd);
        document.removeEventListener('touchend', resizeEnd);
    }
}

function closeWindow(id) {
    const win = document.getElementById(id);
    if (win) win.remove();
    removeFromTaskbar(id);
}

function minimizeWindow(id) {
    const win = document.getElementById(id);
    if (win) win.classList.add('minimized');
}

function maximizeWindow(id) {
    const win = document.getElementById(id);
    if (win) win.classList.toggle('maximized');
}

function focusWindow(id) {
    document.querySelectorAll('.window').forEach(w => {
        w.style.zIndex = '1000';
        w.classList.remove('active');
    });
    const win = document.getElementById(id);
    if (win) {
        win.style.zIndex = '5000';
        win.classList.remove('minimized');
        win.classList.add('active');
    }
    updateTaskbarActive(id);
}

function getMaxZIndex() {
    let max = 1000;
    document.querySelectorAll('.window').forEach(w => {
        const z = parseInt(w.style.zIndex) || 1000;
        if (z > max) max = z;
    });
    return max;
}

function addToTaskbar(id, title, icon) {
    const taskbarApps = document.getElementById('taskbarApps');
    const app = document.createElement('button');
    app.className = 'taskbar-app running';
    app.id = 'taskbar-' + id;
    app.innerHTML = icon;
    app.title = title;
    app.addEventListener('click', () => {
        const win = document.getElementById(id);
        if (win.classList.contains('minimized')) {
            focusWindow(id);
        } else if (win.classList.contains('active')) {
            minimizeWindow(id);
        } else {
            focusWindow(id);
        }
    });
    taskbarApps.appendChild(app);
}

function removeFromTaskbar(id) {
    const app = document.getElementById('taskbar-' + id);
    if (app) app.remove();
}

function updateTaskbarActive(id) {
    document.querySelectorAll('.taskbar-app').forEach(app => {
        app.classList.remove('active');
    });
    const active = document.getElementById('taskbar-' + id);
    if (active) active.classList.add('active');
}

// ==================== Bootloader ====================
let selectedBootOption = 0;
const bootOptions = ['graphical', 'cli', 'safe', 'recovery', 'bios'];
let inRecoveryMode = false;
let inBIOS = false;
let inSafeMode = false;
let recoverySelected = 0;
const recoveryActions = ['system-restore', 'file-recovery', 'disk-check', 'terminal', 'boot-normal', 'shutdown'];

function initBootloader() {
    FileSystem.init();
    setupBootOptions();
    
    // Auto-start boot progress animation
    setTimeout(() => {
        const progressBar = document.querySelector('.boot-progress-fill');
        if (progressBar) {
            progressBar.style.width = '0%';
            animateProgress(progressBar, 0, 15, 100);
        }
    }, 100);
}

function animateProgress(element, current, max, targetWidth) {
    if (current <= max) {
        element.style.width = (current / max * targetWidth) + '%';
        setTimeout(() => animateProgress(element, current + 1, max, targetWidth), 100);
    }
}

function setupBootOptions() {
    const options = document.querySelectorAll('.boot-option');
    
    function selectOption(index) {
        selectedBootOption = index;
        options.forEach((opt, i) => {
            opt.classList.toggle('selected', i === index);
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const bootloader = document.getElementById('bootloader');
        const recoveryMode = document.getElementById('recoveryMode');
        const biosSetup = document.getElementById('biosSetup');
        const safeMode = document.getElementById('safeMode');
        
        // Recovery mode navigation
        if (inRecoveryMode && !recoveryMode.classList.contains('hidden')) {
            e.preventDefault();
            if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                recoverySelected = (recoverySelected - 1 + recoveryActions.length) % recoveryActions.length;
                updateRecoverySelection();
            } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                recoverySelected = (recoverySelected + 1) % recoveryActions.length;
                updateRecoverySelection();
            } else if (e.key === 'Enter') {
                executeRecoveryAction(recoveryActions[recoverySelected]);
            } else if (e.key === 'Escape') {
                exitRecoveryMode();
            }
            return;
        }
        
        // BIOS navigation
        if (inBIOS && !biosSetup.classList.contains('hidden')) {
            handleBIOSNavigation(e);
            return;
        }
        
        // Bootloader navigation
        if (!bootloader || bootloader.classList.contains('hidden')) return;
        
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            selectOption((selectedBootOption - 1 + bootOptions.length) % bootOptions.length);
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            selectOption((selectedBootOption + 1) % bootOptions.length);
        } else if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            bootSystem(bootOptions[selectedBootOption]);
        } else if (e.key === 'F2') {
            selectOption(1);
            bootSystem('cli');
        } else if (e.key === 'F5') {
            selectOption(2);
            bootSystem('safe');
        } else if (e.key === 'F8') {
            selectOption(3);
            bootSystem('recovery');
        } else if (e.key === 'Delete' || e.key === 'Del') {
            selectOption(4);
            bootSystem('bios');
        }
    });
    
    // Touch/click navigation for boot options
    options.forEach((option, index) => {
        option.addEventListener('click', () => {
            selectOption(index);
            bootSystem(bootOptions[index]);
        });
        option.addEventListener('touchstart', (e) => {
            e.preventDefault();
            selectOption(index);
            bootSystem(bootOptions[index]);
        }, { passive: false });
    });
    
    selectOption(0);
}

function updateRecoverySelection() {
    const options = document.querySelectorAll('.recovery-option');
    options.forEach((opt, i) => {
        opt.classList.toggle('selected', i === recoverySelected);
    });
}

function executeRecoveryAction(action) {
    const bootloader = document.getElementById('bootloader');
    const recoveryMode = document.getElementById('recoveryMode');
    
    recoveryMode.classList.add('hidden');
    inRecoveryMode = false;
    
    switch(action) {
        case 'system-restore':
            showBootProgress('Performing system restore...', () => {
                bootloader.classList.add('hidden');
                const desktop = document.getElementById('desktop');
                desktop.classList.remove('hidden');
                initDesktop();
                showLockScreen();
            });
            break;
        case 'file-recovery':
            showBootProgress('Starting file recovery...', () => {
                bootloader.classList.add('hidden');
                const desktop = document.getElementById('desktop');
                desktop.classList.remove('hidden');
                initDesktop();
                showLockScreen();
            });
            break;
        case 'disk-check':
            showBootProgress('Checking disk for errors...', () => {
                bootloader.classList.add('hidden');
                const desktop = document.getElementById('desktop');
                desktop.classList.remove('hidden');
                initDesktop();
                showLockScreen();
            });
            break;
        case 'terminal':
            bootloader.classList.add('hidden');
            const cliBoot = document.getElementById('cliBoot');
            cliBoot.classList.remove('hidden');
            initCLIBoot();
            break;
        case 'boot-normal':
            bootSystem('graphical');
            break;
        case 'shutdown':
            document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#000;color:#666;font-family:sans-serif;">System powered off</div>';
            break;
    }
}

function exitRecoveryMode() {
    const recoveryMode = document.getElementById('recoveryMode');
    const bootloader = document.getElementById('bootloader');
    const bootOptionsEl = document.getElementById('bootOptions');
    const bootSystemInfo = document.querySelector('.boot-system-info');
    const bootFooter = document.querySelector('.boot-footer');
    
    recoveryMode.classList.add('hidden');
    inRecoveryMode = false;
    bootloader.classList.remove('hidden');
    if (bootOptionsEl) bootOptionsEl.style.display = '';
    if (bootSystemInfo) bootSystemInfo.style.display = '';
    if (bootFooter) bootFooter.style.display = '';
}

function setupRecoveryNavigation() {
    const options = document.querySelectorAll('.recovery-option');
    
    options.forEach((option, index) => {
        option.addEventListener('click', () => {
            recoverySelected = index;
            updateRecoverySelection();
            executeRecoveryAction(recoveryActions[index]);
        });
        option.addEventListener('touchstart', (e) => {
            e.preventDefault();
            recoverySelected = index;
            updateRecoverySelection();
            executeRecoveryAction(recoveryActions[index]);
        }, { passive: false });
    });
    
    updateRecoverySelection();
}

// BIOS Setup
function bootSystem(mode) {
    const bootloader = document.getElementById('bootloader');
    
    if (mode === 'recovery') {
        bootloader.classList.add('hidden');
        const recoveryMode = document.getElementById('recoveryMode');
        recoveryMode.classList.remove('hidden');
        inRecoveryMode = true;
        setupRecoveryNavigation();
        return;
    }
    
    if (mode === 'bios') {
        bootloader.classList.add('hidden');
        const biosSetup = document.getElementById('biosSetup');
        biosSetup.classList.remove('hidden');
        inBIOS = true;
        setupBIOS();
        return;
    }
    
    if (mode === 'safe') {
        bootloader.classList.add('hidden');
        const safeMode = document.getElementById('safeMode');
        safeMode.classList.remove('hidden');
        inSafeMode = true;
        startSafeModeBoot();
        return;
    }
    
    const cliBoot = document.getElementById('cliBoot');
    const desktop = document.getElementById('desktop');
    const bootLoading = document.getElementById('bootLoading');
    const bootStatus = document.getElementById('bootStatus');
    const bootPercent = document.getElementById('bootPercent');
    const bootProgressFill = document.getElementById('bootProgressFill');
    const loadingDetails = document.getElementById('loadingDetails');
    const bootOptionsEl = document.getElementById('bootOptions');
    const bootSystemInfo = document.querySelector('.boot-system-info');
    const bootFooter = document.querySelector('.boot-footer');

    if (!bootLoading || !bootProgressFill) {
        bootloader.classList.add('hidden');
        desktop.classList.remove('hidden');
        initDesktop();
        showLockScreen();
        return;
    }

    if (bootOptionsEl) bootOptionsEl.style.display = 'none';
    if (bootSystemInfo) bootSystemInfo.style.display = 'none';
    if (bootFooter) bootFooter.style.display = 'none';
    bootLoading.classList.remove('hidden');

    let bootMessages;
    let intervalTime;

    if (mode === 'cli') {
        bootMessages = [
            'Initializing bootloader...',
            'Loading kernel...',
            'Initializing hardware...',
            'Mounting file system...',
            'Starting system services...',
            'Loading terminal environment...'
        ];
        intervalTime = 200;
    } else {
        bootMessages = [
            'Initializing kernel...',
            'Loading device drivers...',
            'Initializing memory management...',
            'Starting system services...',
            'Loading graphics subsystem...',
            'Mounting file system...',
            'Initializing network...',
            'Loading desktop environment...',
            'Starting window manager...',
            'Finalizing startup...'
        ];
        intervalTime = 150;
    }

    let msgIndex = 0;

    function updateBoot(step) {
        if (msgIndex < bootMessages.length) {
            const msg = bootMessages[msgIndex];
            if (bootStatus) bootStatus.textContent = msg;
            if (loadingDetails) loadingDetails.textContent = msg;
            const percent = Math.round((msgIndex + 1) / bootMessages.length * 100);
            if (bootPercent) bootPercent.textContent = percent + '%';
            if (bootProgressFill) bootProgressFill.style.width = percent + '%';
            msgIndex++;
        } else {
            clearInterval(step);
            bootloader.classList.add('hidden');
            bootLoading.classList.add('hidden');

            if (mode === 'cli') {
                cliBoot.classList.remove('hidden');
                initCLIBoot();
            } else {
                desktop.classList.remove('hidden');
                initDesktop();
                showLockScreen();
            }
        }
    }

    const bootInterval = setInterval(() => {
        try {
            updateBoot(bootInterval);
        } catch (e) {
            clearInterval(bootInterval);
        }
    }, intervalTime);
}

function showBootProgress(message, callback) {
    const bootloader = document.getElementById('bootloader');
    const bootLoading = document.getElementById('bootLoading');
    const bootStatus = document.getElementById('bootStatus');
    const bootPercent = document.getElementById('bootPercent');
    const bootProgressFill = document.getElementById('bootProgressFill');
    const loadingDetails = document.getElementById('loadingDetails');
    const bootOptionsEl = document.getElementById('bootOptions');
    const bootSystemInfo = document.querySelector('.boot-system-info');
    const bootFooter = document.querySelector('.boot-footer');
    
    bootloader.classList.remove('hidden');
    
    if (bootOptionsEl) bootOptionsEl.style.display = 'none';
    if (bootSystemInfo) bootSystemInfo.style.display = 'none';
    if (bootFooter) bootFooter.style.display = 'none';
    bootLoading.classList.remove('hidden');
    
    if (bootStatus) bootStatus.textContent = message;
    if (loadingDetails) loadingDetails.textContent = message;
    
    let progress = 0;
    const progressInterval = setInterval(() => {
        progress += 5;
        if (bootPercent) bootPercent.textContent = progress + '%';
        if (bootProgressFill) bootProgressFill.style.width = progress + '%';
        
        if (progress >= 100) {
            clearInterval(progressInterval);
            bootLoading.classList.add('hidden');
            callback();
        }
    }, 50);
}

// BIOS Setup functions
let biosSelectedSection = 'main';

function setupBIOS() {
    updateBIOSDateTime();
    setInterval(updateBIOSDateTime, 1000);
    
    const menuItems = document.querySelectorAll('.bios-menu-item');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const section = item.dataset.section;
            switchBIOSSection(section);
        });
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const section = item.dataset.section;
                switchBIOSSection(section);
            }
        });
    });
}

function updateBIOSDateTime() {
    const now = new Date();
    const dateEl = document.getElementById('biosDateDisplay');
    const timeEl = document.getElementById('biosTimeDisplay');
    const setupTime = document.getElementById('biosSetupTime');
    
    if (dateEl) dateEl.textContent = now.toLocaleDateString();
    if (timeEl) timeEl.textContent = now.toLocaleTimeString();
    if (setupTime) setupTime.textContent = now.toLocaleTimeString();
}

function switchBIOSSection(section) {
    biosSelectedSection = section;
    
    // Update menu selection
    document.querySelectorAll('.bios-menu-item').forEach(item => {
        item.classList.toggle('selected', item.dataset.section === section);
    });
    
    // Show/hide sections
    document.querySelectorAll('.bios-section').forEach(sec => {
        sec.classList.add('hidden');
    });
    
    const sectionEl = document.getElementById('biosSection-' + section);
    if (sectionEl) sectionEl.classList.remove('hidden');
}

function handleBIOSNavigation(e) {
    const sections = ['main', 'advanced', 'boot', 'security', 'exit'];
    let currentIndex = sections.indexOf(biosSelectedSection);
    
    if (e.key === 'ArrowRight' || e.key === 'Tab') {
        e.preventDefault();
        currentIndex = (currentIndex + 1) % sections.length;
        switchBIOSSection(sections[currentIndex]);
    } else if (e.key === 'ArrowLeft' || e.key === 'Shift+Tab') {
        e.preventDefault();
        currentIndex = (currentIndex - 1 + sections.length) % sections.length;
        switchBIOSSection(sections[currentIndex]);
    } else if (e.key === 'F10') {
        exitBIOS('save');
    } else if (e.key === 'Escape') {
        exitBIOS('discard');
    }
}

function exitBIOS(action) {
    const biosSetup = document.getElementById('biosSetup');
    const bootloader = document.getElementById('bootloader');
    
    biosSetup.classList.add('hidden');
    inBIOS = false;
    bootloader.classList.remove('hidden');
    
    // Reset to first boot option
    selectedBootOption = 0;
    const options = document.querySelectorAll('.boot-option');
    options.forEach((opt, i) => {
        opt.classList.toggle('selected', i === 0);
    });
}

// Safe Mode
function startSafeModeBoot() {
    const progressFill = document.getElementById('safeProgressFill');
    const statusEl = document.getElementById('safeStatus');
    
    const steps = [
        'Loading minimal kernel...',
        'Initializing essential drivers...',
        'Starting core services...',
        'Loading basic graphics...',
        'Finalizing safe mode boot...'
    ];
    
    let step = 0;
    let progress = 0;
    
    const safeInterval = setInterval(() => {
        progress += 2;
        if (progressFill) progressFill.style.width = progress + '%';
        
        if (progress >= 100) {
            clearInterval(safeInterval);
            // Boot to desktop with minimal features
            const safeMode = document.getElementById('safeMode');
            safeMode.classList.add('hidden');
            inSafeMode = false;
            
            const desktop = document.getElementById('desktop');
            desktop.classList.remove('hidden');
            initDesktop(true); // Safe mode
            showLockScreen();
        } else if (progress % 20 === 0 && step < steps.length) {
            if (statusEl) statusEl.textContent = steps[step];
            step++;
        }
    }, 50);
}

function continueSafeMode() {
    // Already running in the interval
}

function abortSafeMode() {
    const safeMode = document.getElementById('safeMode');
    safeMode.classList.add('hidden');
    inSafeMode = false;
    
    const bootloader = document.getElementById('bootloader');
    bootloader.classList.remove('hidden');
    
    selectedBootOption = 2;
    const options = document.querySelectorAll('.boot-option');
    options.forEach((opt, i) => {
        opt.classList.toggle('selected', i === 2);
    });
}

// ==================== CLI Boot ====================
function initCLIBoot() {
    const cliOutput = document.getElementById('cliOutput');
    const cliInput = document.getElementById('cliInput');
    
    if (!cliOutput || !cliInput) return;
    
    // Global function for mobile keyboard hint
    window.focusCLIInput = function() {
        cliInput.focus();
        cliInput.click();
        const hint = document.getElementById('cliKeyboardHint');
        if (hint) hint.style.display = 'none';
    };
    
    const bootMessages = [
        'Xyzos OS Boot Loader v1.0.0',
        '================================',
        'Checking memory... OK',
        'Loading kernel... OK',
        'Initializing hardware... OK',
        'Mounting file system... OK',
        'Starting system services... OK',
        ''
    ];
    
    let msgIndex = 0;
    
    function typeNextMessage() {
        if (msgIndex < bootMessages.length) {
            const line = document.createElement('div');
            line.className = 'cli-line';
            line.textContent = bootMessages[msgIndex];
            cliOutput.appendChild(line);
            cliOutput.scrollTop = cliOutput.scrollHeight;
            msgIndex++;
            setTimeout(typeNextMessage, 100);
        } else {
            // Ready prompt
            const promptLine = document.createElement('div');
            promptLine.className = 'cli-line';
            promptLine.innerHTML = '<span style="color:#00ff00">user@xyzos:~$</span> <span style="color:#00ff00;animation:blink 1s infinite">_</span>';
            cliOutput.appendChild(promptLine);
            cliOutput.scrollTop = cliOutput.scrollHeight;
            
            // Try to focus input (may not work on mobile without user interaction)
            setTimeout(() => {
                const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                if (isMobile) {
                    // Show hint, user needs to tap
                    const hint = document.getElementById('cliKeyboardHint');
                    if (hint) hint.style.display = 'block';
                } else {
                    cliInput.focus();
                }
            }, 100);
        }
    }
    
    typeNextMessage();
    
    let commandHistory = [];
    let historyIndex = -1;
    
    cliInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = cliInput.value.trim();
            if (cmd) {
                commandHistory.push(cmd);
                historyIndex = commandHistory.length;
                processCLICommand(cmd);
            }
            cliInput.value = '';
        } else if (e.key === 'ArrowUp') {
            if (historyIndex > 0) {
                historyIndex--;
                cliInput.value = commandHistory[historyIndex];
            }
            e.preventDefault();
        } else if (e.key === 'ArrowDown') {
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                cliInput.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                cliInput.value = '';
            }
            e.preventDefault();
        }
    });
}

function processCLICommand(cmd) {
    const cliOutput = document.getElementById('cliOutput');
    const cliInput = document.getElementById('cliInput');
    
    const cmdLine = document.createElement('div');
    cmdLine.className = 'cli-line';
    cmdLine.textContent = 'user@xyzos:~$ ' + cmd;
    cliOutput.appendChild(cmdLine);
    
    const parts = cmd.toLowerCase().split(' ');
    const command = parts[0];
    const args = parts.slice(1);
    
    let output = '';
    
    switch (command) {
        case 'help': output = 'Available commands: help, clear, reboot, shutdown, exit, date, whoami, hostname, ls, cd, pwd, cat, mkdir, touch, rm, gui'; break;
        case 'clear': cliOutput.innerHTML = ''; return;
        case 'exit': document.getElementById('cliBoot').classList.add('hidden'); document.getElementById('bootloader').classList.remove('hidden'); return;
        case 'gui':
            document.getElementById('cliBoot').classList.add('hidden');
            const desktop = document.getElementById('desktop');
            desktop.classList.remove('hidden');
            initDesktop(false);
            showLockScreen();
            return;
        case 'reboot': output = 'Rebooting...'; setTimeout(() => location.reload(), 1000); break;
        case 'shutdown': 
            output = 'Shutting down...';
            setTimeout(() => { 
                document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#000;color:#666;font-family:sans-serif;">System powered off</div>'; 
            }, 1000); 
            break;
        case 'date': output = new Date().toString(); break;
        case 'whoami': output = XyzosOS.currentUser; break;
        case 'hostname': output = 'xyzos'; break;
        case 'ls': output = 'Documents  Downloads  Music  Pictures  Videos'; break;
        case 'pwd': output = FileSystem.getPathString(); break;
        case 'cd': if (FileSystem.changeDir(args[0])) output = ''; else output = 'No such directory'; break;
        case 'cat': output = FileSystem.readFile(args[0]) || 'File not found'; break;
        case 'mkdir': output = FileSystem.createDir(args[0]) ? 'Created' : 'Failed'; break;
        case 'touch': output = FileSystem.createFile(args[0], '') ? 'Created' : 'Failed'; break;
        case 'rm': output = FileSystem.deleteItem(args[0]) ? 'Deleted' : 'Failed'; break;
        default: output = command + ': command not found';
    }
    
    if (output) {
        const outputLine = document.createElement('div');
        outputLine.className = 'cli-line';
        outputLine.textContent = output;
        cliOutput.appendChild(outputLine);
    }
    
    const promptLine = document.createElement('div');
    promptLine.className = 'cli-line';
    promptLine.innerHTML = '<span style="color:#00ff00">user@xyzos:~$</span> <span style="color:#00ff00;animation:blink 1s infinite">_</span>';
    cliOutput.appendChild(promptLine);
    cliOutput.scrollTop = cliOutput.scrollHeight;
    cliInput.focus();
}

// ==================== Desktop ====================
function initDesktop(safeMode = false) {
    loadAppsManifest().then(() => {
        setupTaskbar();
        setupStartMenu();
        setupDesktopIcons();
        setupContextMenu();
        setupClock();
        loadSettings();
        
        if (safeMode) {
            XyzosOS.settings.safeMode = true;
        }
    });
}

function setupTaskbar() {
    const startBtn = document.getElementById('startBtn');
    const startMenu = document.getElementById('startMenu');
    
    startBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        startMenu.classList.toggle('hidden');
        XyzosOS.startMenuOpen = !XyzosOS.startMenuOpen;
    });
    
    startBtn.addEventListener('touchstart', (e) => {
        e.stopPropagation();
        startMenu.classList.toggle('hidden');
        XyzosOS.startMenuOpen = !XyzosOS.startMenuOpen;
    }, { passive: false });
    
    document.addEventListener('click', (e) => {
        if (!startMenu.contains(e.target) && !startBtn.contains(e.target)) {
            startMenu.classList.add('hidden');
            XyzosOS.startMenuOpen = false;
        }
    });
}

function setupStartMenu() {
    const startMenuApps = document.getElementById('startMenuApps');
    
    appsManifest.apps.forEach(app => {
        const item = document.createElement('div');
        item.className = 'start-menu-app';
        item.innerHTML = '<span class="icon">' + app.icon + '</span><span class="name">' + app.name + '</span>';
        item.addEventListener('click', () => {
            openAppById(app.id);
            document.getElementById('startMenu').classList.add('hidden');
        });
        item.addEventListener('touchstart', (e) => {
            e.preventDefault();
            openAppById(app.id);
            document.getElementById('startMenu').classList.add('hidden');
        }, { passive: false });
        startMenuApps.appendChild(item);
    });
    
    const appSearch = document.getElementById('appSearch');
    if (appSearch) {
        appSearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            startMenuApps.querySelectorAll('.start-menu-app').forEach(item => {
                const name = item.querySelector('.name').textContent.toLowerCase();
                item.style.display = name.includes(query) ? 'flex' : 'none';
            });
        });
        appSearch.addEventListener('touchinput', (e) => {
            const query = e.target.value.toLowerCase();
            startMenuApps.querySelectorAll('.start-menu-app').forEach(item => {
                const name = item.querySelector('.name').textContent.toLowerCase();
                item.style.display = name.includes(query) ? 'flex' : 'none';
            });
        });
    }
    
    const powerBtn = document.getElementById('powerBtn');
    if (powerBtn) {
        powerBtn.addEventListener('click', () => {
            document.getElementById('startMenu').classList.add('hidden');
            setTimeout(() => {
                if (confirm('Shut down Xyzos OS?')) {
                    document.getElementById('desktop').classList.add('hidden');
                    document.getElementById('lockScreen').classList.add('hidden');
                    document.getElementById('cliBoot').classList.add('hidden');
                    document.getElementById('bootloader').classList.remove('hidden');
                    const progressFill = document.querySelector('.boot-progress-fill');
                    if (progressFill) progressFill.style.width = '0%';
                }
            }, 100);
        });
    }
    
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            openAppById('settings');
            document.getElementById('startMenu').classList.add('hidden');
        });
    }
}

function setupDesktopIcons() {
    const desktopIcons = document.getElementById('desktopIcons');
    const defaultIcons = [
        { id: 'files', icon: '📁', name: 'File Manager' },
        { id: 'terminal', icon: '💻', name: 'Terminal' },
        { id: 'browser', icon: '🌐', name: 'Browser' },
        { id: 'appstore', icon: '📦', name: 'App Store' },
        { id: 'settings', icon: '⚙️', name: 'Settings' }
    ];
    
    defaultIcons.forEach(icon => {
        const item = document.createElement('div');
        item.className = 'desktop-icon';
        item.innerHTML = '<span class="icon">' + icon.icon + '</span><span class="label">' + icon.name + '</span>';
        item.addEventListener('dblclick', () => openAppById(icon.id));
        item.addEventListener('touchstart', (e) => {
            if (item._tapCount === undefined) item._tapCount = 0;
            item._tapCount++;
            if (item._tapCount === 2) {
                item._tapCount = 0;
                openAppById(icon.id);
            }
        }, { passive: true });
        desktopIcons.appendChild(item);
    });
}

function setupContextMenu() {
    const desktop = document.getElementById('desktop');
    const contextMenu = document.getElementById('contextMenu');
    
    desktop.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        contextMenu.style.left = e.clientX + 'px';
        contextMenu.style.top = e.clientY + 'px';
        contextMenu.classList.remove('hidden');
    });
    
    desktop.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            contextMenu.style.left = e.touches[0].clientX + 'px';
            contextMenu.style.top = e.touches[0].clientY + 'px';
            contextMenu.classList.remove('hidden');
        }
    }, { passive: false });
    
    document.addEventListener('click', () => {
        contextMenu.classList.add('hidden');
    });
    
    document.querySelectorAll('.context-item').forEach(item => {
        item.addEventListener('click', () => {
            const action = item.dataset.action;
            if (action === 'terminal') openAppById('terminal');
            if (action === 'settings') openAppById('settings');
            if (action === 'refresh') location.reload();
            if (action === 'wallpaper') changeWallpaper();
        });
    });
}

function setupClock() {
    function updateClock() {
        const now = new Date();
        const clock = document.getElementById('clock');
        if (clock) {
            clock.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        }
        const lockTime = document.getElementById('lockTime');
        const lockDate = document.getElementById('lockDate');
        if (lockTime) lockTime.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
        if (lockDate) lockDate.textContent = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    }
    updateClock();
    setInterval(updateClock, 1000);
}

function showLockScreen() {
    document.getElementById('lockScreen').classList.remove('hidden');
    document.getElementById('unlockBtn').addEventListener('click', () => {
        document.getElementById('lockScreen').classList.add('hidden');
        XyzosOS.isRunning = true;
    });
    document.getElementById('unlockBtn').addEventListener('touchstart', () => {
        document.getElementById('lockScreen').classList.add('hidden');
        XyzosOS.isRunning = true;
    }, { passive: true });
}

function changeWallpaper() {
    const wallpapers = [
        'linear-gradient(135deg, #0f172a 0%, #1a1a2e 100%)',
        'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)',
        'linear-gradient(135deg, #2d1b4e 0%, #0f172a 100%)',
        'linear-gradient(135deg, #1a4a3a 0%, #0f172a 100%)'
    ];
    document.querySelector('.desktop').style.background = wallpapers[Math.floor(Math.random() * wallpapers.length)];
}

// ==================== App Opening ====================
function openAppById(appId) {
    const app = appsManifest.apps.find(a => a.id === appId);
    if (app) {
        const content = '<iframe src="apps/' + app.path + 'index.html" style="width:100%;height:100%;border:none;"></iframe>';
        createWindow(app.name, app.icon, content, { width: app.width || 600, height: app.height || 400 });
    }
}

function loadSettings() {
    try {
        const stored = localStorage.getItem('xyzosSettings');
        if (stored) {
            XyzosOS.settings = JSON.parse(stored);
        }
    } catch (e) {}
}

// ==================== Initialize ====================
document.addEventListener('DOMContentLoaded', () => {
    initBootloader();
});
