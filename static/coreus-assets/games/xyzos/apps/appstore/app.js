// App Store App
const AppStoreApp = {
    apps: [],
    
    init() {
        // Get apps from manifest
        if (parent.appsManifest) {
            this.apps = parent.appsManifest.apps;
        }
        
        this.renderApps();
        
        document.getElementById('appSearch').addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            this.renderApps(query);
        });
    },
    
    renderApps(query = '') {
        const content = document.getElementById('appStoreContent');
        content.innerHTML = '';
        
        const filtered = this.apps.filter(app => 
            app.name.toLowerCase().includes(query) || 
            app.description.toLowerCase().includes(query) ||
            app.category.toLowerCase().includes(query)
        );
        
        filtered.forEach(app => {
            const item = document.createElement('div');
            item.className = 'appstore-item';
            item.innerHTML = `
                <div class="icon">${app.icon}</div>
                <div class="name">${app.name}</div>
                <div class="desc">${app.description}</div>
                <div style="text-align: center; font-size: 0.75rem; color: #6366f1; margin-bottom: 0.5rem;">${app.category}</div>
                <button class="install-btn" onclick="AppStoreApp.openApp('${app.id}')">Open</button>
            `;
            content.appendChild(item);
        });
    },
    
    openApp(appId) {
        if (parent.openAppById) {
            parent.openAppById(appId);
        }
    }
};

AppStoreApp.init();
