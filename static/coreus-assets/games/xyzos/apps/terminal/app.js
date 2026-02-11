// Terminal App
const TerminalApp = {
    history: [],
    historyIndex: -1,
    
    init() {
        const output = document.getElementById('terminalOutput');
        const input = document.getElementById('terminalInput');
        const prompt = document.getElementById('terminalPrompt');
        
        output.innerHTML = '<div class="terminal-line info">Xyzos Terminal v1.0.0</div><div class="terminal-line">Type "help" for available commands.</div><div class="terminal-line"></div>';
        
        // Focus input and show keyboard on mobile
        const focusTerminalInput = () => {
            input.focus();
            input.click();
        };
        
        // Make function available globally for the tap hint
        window.focusTerminalInput = focusTerminalInput;
        
        // Try to focus on load (may not work on mobile without user interaction)
        setTimeout(() => {
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            if (isMobile) {
                // Show keyboard hint, user needs to tap
            } else {
                input.focus();
            }
        }, 100);
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = input.value.trim();
                if (cmd) {
                    this.history.push(cmd);
                    this.historyIndex = this.history.length;
                    this.processCommand(cmd);
                }
                input.value = '';
            } else if (e.key === 'ArrowUp') {
                if (this.historyIndex > 0) {
                    this.historyIndex--;
                    input.value = this.history[this.historyIndex];
                }
                e.preventDefault();
            } else if (e.key === 'ArrowDown') {
                if (this.historyIndex < this.history.length - 1) {
                    this.historyIndex++;
                    input.value = this.history[this.historyIndex];
                } else {
                    this.historyIndex = this.history.length;
                    input.value = '';
                }
                e.preventDefault();
            }
        });
        
        // Focus on click anywhere in terminal
        document.querySelector('.terminal-app').addEventListener('click', () => {
            input.focus();
        });
    },
    
    processCommand(cmd) {
        const output = document.getElementById('terminalOutput');
        const prompt = document.getElementById('terminalPrompt');
        
        const cmdLine = document.createElement('div');
        cmdLine.className = 'terminal-line command';
        cmdLine.textContent = `user@xyzos:~$ ${cmd}`;
        output.appendChild(cmdLine);
        
        const parts = cmd.toLowerCase().split(' ');
        const command = parts[0];
        const args = parts.slice(1);
        
        let response = '';
        let type = 'normal';
        
        const getPathStr = () => parent.FileSystem ? parent.FileSystem.getPathString().replace('/home/user', '~') : '~';
        
        const commands = {
            help: () => {
                response = `Available commands:
  help        - Show this message
  clear       - Clear terminal
  ls [dir]    - List files
  cd [dir]    - Change directory
  pwd         - Print working directory
  cat [file]  - Show file contents
  mkdir [name]- Create directory
  touch [name]- Create file
  rm [name]   - Delete file
  cp [s] [d]  - Copy file
  mv [s] [d]  - Move file
  find [text] - Search files
  whoami      - Current user
  date        - Current date/time
  hostname    - System name
  echo [text] - Print text
  reboot      - Reboot system
  shutdown    - Shutdown system`;
            },
            clear: () => { output.innerHTML = ''; return ''; },
            exit: () => { if (parent.closeWindow) parent.closeWindow(parent.currentWindowId); return ''; },
            reboot: () => { response = 'Rebooting...'; setTimeout(() => location.reload(), 1000); },
            shutdown: () => { response = 'Shutting down...'; setTimeout(() => { if (parent.shutdownSystem) parent.shutdownSystem(); }, 1000); },
            
            ls: () => {
                if (!parent.FileSystem) return 'File system not available';
                const pathArg = args[0];
                const files = parent.FileSystem.listDir(pathArg);
                if (files && files.length > 0) {
                    return files.map(f => f.isDir ? `<span style="color:#60a5fa">${f.name}/</span>` : f.name).join('  ');
                }
                return '(empty directory)';
            },
            
            pwd: () => parent.FileSystem ? parent.FileSystem.getPathString() : '/home/user',
            
            cd: () => {
                if (!parent.FileSystem) return 'File system not available';
                if (args[0]) {
                    if (parent.FileSystem.changeDir(args[0])) {
                        const pathStr = getPathStr();
                        prompt.innerHTML = `<span style="color:#60a5fa">user@xyzos</span>:<span style="color:#22c55e">${pathStr}</span>$`;
                        return '';
                    }
                    return `cd: ${args[0]}: No such directory`;
                }
                parent.FileSystem.currentPath = ['home', 'user'];
                prompt.innerHTML = '<span style="color:#60a5fa">user@xyzos</span>:<span style="color:#22c55e">~</span>$';
                return '';
            },
            
            cat: () => {
                if (!parent.FileSystem) return 'File system not available';
                if (!args[0]) return 'cat: missing operand';
                const content = parent.FileSystem.readFile(args[0]);
                if (content !== null) return content;
                if (parent.FileSystem.isDir(args[0])) return `cat: ${args[0]}: Is a directory`;
                return `cat: ${args[0]}: No such file`;
            },
            
            mkdir: () => {
                if (!parent.FileSystem) return 'File system not available';
                if (!args[0]) return 'mkdir: missing operand';
                return parent.FileSystem.createDir(args[0]) ? '' : `mkdir: cannot create directory '${args[0]}': File exists`;
            },
            
            touch: () => {
                if (!parent.FileSystem) return 'File system not available';
                if (!args[0]) return 'touch: missing operand';
                return parent.FileSystem.createFile(args[0], '') ? '' : `touch: cannot create '${args[0]}': File exists`;
            },
            
            rm: () => {
                if (!parent.FileSystem) return 'File system not available';
                if (!args[0]) return 'rm: missing operand';
                return parent.FileSystem.deleteItem(args[0]) ? '' : `rm: cannot remove '${args[0]}'`;
            },
            
            cp: () => {
                if (!parent.FileSystem) return 'File system not available';
                if (!args[0] || !args[1]) return 'cp: missing source or destination';
                return parent.FileSystem.copyItem(args[0], args[1]) ? '' : 'cp: cannot copy';
            },
            
            mv: () => {
                if (!parent.FileSystem) return 'File system not available';
                if (!args[0] || !args[1]) return 'mv: missing source or destination';
                return parent.FileSystem.moveItem(args[0], args[1]) ? '' : 'mv: cannot move';
            },
            
            find: () => {
                if (!parent.FileSystem) return 'File system not available';
                const term = args[0] || '';
                const results = [];
                const searchNode = parent.FileSystem.getNode(parent.FileSystem.currentPath);
                if (searchNode) {
                    const search = (node, path) => {
                        for (const [name, val] of Object.entries(node)) {
                            const full = path + '/' + name;
                            if (name.includes(term)) results.push(full);
                            if (typeof val === 'object') search(val, full);
                        }
                    };
                    search(searchNode, parent.FileSystem.getPathString());
                }
                return results.length > 0 ? results.join('\n') : `find: No matches for '${term}'`;
            },
            
            whoami: () => parent.XyzosOS ? parent.XyzosOS.currentUser : 'user',
            date: () => new Date().toString(),
            hostname: () => 'xyzos',
            echo: () => args.join(' ')
        };
        
        if (commands[command]) {
            response = commands[command]() || response;
        } else {
            response = `${command}: command not found`;
            type = 'error';
        }
        
        if (response) {
            const respLine = document.createElement('div');
            respLine.className = `terminal-line ${type}`;
            respLine.innerHTML = response;
            output.appendChild(respLine);
        }
        
        output.scrollTop = output.scrollHeight;
    }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    TerminalApp.init();
});
