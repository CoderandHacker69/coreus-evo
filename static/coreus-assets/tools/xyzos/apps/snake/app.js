// Snake Game
const SnakeApp = {
    canvas: null,
    ctx: null,
    gridSize: 17,
    tileCount: 0,
    snake: [],
    food: null,
    dx: 0,
    dy: 0,
    score: 0,
    gameLoop: null,
    started: false,
    
    init() {
        setTimeout(() => {
            this.canvas = document.getElementById('snakeCanvas');
            this.ctx = this.canvas.getContext('2d');
            this.tileCount = this.canvas.width / this.gridSize;
            
            // Initialize game state
            this.resetGame();
            
            // Draw initial state
            this.draw();
            
            // Keyboard controls
            document.addEventListener('keydown', (e) => this.handleKey(e));
            
            // Touch/click canvas to start
            this.canvas.addEventListener('click', () => this.startGame());
            this.canvas.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.startGame();
            });
            
            // Mobile direction buttons
            document.querySelectorAll('.snake-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.setDirection(btn.dataset.dir);
                    this.startGame();
                });
                btn.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.setDirection(btn.dataset.dir);
                    this.startGame();
                });
            });
            
            // Swipe controls
            let touchStartX = 0;
            let touchStartY = 0;
            this.canvas.addEventListener('touchstart', (e) => {
                touchStartX = e.touches[0].clientX;
                touchStartY = e.touches[0].clientY;
            });
            this.canvas.addEventListener('touchend', (e) => {
                const touchEndX = e.changedTouches[0].clientX;
                const touchEndY = e.changedTouches[0].clientY;
                const dx = touchEndX - touchStartX;
                const dy = touchEndY - touchStartY;
                if (Math.abs(dx) > Math.abs(dy)) {
                    if (dx > 0 && this.dx !== -1) { this.dx = 1; this.dy = 0; }
                    else if (dx < 0 && this.dx !== 1) { this.dx = -1; this.dy = 0; }
                } else {
                    if (dy > 0 && this.dy !== -1) { this.dx = 0; this.dy = 1; }
                    else if (dy < 0 && this.dy !== 1) { this.dx = 0; this.dy = -1; }
                }
                this.startGame();
            });
        }, 100);
    },
    
    resetGame() {
        this.snake = [{ x: 10, y: 10 }];
        this.placeFood();
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.started = false;
        document.getElementById('snakeScore').textContent = '0';
    },
    
    placeFood() {
        this.food = {
            x: Math.floor(Math.random() * this.tileCount),
            y: Math.floor(Math.random() * this.tileCount)
        };
        // Make sure food doesn't spawn on snake
        while (this.snake.some(s => s.x === this.food.x && s.y === this.food.y)) {
            this.food = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
        }
    },
    
    startGame() {
        if (this.gameLoop) return;
        if (!this.started) {
            // Start with a random direction
            const dirs = [{ dx: 1, dy: 0 }, { dx: -1, dy: 0 }, { dx: 0, dy: 1 }, { dx: 0, dy: -1 }];
            const startDir = dirs[Math.floor(Math.random() * dirs.length)];
            this.dx = startDir.dx;
            this.dy = startDir.dy;
            this.started = true;
        }
        this.gameLoop = setInterval(() => this.update(), 100);
    },
    
    handleKey(e) {
        switch (e.key) {
            case 'ArrowUp': if (this.dy !== 1) { this.dx = 0; this.dy = -1; } break;
            case 'ArrowDown': if (this.dy !== -1) { this.dx = 0; this.dy = 1; } break;
            case 'ArrowLeft': if (this.dx !== 1) { this.dx = -1; this.dy = 0; } break;
            case 'ArrowRight': if (this.dx !== -1) { this.dx = 1; this.dy = 0; } break;
        }
    },
    
    setDirection(dir) {
        switch (dir) {
            case 'up': if (this.dy !== 1) { this.dx = 0; this.dy = -1; } break;
            case 'down': if (this.dy !== -1) { this.dx = 0; this.dy = 1; } break;
            case 'left': if (this.dx !== 1) { this.dx = -1; this.dy = 0; } break;
            case 'right': if (this.dx !== -1) { this.dx = 1; this.dy = 0; } break;
        }
    },
    
    update() {
        const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };
        
        // Wall collision
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
            this.gameOver();
            return;
        }
        
        // Self collision
        if (this.snake.some(s => s.x === head.x && s.y === head.y)) {
            this.gameOver();
            return;
        }
        
        this.snake.unshift(head);
        
        // Food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            document.getElementById('snakeScore').textContent = this.score;
            this.placeFood();
        } else {
            this.snake.pop();
        }
        
        this.draw();
    },
    
    draw() {
        // Background
        this.ctx.fillStyle = '#0f172a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Grid (subtle)
        this.ctx.strokeStyle = '#1e293b';
        for (let i = 0; i < this.tileCount; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.gridSize, 0);
            this.ctx.lineTo(i * this.gridSize, this.canvas.height);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.gridSize);
            this.ctx.lineTo(this.canvas.width, i * this.gridSize);
            this.ctx.stroke();
        }
        
        // Snake
        this.ctx.fillStyle = '#22c55e';
        this.snake.forEach((segment, i) => {
            const brightness = 1 - (i / this.snake.length) * 0.5;
            this.ctx.fillStyle = `hsl(142, 71%, ${45 * brightness}%)`;
            this.ctx.fillRect(
                segment.x * this.gridSize + 1,
                segment.y * this.gridSize + 1,
                this.gridSize - 2,
                this.gridSize - 2
            );
        });
        
        // Food
        this.ctx.fillStyle = '#ef4444';
        this.ctx.beginPath();
        this.ctx.arc(
            this.food.x * this.gridSize + this.gridSize / 2,
            this.food.y * this.gridSize + this.gridSize / 2,
            this.gridSize / 2 - 2,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
    },
    
    gameOver() {
        clearInterval(this.gameLoop);
        this.gameLoop = null;
        setTimeout(() => {
            alert(`Game Over! Score: ${this.score}\nClick or tap to play again.`);
            this.resetGame();
            this.draw();
        }, 100);
    }
};

SnakeApp.init();
