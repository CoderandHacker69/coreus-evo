// Paint App
const PaintApp = {
    canvas: null,
    ctx: null,
    isDrawing: false,
    currentTool: 'brush',
    currentColor: '#000000',
    brushSize: 5,
    lastX: 0,
    lastY: 0,
    
    init() {
        setTimeout(() => {
            this.canvas = document.getElementById('paintCanvas');
            this.ctx = this.canvas.getContext('2d');
            
            // White background
            this.ctx.fillStyle = 'white';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.lineCap = 'round';
            this.ctx.lineJoin = 'round';
            
            // Tool buttons
            document.querySelectorAll('.paint-tool').forEach(tool => {
                tool.addEventListener('click', () => {
                    if (tool.dataset.tool) {
                        this.currentTool = tool.dataset.tool;
                        document.querySelectorAll('.paint-tool').forEach(t => t.classList.remove('active'));
                        tool.classList.add('active');
                    }
                });
            });
            
            // Color picker
            document.getElementById('paintColor').addEventListener('input', (e) => {
                this.currentColor = e.target.value;
            });
            
            // Brush size
            document.getElementById('brushSize').addEventListener('input', (e) => {
                this.brushSize = e.target.value;
                document.getElementById('brushSizeLabel').textContent = e.target.value + 'px';
            });
            
            // Clear
            document.getElementById('paintClear').addEventListener('click', () => {
                this.ctx.fillStyle = 'white';
                this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            });
            
            // Save
            document.getElementById('paintSave').addEventListener('click', () => {
                const link = document.createElement('a');
                link.download = 'drawing.png';
                link.href = this.canvas.toDataURL();
                link.click();
            });
            
            // Mouse events
            this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
            this.canvas.addEventListener('mousemove', (e) => this.draw(e));
            this.canvas.addEventListener('mouseup', () => this.stopDrawing());
            this.canvas.addEventListener('mouseout', () => this.stopDrawing());
            
            // Touch events
            this.canvas.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.startDrawing(e.touches[0]);
            });
            this.canvas.addEventListener('touchmove', (e) => {
                e.preventDefault();
                this.draw(e.touches[0]);
            });
            this.canvas.addEventListener('touchend', () => this.stopDrawing());
        }, 100);
    },
    
    getCoords(e) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    },
    
    startDrawing(e) {
        this.isDrawing = true;
        const coords = this.getCoords(e);
        this.lastX = coords.x;
        this.lastY = coords.y;
        
        // Single dot for tap
        this.ctx.beginPath();
        this.ctx.arc(coords.x, coords.y, this.brushSize / 2, 0, Math.PI * 2);
        this.ctx.fillStyle = this.currentTool === 'eraser' ? 'white' : this.currentColor;
        this.ctx.fill();
    },
    
    draw(e) {
        if (!this.isDrawing) return;
        
        const coords = this.getCoords(e);
        this.ctx.strokeStyle = this.currentTool === 'eraser' ? 'white' : this.currentColor;
        this.ctx.lineWidth = this.brushSize;
        
        this.ctx.beginPath();
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(coords.x, coords.y);
        this.ctx.stroke();
        
        this.lastX = coords.x;
        this.lastY = coords.y;
    },
    
    stopDrawing() {
        this.isDrawing = false;
    }
};

PaintApp.init();
