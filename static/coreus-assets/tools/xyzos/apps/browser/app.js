// Browser App
const BrowserApp = {
    history: [],
    historyIndex: -1,
    
    init() {
        const urlInput = document.getElementById('browserUrl');
        const goBtn = document.getElementById('browserGo');
        const frame = document.getElementById('browserFrame');
        const home = document.getElementById('browserHome');
        
        goBtn.addEventListener('click', () => this.navigate(urlInput.value));
        urlInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') this.navigate(urlInput.value);
        });
        
        document.getElementById('browserBack').addEventListener('click', () => {
            if (this.historyIndex > 0) {
                this.historyIndex--;
                urlInput.value = this.history[this.historyIndex];
                frame.src = 'https://embeddr.rhw.one/embed#' + encodeURIComponent(this.history[this.historyIndex]);
            }
        });
        
        document.getElementById('browserRefresh').addEventListener('click', () => {
            if (urlInput.value) {
                frame.src = 'https://embeddr.rhw.one/embed#' + encodeURIComponent(urlInput.value) + '?t=' + Date.now();
            }
        });
    },
    
    navigate(url) {
        if (!url) return;
        
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        
        const frame = document.getElementById('browserFrame');
        const home = document.getElementById('browserHome');
        const urlInput = document.getElementById('browserUrl');
        
        frame.src = 'https://embeddr.rhw.one/embed#' + encodeURIComponent(url);
        urlInput.value = url;
        home.style.display = 'none';
        
        this.history = this.history.slice(0, this.historyIndex + 1);
        this.history.push(url);
        this.historyIndex = this.history.length - 1;
    }
};

BrowserApp.init();
