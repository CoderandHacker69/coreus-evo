// 2048 Game
const Game2048App = {
    grid: [],
    score: 0,
    
    init() {
        this.grid = Array(4).fill().map(() => Array(4).fill(0));
        this.score = 0;
        this.addRandomTile();
        this.addRandomTile();
        this.render();
        
        document.addEventListener('keydown', (e) => this.handleKey(e));
        
        let startX, startY;
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        document.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const dx = endX - startX;
            const dy = endY - startY;
            if (Math.abs(dx) > Math.abs(dy)) {
                if (dx > 30) this.move('right');
                else if (dx < -30) this.move('left');
            } else {
                if (dy > 30) this.move('down');
                else if (dy < -30) this.move('up');
            }
        });
    },
    
    addRandomTile() {
        const empty = [];
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                if (this.grid[y][x] === 0) empty.push({ x, y });
            }
        }
        if (empty.length > 0) {
            const tile = empty[Math.floor(Math.random() * empty.length)];
            this.grid[tile.y][tile.x] = Math.random() < 0.9 ? 2 : 4;
        }
    },
    
    render() {
        const gridEl = document.getElementById('game2048Grid');
        gridEl.innerHTML = '';
        const colors = { 0: 'rgba(238, 228, 218, 0.35)', 2: '#eee4da', 4: '#ede0c8', 8: '#f2b179', 16: '#f59563', 32: '#f67c5f', 64: '#f65e3b', 128: '#edcf72', 256: '#edcc61', 512: '#edc850', 1024: '#edc53f', 2048: '#edc22e' };
        
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                const cell = document.createElement('div');
                cell.className = 'game2048-cell';
                cell.style.background = colors[this.grid[y][x]] || '#3c3a32';
                cell.style.color = this.grid[y][x] <= 4 ? '#776e65' : '#f9f6f2';
                cell.textContent = this.grid[y][x] || '';
                gridEl.appendChild(cell);
            }
        }
        document.getElementById('game2048Score').textContent = this.score;
    },
    
    slide(row) {
        let arr = row.filter(val => val);
        let missing = 4 - arr.length;
        arr = arr.concat(Array(missing).fill(0));
        for (let i = 0; i < 3; i++) {
            if (arr[i] && arr[i] === arr[i + 1]) {
                arr[i] *= 2;
                this.score += arr[i];
                arr[i + 1] = 0;
            }
        }
        arr = arr.filter(val => val);
        missing = 4 - arr.length;
        return arr.concat(Array(missing).fill(0));
    },
    
    move(direction) {
        let moved = false;
        const oldGrid = JSON.stringify(this.grid);
        
        if (direction === 'left' || direction === 'right') {
            for (let y = 0; y < 4; y++) {
                this.grid[y] = this.slide(this.grid[y]);
                if (direction === 'right') this.grid[y].reverse();
            }
        } else {
            for (let x = 0; x < 4; x++) {
                const col = [this.grid[0][x], this.grid[1][x], this.grid[2][x], this.grid[3][x]];
                const newCol = this.slide(col);
                if (direction === 'down') newCol.reverse();
                for (let y = 0; y < 4; y++) this.grid[y][x] = newCol[y];
            }
        }
        
        if (JSON.stringify(this.grid) !== oldGrid) {
            this.addRandomTile();
            this.render();
        }
    },
    
    handleKey(e) {
        switch (e.key) {
            case 'ArrowLeft': this.move('left'); break;
            case 'ArrowRight': this.move('right'); break;
            case 'ArrowUp': this.move('up'); break;
            case 'ArrowDown': this.move('down'); break;
        }
    }
};

Game2048App.init();
