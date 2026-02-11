// Tetris Game
const TetrisApp = {
    canvas: null,
    ctx: null,
    nextCanvas: null,
    nextCtx: null,
    ROWS: 18,
    COLS: 9,
    BLOCK_SIZE: 20,
    board: [],
    currentPiece: null,
    nextPiece: null,
    score: 0,
    gameLoop: null,
    started: false,
    
    SHAPES: [
        [[1,1,1,1]], // I
        [[1,1],[1,1]], // O
        [[0,1,0],[1,1,1]], // T
        [[1,0,0],[1,1,1]], // L
        [[0,0,1],[1,1,1]], // J
        [[0,1,1],[1,1,0]], // S
        [[1,1,0],[0,1,1]]  // Z
    ],
    COLORS: ['#00f0f0', '#f0f000', '#a000f0', '#f0a000', '#0000f0', '#00f000', '#f00000'],
    
    init() {
        setTimeout(() => {
            this.canvas = document.getElementById('tetrisCanvas');
            this.ctx = this.canvas.getContext('2d');
            this.nextCanvas = document.getElementById('nextCanvas');
            this.nextCtx = this.nextCanvas.getContext('2d');
            
            this.resetGame();
            this.draw();
            
            // Keyboard
            document.addEventListener('keydown', (e) => this.handleKey(e));
            
            // Start on click/tap
            this.canvas.addEventListener('click', () => this.startGame());
            this.canvas.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.startGame();
            });
            
            // Mobile buttons
            document.querySelectorAll('.tetris-btn').forEach(btn => {
                btn.addEventListener('click', () => this.handleAction(btn.dataset.action));
                btn.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.handleAction(btn.dataset.action);
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
                    if (dx > 20) this.move(1);
                    else if (dx < -20) this.move(-1);
                } else {
                    if (dy > 20) this.drop();
                    else if (dy < -20) this.rotate();
                }
                this.startGame();
            });
        }, 100);
    },
    
    resetGame() {
        this.board = Array(this.ROWS).fill().map(() => Array(this.COLS).fill(0));
        this.currentPiece = this.createPiece();
        this.nextPiece = this.createPiece();
        this.score = 0;
        this.started = false;
        document.getElementById('tetrisScore').textContent = '0';
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
            this.gameLoop = null;
        }
    },
    
    createPiece() {
        const idx = Math.floor(Math.random() * this.SHAPES.length);
        return {
            shape: this.SHAPES[idx],
            color: this.COLORS[idx],
            x: Math.floor(this.COLS / 2) - Math.floor(this.SHAPES[idx][0].length / 2),
            y: 0
        };
    },
    
    startGame() {
        if (this.gameLoop) return;
        this.started = true;
        this.gameLoop = setInterval(() => this.drop(), 500);
    },
    
    handleKey(e) {
        switch (e.key) {
            case 'ArrowLeft': this.move(-1); break;
            case 'ArrowRight': this.move(1); break;
            case 'ArrowDown': this.drop(); break;
            case 'ArrowUp': this.rotate(); break;
        }
        this.startGame();
    },
    
    handleAction(action) {
        switch (action) {
            case 'left': this.move(-1); break;
            case 'right': this.move(1); break;
            case 'down': this.drop(); break;
            case 'rotate': this.rotate(); break;
        }
        this.startGame();
    },
    
    move(dir) {
        if (this.canMove(dir, 0)) {
            this.currentPiece.x += dir;
        }
    },
    
    drop() {
        if (this.canMove(0, 1)) {
            this.currentPiece.y++;
        } else {
            this.lockPiece();
        }
        this.draw();
    },
    
    rotate() {
        const rotated = this.currentPiece.shape[0].map((_, i) =>
            this.currentPiece.shape.map(row => row[i]).reverse()
        );
        const prevShape = this.currentPiece.shape;
        this.currentPiece.shape = rotated;
        if (!this.canMove(0, 0)) {
            this.currentPiece.shape = prevShape;
        }
        this.draw();
    },
    
    canMove(offsetX, offsetY) {
        for (let y = 0; y < this.currentPiece.shape.length; y++) {
            for (let x = 0; x < this.currentPiece.shape[y].length; x++) {
                if (this.currentPiece.shape[y][x]) {
                    const newX = this.currentPiece.x + x + offsetX;
                    const newY = this.currentPiece.y + y + offsetY;
                    if (newX < 0 || newX >= this.COLS || newY >= this.ROWS) return false;
                    if (newY >= 0 && this.board[newY][newX]) return false;
                }
            }
        }
        return true;
    },
    
    lockPiece() {
        this.currentPiece.shape.forEach((row, y) => {
            row.forEach((val, x) => {
                if (val) {
                    const boardY = this.currentPiece.y + y;
                    const boardX = this.currentPiece.x + x;
                    if (boardY >= 0) {
                        this.board[boardY][boardX] = this.currentPiece.color;
                    }
                }
            });
        });
        
        // Clear lines
        for (let y = this.ROWS - 1; y >= 0; y--) {
            if (this.board[y].every(cell => cell)) {
                this.board.splice(y, 1);
                this.board.unshift(Array(this.COLS).fill(0));
                this.score += 100;
                document.getElementById('tetrisScore').textContent = this.score;
                y++;
            }
        }
        
        // New piece
        this.currentPiece = this.nextPiece;
        this.nextPiece = this.createPiece();
        this.drawNextPiece();
        
        // Game over check
        if (!this.canMove(0, 0)) {
            this.gameOver();
        }
    },
    
    draw() {
        // Background
        this.ctx.fillStyle = '#0f172a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Grid
        this.ctx.strokeStyle = '#1e293b';
        for (let y = 0; y < this.ROWS; y++) {
            for (let x = 0; x < this.COLS; x++) {
                this.ctx.strokeRect(x * this.BLOCK_SIZE, y * this.BLOCK_SIZE, this.BLOCK_SIZE, this.BLOCK_SIZE);
            }
        }
        
        // Board
        for (let y = 0; y < this.ROWS; y++) {
            for (let x = 0; x < this.COLS; x++) {
                if (this.board[y][x]) {
                    this.ctx.fillStyle = this.board[y][x];
                    this.ctx.fillRect(x * this.BLOCK_SIZE + 1, y * this.BLOCK_SIZE + 1, this.BLOCK_SIZE - 2, this.BLOCK_SIZE - 2);
                }
            }
        }
        
        // Current piece
        if (this.currentPiece) {
            this.ctx.fillStyle = this.currentPiece.color;
            this.currentPiece.shape.forEach((row, y) => {
                row.forEach((val, x) => {
                    if (val) {
                        this.ctx.fillRect(
                            (this.currentPiece.x + x) * this.BLOCK_SIZE + 1,
                            (this.currentPiece.y + y) * this.BLOCK_SIZE + 1,
                            this.BLOCK_SIZE - 2,
                            this.BLOCK_SIZE - 2
                        );
                    }
                });
            });
        }
    },
    
    drawNextPiece() {
        this.nextCtx.fillStyle = '#0f172a';
        this.nextCtx.fillRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
        
        if (this.nextPiece) {
            const size = 15;
            this.nextCtx.fillStyle = this.nextPiece.color;
            this.nextPiece.shape.forEach((row, y) => {
                row.forEach((val, x) => {
                    if (val) {
                        this.nextCtx.fillRect(x * size + 10, y * size + 10, size - 2, size - 2);
                    }
                });
            });
        }
    },
    
    gameOver() {
        clearInterval(this.gameLoop);
        this.gameLoop = null;
        setTimeout(() => {
            alert(`Game Over! Score: ${this.score}\nClick to play again.`);
            this.resetGame();
            this.draw();
            this.drawNextPiece();
        }, 100);
    }
};

TetrisApp.init();
