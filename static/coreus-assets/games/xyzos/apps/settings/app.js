// Settings App
const SettingsApp = {
    sections: {
        general: `
            <div class="settings-section">
                <h2>General</h2>
                <div class="settings-option">
                    <div>
                        <label>Auto-Lock Screen</label>
                        <div class="desc">Lock screen after inactivity</div>
                    </div>
                    <div class="toggle-switch active" data-setting="autoLock" onclick="SettingsApp.toggle(this)"></div>
                </div>
                <div class="settings-option">
                    <div>
                        <label>Start Menu Animations</label>
                        <div class="desc">Enable menu transition effects</div>
                    </div>
                    <div class="toggle-switch active" data-setting="animations" onclick="SettingsApp.toggle(this)"></div>
                </div>
                <div class="settings-option">
                    <div>
                        <label>Transparency Effects</label>
                        <div class="desc">Enable glass-like transparency</div>
                    </div>
                    <div class="toggle-switch active" data-setting="transparency" onclick="SettingsApp.toggle(this)"></div>
                </div>
                <div class="settings-option">
                    <div>
                        <label>Notifications</label>
                        <div class="desc">Show system notifications</div>
                    </div>
                    <div class="toggle-switch active" data-setting="notifications" onclick="SettingsApp.toggle(this)"></div>
                </div>
                <div class="settings-option">
                    <div>
                        <label>Compact Taskbar</label>
                        <div class="desc">Use smaller taskbar icons</div>
                    </div>
                    <div class="toggle-switch" data-setting="compactTaskbar" onclick="SettingsApp.toggle(this)"></div>
                </div>
            </div>
            <div class="settings-section">
                <h2>Language & Region</h2>
                <div class="settings-option">
                    <div>
                        <label>Language</label>
                        <div class="desc">Select your preferred language</div>
                    </div>
                    <select class="settings-select" data-setting="language" onchange="SettingsApp.save()">
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                        <option value="zh">中文</option>
                        <option value="ja">日本語</option>
                        <option value="pt">Português</option>
                        <option value="ru">Русский</option>
                    </select>
                </div>
                <div class="settings-option">
                    <div>
                        <label>Timezone</label>
                        <div class="desc">Set your local timezone</div>
                    </div>
                    <select class="settings-select" data-setting="timezone" onchange="SettingsApp.save()">
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                        <option value="Europe/London">London</option>
                        <option value="Europe/Paris">Paris</option>
                        <option value="Asia/Tokyo">Tokyo</option>
                        <option value="Asia/Shanghai">Shanghai</option>
                    </select>
                </div>
                <div class="settings-option">
                    <div>
                        <label>Date Format</label>
                    </div>
                    <select class="settings-select" data-setting="dateFormat" onchange="SettingsApp.save()">
                        <option value="MDY">MM/DD/YYYY</option>
                        <option value="DMY">DD/MM/YYYY</option>
                        <option value="YMD">YYYY-MM-DD</option>
                    </select>
                </div>
            </div>
        `,
        appearance: `
            <div class="settings-section">
                <h2>Appearance</h2>
                <div class="settings-option">
                    <div>
                        <label>Dark Mode</label>
                        <div class="desc">Use dark color theme</div>
                    </div>
                    <div class="toggle-switch active" data-setting="darkMode" onclick="SettingsApp.toggle(this)"></div>
                </div>
                <div class="settings-option">
                    <div>
                        <label>Accent Color</label>
                        <div class="desc">Choose your accent color</div>
                    </div>
                    <input type="color" data-setting="accentColor" value="#6366f1" onchange="SettingsApp.save()" style="width: 50px; height: 30px; cursor: pointer;">
                </div>
                <div class="settings-option">
                    <div>
                        <label>Wallpaper</label>
                        <div class="desc">Choose desktop background</div>
                    </div>
                    <select class="settings-select" data-setting="wallpaper" onchange="SettingsApp.changeWallpaper(this.value)">
                        <option value="default">Default</option>
                        <option value="ocean">Ocean</option>
                        <option value="forest">Forest</option>
                        <option value="space">Space</option>
                        <option value="sunset">Sunset</option>
                        <option value="minimal">Minimal</option>
                    </select>
                </div>
                <div class="settings-option">
                    <div>
                        <label>Font Size</label>
                        <div class="desc">Adjust system font size</div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span class="settings-value" id="fontSizeValue">14px</span>
                        <input type="range" class="settings-slider" min="12" max="20" value="14" data-setting="fontSize" oninput="SettingsApp.updateFontSize(this.value)">
                    </div>
                </div>
                <div class="settings-option">
                    <div>
                        <label>Window Animations</label>
                        <div class="desc">Animation speed for windows</div>
                    </div>
                    <select class="settings-select" data-setting="animSpeed" onchange="SettingsApp.save()">
                        <option value="fast">Fast</option>
                        <option value="normal" selected>Normal</option>
                        <option value="slow">Slow</option>
                    </select>
                </div>
            </div>
        `,
        sound: `
            <div class="settings-section">
                <h2>Sound</h2>
                <div class="settings-option">
                    <div>
                        <label>Master Volume</label>
                        <div class="desc">Overall system volume</div>
                    </div>
                    <input type="range" class="settings-slider" min="0" max="100" value="70" data-setting="masterVolume" oninput="SettingsApp.updateVolume(this.value)">
                    <span class="settings-value" id="volumeValue">70%</span>
                </div>
                <div class="settings-option">
                    <div>
                        <label>Notification Sounds</label>
                        <div class="desc">Play sound on notifications</div>
                    </div>
                    <div class="toggle-switch active" data-setting="notificationSounds" onclick="SettingsApp.toggle(this)"></div>
                </div>
                <div class="settings-option">
                    <div>
                        <label>Typing Sounds</label>
                        <div class="desc">Play key press sounds</div>
                    </div>
                    <div class="toggle-switch" data-setting="typingSounds" onclick="SettingsApp.toggle(this)"></div>
                </div>
                <div class="settings-option">
                    <div>
                        <label>Startup Sound</label>
                        <div class="desc">Play sound on boot</div>
                    </div>
                    <div class="toggle-switch active" data-setting="startupSound" onclick="SettingsApp.toggle(this)"></div>
                </div>
            </div>
        `,
        network: `
            <div class="settings-section">
                <h2>Network</h2>
                <div class="settings-option">
                    <div>
                        <label>Wi-Fi</label>
                        <div class="desc">Enable wireless network</div>
                    </div>
                    <div class="toggle-switch active" data-setting="wifi" onclick="SettingsApp.toggle(this)"></div>
                </div>
                <div class="settings-option">
                    <div>
                        <label>Bluetooth</label>
                        <div class="desc">Enable Bluetooth connectivity</div>
                    </div>
                    <div class="toggle-switch" data-setting="bluetooth" onclick="SettingsApp.toggle(this)"></div>
                </div>
                <div class="settings-option">
                    <div>
                        <label>Airplane Mode</label>
                        <div class="desc">Disable all wireless connections</div>
                    </div>
                    <div class="toggle-switch" data-setting="airplaneMode" onclick="SettingsApp.toggle(this)"></div>
                </div>
                <div class="settings-option">
                    <div>
                        <label>Proxy</label>
                        <div class="desc">Use proxy server</div>
                    </div>
                    <div class="toggle-switch" data-setting="proxy" onclick="SettingsApp.toggle(this)"></div>
                </div>
            </div>
            <div class="settings-section">
                <h2>Network Info</h2>
                <div class="settings-option">
                    <label>IP Address</label>
                    <span style="color: #6366f1; font-family: monospace;">192.168.1.100</span>
                </div>
                <div class="settings-option">
                    <label>MAC Address</label>
                    <span style="color: #6366f1; font-family: monospace;">00:11:22:33:44:55</span>
                </div>
                <div class="settings-option">
                    <label>DNS</label>
                    <span style="color: #6366f1; font-family: monospace;">8.8.8.8</span>
                </div>
            </div>
        `,
        storage: `
            <div class="settings-section">
                <h2>Storage</h2>
                <div class="settings-option" style="flex-direction: column; align-items: flex-start;">
                    <div style="display: flex; justify-content: space-between; width: 100%; margin-bottom: 0.5rem;">
                        <label>Used Space</label>
                        <span>2.5 GB / 8 GB</span>
                    </div>
                    <div style="width: 100%; height: 8px; background: #334155; border-radius: 4px; overflow: hidden;">
                        <div style="width: 31%; height: 100%; background: #6366f1;"></div>
                    </div>
                </div>
                <div class="settings-option">
                    <div>
                        <label>Clear Cache</label>
                        <div class="desc">Free up temporary files</div>
                    </div>
                    <button class="settings-select" onclick="SettingsApp.clearCache()">Clear</button>
                </div>
                <div class="settings-option">
                    <div>
                        <label>File System Usage</label>
                        <div class="desc">Total files stored</div>
                    </div>
                    <span class="settings-value" id="fileCount">0 files</span>
                </div>
            </div>
            <div class="settings-section">
                <h2>Data Management</h2>
                <div class="settings-option">
                    <div>
                        <label>Export Settings</label>
                        <div class="desc">Download your settings</div>
                    </div>
                    <button class="settings-select" onclick="SettingsApp.exportSettings()">Export</button>
                </div>
                <div class="settings-option">
                    <div>
                        <label>Import Settings</label>
                        <div class="desc">Restore settings from file</div>
                    </div>
                    <button class="settings-select" onclick="SettingsApp.importSettings()">Import</button>
                </div>
                <div class="settings-option">
                    <div>
                        <label>Reset to Default</label>
                        <div class="desc">Reset all settings</div>
                    </div>
                    <button class="settings-select" style="background: #ef4444;" onclick="SettingsApp.resetSettings()">Reset</button>
                </div>
            </div>
        `,
        privacy: `
            <div class="settings-section">
                <h2>Privacy</h2>
                <div class="settings-option">
                    <div>
                        <label>Location Services</label>
                        <div class="desc">Allow apps to access location</div>
                    </div>
                    <div class="toggle-switch" data-setting="location" onclick="SettingsApp.toggle(this)"></div>
                </div>
                <div class="settings-option">
                    <div>
                        <label>Camera Access</label>
                        <div class="desc">Allow camera access for apps</div>
                    </div>
                    <div class="toggle-switch" data-setting="camera" onclick="SettingsApp.toggle(this)"></div>
                </div>
                <div class="settings-option">
                    <div>
                        <label>Microphone Access</label>
                        <div class="desc">Allow microphone access</div>
                    </div>
                    <div class="toggle-switch" data-setting="microphone" onclick="SettingsApp.toggle(this)"></div>
                </div>
                <div class="settings-option">
                    <div>
                        <label>Do Not Track</label>
                        <div class="desc">Send DNT header to websites</div>
                    </div>
                    <div class="toggle-switch active" data-setting="doNotTrack" onclick="SettingsApp.toggle(this)"></div>
                </div>
                <div class="settings-option">
                    <div>
                        <label>Cookies</label>
                        <div class="desc">Allow cookies in browser</div>
                    </div>
                    <div class="toggle-switch active" data-setting="cookies" onclick="SettingsApp.toggle(this)"></div>
                </div>
            </div>
            <div class="settings-section">
                <h2>Security</h2>
                <div class="settings-option">
                    <div>
                        <label>Screen Lock</label>
                        <div class="desc">Require password after lock</div>
                    </div>
                    <div class="toggle-switch" data-setting="screenLock" onclick="SettingsApp.toggle(this)"></div>
                </div>
                <div class="settings-option">
                    <div>
                        <label>Auto-Lock Timeout</label>
                    </div>
                    <select class="settings-select" data-setting="lockTimeout" onchange="SettingsApp.save()">
                        <option value="30">30 seconds</option>
                        <option value="60" selected>1 minute</option>
                        <option value="300">5 minutes</option>
                        <option value="600">10 minutes</option>
                    </select>
                </div>
            </div>
        `,
        about: `
            <div class="settings-section">
                <h2>About Xyzos OS</h2>
                <div style="text-align: center; padding: 2rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">◆</div>
                    <h1 style="background: linear-gradient(135deg, #6366f1, #0ea5e9); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Xyzos OS</h1>
                    <p style="color: #94a3b8; margin: 0.5rem 0;">Version 1.0.0</p>
                    <p style="color: #64748b; font-size: 0.875rem;">A modern web-based operating system</p>
                </div>
                <div class="settings-option">
                    <label>Build</label>
                    <span style="color: #6366f1;">2026.1.17</span>
                </div>
                <div class="settings-option">
                    <label>Engine</label>
                    <span style="color: #6366f1;">HTML5 / CSS3 / ES6+</span>
                </div>
                <div class="settings-option">
                    <label>Total Apps</label>
                    <span class="settings-value" id="appCount">18</span>
                </div>
                <div class="settings-option">
                    <label>File System</label>
                    <span style="color: #22c55e;">Active</span>
                </div>
            </div>
        `
    },
    
    settings: {},
    
    init() {
        // Load settings from parent
        if (parent.XyzosOS && parent.XyzosOS.settings) {
            this.settings = { ...parent.XyzosOS.settings };
        }
        
        // Load from localStorage
        const stored = localStorage.getItem('xyzosSettings');
        if (stored) {
            try {
                this.settings = { ...this.settings, ...JSON.parse(stored) };
            } catch (e) {}
        }
        
        // Set up navigation
        document.querySelectorAll('.settings-nav-item').forEach(item => {
            item.addEventListener('click', () => {
                document.querySelectorAll('.settings-nav-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                document.getElementById('settingsContent').innerHTML = this.sections[item.dataset.section] || '';
                this.applySettings();
            });
        });
        
        // Load default section
        document.getElementById('settingsContent').innerHTML = this.sections.general;
        this.applySettings();
        
        // Update file count
        if (parent.FileSystem) {
            const files = this.countFiles(parent.XyzosOS.fileSystem);
            document.getElementById('fileCount').textContent = files + ' items';
        }
    },
    
    applySettings() {
        document.querySelectorAll('.toggle-switch').forEach(toggle => {
            const key = toggle.dataset.setting;
            if (this.settings[key] !== undefined) {
                if (this.settings[key]) toggle.classList.add('active');
                else toggle.classList.remove('active');
            }
        });
        
        document.querySelectorAll('.settings-select').forEach(select => {
            const key = select.dataset.setting;
            if (this.settings[key]) select.value = this.settings[key];
        });
    },
    
    toggle(el) {
        el.classList.toggle('active');
        this.settings[el.dataset.setting] = el.classList.contains('active');
        this.save();
    },
    
    save() {
        // Save to parent
        if (parent.XyzosOS) {
            Object.assign(parent.XyzosOS.settings, this.settings);
        }
        // Save to localStorage
        localStorage.setItem('xyzosSettings', JSON.stringify(this.settings));
    },
    
    updateFontSize(value) {
        document.getElementById('fontSizeValue').textContent = value + 'px';
        this.settings.fontSize = value;
        this.save();
        document.body.style.fontSize = value + 'px';
    },
    
    updateVolume(value) {
        document.getElementById('volumeValue').textContent = value + '%';
        this.settings.masterVolume = value;
        this.save();
    },
    
    changeWallpaper(value) {
        this.settings.wallpaper = value;
        this.save();
        if (parent.changeWallpaper) parent.changeWallpaper();
    },
    
    clearCache() {
        localStorage.removeItem('xyzosCache');
        alert('Cache cleared!');
    },
    
    exportSettings() {
        const data = JSON.stringify(this.settings, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'xyzos-settings.json';
        a.click();
    },
    
    importSettings() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    this.settings = { ...this.settings, ...JSON.parse(event.target.result) };
                    this.save();
                    this.applySettings();
                    alert('Settings imported!');
                } catch (err) {
                    alert('Invalid settings file');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    },
    
    resetSettings() {
        if (confirm('Reset all settings to default?')) {
            this.settings = {};
            localStorage.removeItem('xyzosSettings');
            this.applySettings();
            alert('Settings reset!');
        }
    },
    
    countFiles(obj, count = 0) {
        for (const key in obj) {
            count++;
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                count = this.countFiles(obj[key], count);
            }
        }
        return count;
    }
};

SettingsApp.init();
