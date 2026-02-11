// Clock App
const ClockApp = {
    format24: true,
    interval: null,
    
    init() {
        this.update();
        this.interval = setInterval(() => this.update(), 1000);
    },
    
    update() {
        const now = new Date();
        const timeEl = document.getElementById('clockTime');
        const dateEl = document.getElementById('clockDate');
        
        const hours = this.format24 ? now.getHours() : now.getHours() % 12 || 12;
        const time = `${String(hours).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        timeEl.textContent = this.format24 ? time : time.replace(/^0+/, '');
        dateEl.textContent = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    },
    
    toggleFormat() {
        this.format24 = !this.format24;
        this.update();
    }
};

ClockApp.init();
