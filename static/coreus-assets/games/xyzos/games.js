// Xyzos OS - Additional Games

// Tic-Tac-Toe
function openTicTacToe() {
    const content = `
        <div class="tictactoe" style="display: flex; flex-direction: column; align-items: center; padding: 1rem; height: 100%; background: var(--bg-dark);">
            <h2 style="margin-bottom: 1rem;">Tic-Tac-Toe</h2>
            <div id="tttStatus" style="margin-bottom: 1rem; font-size: 1.25rem;">Player X's Turn</div>
            <div id="tttBoard" style="display: grid; grid-template-columns: repeat(3, 80px); gap: 5px; margin-bottom: 1rem;">
                ${[...Array(9)].map((_, i) => `
                    <div class="ttt-cell" data-index="${i}" style="width: 80px; height: 80px; background: var(--bg-card); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 2.5rem; cursor: pointer;"></div>
                `).join('')}
            </div>
            <button id="tttRestart" style="padding: 0.75rem 1.5rem; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer;">New Game</button>
        </div>
    `;
    
    const winId = createWindow('Tic-Tac-Toe', '❌', content, { width: '320px', height: '420px' });
    initTicTacToe(winId);
}

function initTicTacToe(winId) {
    const win = document.getElementById(winId);
    const cells = win.querySelectorAll('.ttt-cell');
    const statusEl = win.querySelector('#tttStatus');
    const restartBtn = win.querySelector('#tttRestart');
    
    let board = Array(9).fill(null);
    let currentPlayer = 'X';
    let gameActive = true;
    
    const WIN_PATTERNS = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    
    function checkWinner() {
        for (const pattern of WIN_PATTERNS) {
            const [a, b, c] = pattern;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        if (!board.includes(null)) return 'draw';
        return null;
    }
    
    function handleClick(e) {
        const index = parseInt(e.target.dataset.index);
        if (board[index] || !gameActive) return;
        
        board[index] = currentPlayer;
        e.target.textContent = currentPlayer;
        e.target.style.color = currentPlayer === 'X' ? '#ef4444' : '#22c55e';
        
        const winner = checkWinner();
        if (winner) {
            gameActive = false;
            if (winner === 'draw') {
                statusEl.textContent = "It's a Draw!";
            } else {
                statusEl.textContent = `Player ${winner} Wins!`;
            }
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            statusEl.textContent = `Player ${currentPlayer}'s Turn`;
        }
    }
    
    function restart() {
        board = Array(9).fill(null);
        currentPlayer = 'X';
        gameActive = true;
        statusEl.textContent = "Player X's Turn";
        cells.forEach(cell => {
            cell.textContent = '';
            cell.style.color = '';
        });
    }
    
    cells.forEach(cell => cell.addEventListener('click', handleClick));
    restartBtn.addEventListener('click', restart);
}

// Memory Game
function openMemoryGame() {
    const emojis = ['🎮', '🎯', '🎨', '🎭', '🎪', '🎬', '🎤', '🎧'];
    const cards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    
    const content = `
        <div class="memory" style="display: flex; flex-direction: column; align-items: center; padding: 1rem; height: 100%; background: var(--bg-dark);">
            <h2 style="margin-bottom: 0.5rem;">Memory Match</h2>
            <div style="margin-bottom: 1rem;">
                <span>Moves: <span id="memMoves">0</span></span>
                <span style="margin-left: 1rem;">Pairs: <span id="memPairs">0</span>/8</span>
            </div>
            <div id="memBoard" style="display: grid; grid-template-columns: repeat(4, 60px); gap: 8px;">
                ${cards.map((emoji, i) => `
                    <div class="mem-card" data-index="${i}" data-emoji="${emoji}" style="width: 60px; height: 60px; background: var(--bg-card); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; cursor: pointer; transition: transform 0.3s;"></div>
                `).join('')}
            </div>
            <button id="memRestart" style="margin-top: 1rem; padding: 0.75rem 1.5rem; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer;">New Game</button>
        </div>
    `;
    
    const winId = createWindow('Memory Match', '🧠', content, { width: '320px', height: '420px' });
    initMemoryGame(winId, cards);
}

function initMemoryGame(winId, cardEmojis) {
    const win = document.getElementById(winId);
    const cards = win.querySelectorAll('.mem-card');
    const movesEl = win.querySelector('#memMoves');
    const pairsEl = win.querySelector('#memPairs');
    const restartBtn = win.querySelector('#memRestart');
    
    let flipped = [];
    let matched = [];
    let moves = 0;
    let pairs = 0;
    let locked = false;
    
    function handleCardClick(e) {
        if (locked || flipped.length >= 2 || matched.includes(parseInt(e.target.dataset.index))) return;
        
        const index = parseInt(e.target.dataset.index);
        e.target.textContent = e.target.dataset.emoji;
        e.target.style.transform = 'rotateY(180deg)';
        flipped.push({ el: e.target, index, emoji: e.target.dataset.emoji });
        
        if (flipped.length === 2) {
            moves++;
            movesEl.textContent = moves;
            locked = true;
            
            if (flipped[0].emoji === flipped[1].emoji) {
                matched.push(flipped[0].index, flipped[1].index);
                pairs++;
                pairsEl.textContent = pairs;
                flipped = [];
                locked = false;
                
                if (pairs === 8) {
                    setTimeout(() => alert(`You won in ${moves} moves!`), 300);
                }
            } else {
                setTimeout(() => {
                    flipped.forEach(card => {
                        card.el.textContent = '';
                        card.el.style.transform = '';
                    });
                    flipped = [];
                    locked = false;
                }, 1000);
            }
        }
    }
    
    function restart() {
        flipped = [];
        matched = [];
        moves = 0;
        pairs = 0;
        locked = false;
        movesEl.textContent = '0';
        pairsEl.textContent = '0';
        cards.forEach(card => {
            card.textContent = '';
            card.style.transform = '';
        });
    }
    
    cards.forEach(card => card.addEventListener('click', handleCardClick));
    restartBtn.addEventListener('click', restart);
}

// Pong Game
function openPongGame() {
    const content = `
        <div class="pong" style="display: flex; flex-direction: column; align-items: center; padding: 1rem; height: 100%; background: #000;">
            <div style="display: flex; justify-content: space-between; width: 100%; max-width: 400px; margin-bottom: 1rem; font-size: 1.25rem;">
                <span>Player: <span id="pongPlayer">0</span></span>
                <span>CPU: <span id="pongCPU">0</span></span>
            </div>
            <canvas id="pongCanvas" width="400" height="300" style="border: 2px solid #fff; border-radius: 4px;"></canvas>
            <p style="margin-top: 1rem; color: #666;">Use mouse or click to move paddle</p>
        </div>
    `;
    
    const winId = createWindow('Pong', '🏓', content, { width: '450px', height: '420px' });
    initPongGame(winId);
}

function initPongGame(winId) {
    const win = document.getElementById(winId);
    const canvas = win.querySelector('#pongCanvas');
    const ctx = canvas.getContext('2d');
    const playerScore = win.querySelector('#pongPlayer');
    const cpuScore = win.querySelector('#pongCPU');
    
    let ball = { x: 200, y: 150, dx: 4, dy: 2 };
    let playerPaddle = { y: 125, height: 50 };
    let cpuPaddle = { y: 125, height: 50 };
    let playerPoints = 0;
    let cpuPoints = 0;
    let gameLoop;
    
    function draw() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Center line
        ctx.strokeStyle = '#333';
        ctx.setLineDash([10, 10]);
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Player paddle
        ctx.fillStyle = '#fff';
        ctx.fillRect(10, playerPaddle.y, 8, playerPaddle.height);
        
        // CPU paddle
        ctx.fillRect(canvas.width - 18, cpuPaddle.y, 8, cpuPaddle.height);
        
        // Ball
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, 8, 0, Math.PI * 2);
        ctx.fill();
    }
    
    function update() {
        ball.x += ball.dx;
        ball.y += ball.dy;
        
        // Top/bottom wall
        if (ball.y <= 8 || ball.y >= canvas.height - 8) {
            ball.dy *= -1;
        }
        
        // Player paddle collision
        if (ball.x <= 18 && ball.y >= playerPaddle.y && ball.y <= playerPaddle.y + playerPaddle.height) {
            ball.dx *= -1;
            ball.x = 18;
        }
        
        // CPU paddle collision
        if (ball.x >= canvas.width - 18 && ball.y >= cpuPaddle.y && ball.y <= cpuPaddle.y + cpuPaddle.height) {
            ball.dx *= -1;
            ball.x = canvas.width - 18;
        }
        
        // Scoring
        if (ball.x < 0) {
            cpuPoints++;
            cpuScore.textContent = cpuPoints;
            resetBall();
        }
        if (ball.x > canvas.width) {
            playerPoints++;
            playerScore.textContent = playerPoints;
            resetBall();
        }
        
        // CPU AI
        const targetY = ball.y - cpuPaddle.height / 2;
        cpuPaddle.y += (targetY - cpuPaddle.y) * 0.08;
        
        draw();
    }
    
    function resetBall() {
        ball = { x: 200, y: 150, dx: 4 * (Math.random() > 0.5 ? 1 : -1), dy: (Math.random() - 0.5) * 4 };
    }
    
    function movePlayer(e) {
        const rect = canvas.getBoundingClientRect();
        playerPaddle.y = e.clientY - rect.top - playerPaddle.height / 2;
    }
    
    canvas.addEventListener('mousemove', movePlayer);
    
    gameLoop = setInterval(update, 16);
}

// Whack-a-Mole
function openWhackAMole() {
    const content = `
        <div class="whackamole" style="display: flex; flex-direction: column; align-items: center; padding: 1rem; height: 100%; background: var(--bg-dark);">
            <div style="display: flex; justify-content: space-between; width: 100%; max-width: 400px; margin-bottom: 1rem;">
                <div style="text-align: center;">
                    <div>Score</div>
                    <div id="wamScore" style="font-size: 1.5rem; font-weight: bold;">0</div>
                </div>
                <div style="text-align: center;">
                    <div>Time</div>
                    <div id="wamTime" style="font-size: 1.5rem; font-weight: bold;">30</div>
                </div>
            </div>
            <div id="wamGrid" style="display: grid; grid-template-columns: repeat(3, 80px); gap: 10px;">
                ${[...Array(9)].map((_, i) => `
                    <div class="wam-hole" data-index="${i}" style="width: 80px; height: 80px; background: #8B4513; border-radius: 50%; position: relative; overflow: hidden; cursor: pointer;">
                        <div class="wam-mole" style="width: 60px; height: 60px; background: #654321; border-radius: 50%; position: absolute; bottom: -60px; left: 10px; transition: bottom 0.1s;"></div>
                    </div>
                `).join('')}
            </div>
            <button id="wamStart" style="margin-top: 1rem; padding: 0.75rem 1.5rem; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer;">Start Game</button>
        </div>
    `;
    
    const winId = createWindow('Whack-a-Mole', '🔨', content, { width: '320px', height: '480px' });
    initWhackAMole(winId);
}

function initWhackAMole(winId) {
    const win = document.getElementById(winId);
    const holes = win.querySelectorAll('.wam-hole');
    const moles = win.querySelectorAll('.wam-mole');
    const scoreEl = win.querySelector('#wamScore');
    const timeEl = win.querySelector('#wamTime');
    const startBtn = win.querySelector('#wamStart');
    
    let score = 0;
    let time = 30;
    let gameLoop;
    let moleTimeout;
    let activeMole = null;
    
    function showMole() {
        if (time <= 0) return;
        
        holes.forEach(hole => hole.querySelector('.wam-mole').style.bottom = '-60px');
        activeMole = holes[Math.floor(Math.random() * 9)];
        activeMole.querySelector('.wam-mole').style.bottom = '10px';
        
        moleTimeout = setTimeout(showMole, 800 + Math.random() * 700);
    }
    
    function whack(e) {
        if (!activeMole || e.target !== activeMole.querySelector('.wam-mole')) return;
        score += 10;
        scoreEl.textContent = score;
        e.target.style.bottom = '-60px';
        activeMole = null;
    }
    
    function startGame() {
        score = 0;
        time = 30;
        scoreEl.textContent = '0';
        timeEl.textContent = '30';
        startBtn.disabled = true;
        
        holes.forEach(hole => hole.querySelector('.wam-mole').style.bottom = '-60px');
        clearTimeout(moleTimeout);
        
        showMole();
        
        gameLoop = setInterval(() => {
            time--;
            timeEl.textContent = time;
            if (time <= 0) {
                clearInterval(gameLoop);
                clearTimeout(moleTimeout);
                startBtn.disabled = false;
                alert(`Game Over! Score: ${score}`);
            }
        }, 1000);
    }
    
    moles.forEach(mole => mole.addEventListener('click', whack));
    startBtn.addEventListener('click', startGame);
}

// Sudoku
function openSudoku() {
    const content = `
        <div class="sudoku" style="display: flex; flex-direction: column; align-items: center; padding: 1rem; height: 100%; background: var(--bg-dark);">
            <h2 style="margin-bottom: 1rem;">Sudoku</h2>
            <div id="sudokuGrid" style="display: grid; grid-template-columns: repeat(9, 35px); gap: 1px; background: #333; padding: 2px; border-radius: 4px;"></div>
            <div style="display: flex; gap: 0.5rem; margin-top: 1rem; flex-wrap: wrap; justify-content: center;">
                ${[1,2,3,4,5,6,7,8,9].map(n => `<button class="sudoku-num" data-num="${n}" style="width: 40px; height: 40px; background: var(--bg-card); border: none; border-radius: 4px; color: white; font-size: 1.25rem; cursor: pointer;">${n}</button>`).join('')}
            </div>
            <button id="sudokuNew" style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer;">New Game</button>
        </div>
    `;
    
    const winId = createWindow('Sudoku', '🔢', content, { width: '380px', height: '500px' });
    initSudoku(winId);
}

function initSudoku(winId) {
    const win = document.getElementById(winId);
    const gridEl = win.querySelector('#sudokuGrid');
    const numBtns = win.querySelectorAll('.sudoku-num');
    const newBtn = win.querySelector('#sudokuNew');
    
    let selectedCell = null;
    let solution = [];
    let puzzle = [];
    
    function generateSudoku() {
        // Simple 9x9 grid generation (simplified)
        solution = Array(9).fill().map(() => Array(9).fill(0));
        
        // Fill diagonal boxes (they're independent)
        for (let i = 0; i < 9; i += 3) {
            fillBox(i, i);
        }
        
        // Solve rest
        solveSudoku();
        
        // Create puzzle by removing numbers
        puzzle = solution.map(row => [...row]);
        let attempts = 40;
        while (attempts > 0) {
            const row = Math.floor(Math.random() * 9);
            const col = Math.floor(Math.random() * 9);
            if (puzzle[row][col] !== 0) {
                puzzle[row][col] = 0;
                attempts--;
            }
        }
        
        renderGrid();
    }
    
    function fillBox(row, col) {
        let num;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                do {
                    num = Math.floor(Math.random() * 9) + 1;
                } while (!isSafeBox(row, col, num));
                solution[row + i][col + j] = num;
            }
        }
    }
    
    function isSafeBox(rowStart, colStart, num) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (solution[rowStart + i][colStart + j] === num) return false;
            }
        }
        return true;
    }
    
    function isSafe(grid, row, col, num) {
        for (let x = 0; x < 9; x++) {
            if (grid[row][x] === num || grid[x][col] === num) return false;
        }
        const startRow = row - row % 3;
        const startCol = col - col % 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (grid[startRow + i][startCol + j] === num) return false;
            }
        }
        return true;
    }
    
    function solveSudoku() {
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (solution[row][col] === 0) {
                    for (let num = 1; num <= 9; num++) {
                        if (isSafe(solution, row, col, num)) {
                            solution[row][col] = num;
                            if (solveSudoku()) return true;
                            solution[row][col] = 0;
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }
    
    function renderGrid() {
        gridEl.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                const cell = document.createElement('div');
                cell.style.cssText = `
                    width: 35px;
                    height: 35px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: ${puzzle[i][j] !== 0 ? '#4a5568' : '#2d3748'};
                    color: ${puzzle[i][j] !== 0 ? '#fff' : '#63b3ed'};
                    font-weight: ${puzzle[i][j] !== 0 ? 'bold' : 'normal'};
                    cursor: ${puzzle[i][j] !== 0 ? 'default' : 'pointer'};
                    border: ${(j % 3 === 0) ? '2px solid #666' : '1px solid #444'};
                    border-top: ${(i % 3 === 0) ? '2px solid #666' : '1px solid #444'};
                `;
                cell.textContent = puzzle[i][j] || '';
                
                if (puzzle[i][j] === 0) {
                    cell.addEventListener('click', () => {
                        if (selectedCell) selectedCell.style.background = '#2d3748';
                        selectedCell = cell;
                        cell.style.background = '#4a5568';
                    });
                }
                
                gridEl.appendChild(cell);
            }
        }
    }
    
    numBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (selectedCell) {
                selectedCell.textContent = btn.dataset.num;
                selectedCell.style.background = '#4a5568';
                selectedCell = null;
            }
        });
    });
    
    newBtn.addEventListener('click', generateSudoku);
    generateSudoku();
}

// Connect Four
function openConnectFour() {
    const content = `
        <div class="connect4" style="display: flex; flex-direction: column; align-items: center; padding: 1rem; height: 100%; background: var(--bg-dark);">
            <h2 style="margin-bottom: 0.5rem;">Connect 4</h2>
            <div id="cfStatus" style="margin-bottom: 1rem;">Player Red's Turn</div>
            <div id="cfBoard" style="display: grid; grid-template-columns: repeat(7, 45px); gap: 5px; background: #1e90ff; padding: 10px; border-radius: 10px;">
                ${[...Array(42)].map((_, i) => `
                    <div class="cf-cell" data-index="${i}" style="width: 45px; height: 45px; background: #fff; border-radius: 50%; cursor: pointer;"></div>
                `).join('')}
            </div>
            <button id="cfRestart" style="margin-top: 1rem; padding: 0.75rem 1.5rem; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer;">New Game</button>
        </div>
    `;
    
    const winId = createWindow('Connect 4', '🔴', content, { width: '380px', height: '480px' });
    initConnectFour(winId);
}

function initConnectFour(winId) {
    const win = document.getElementById(winId);
    const cells = win.querySelectorAll('.cf-cell');
    const statusEl = win.querySelector('#cfStatus');
    const restartBtn = win.querySelector('#cfRestart');
    
    let board = Array(6).fill().map(() => Array(7).fill(0));
    let currentPlayer = 1;
    let gameActive = true;
    
    function checkWin() {
        // Check horizontal
        for (let r = 0; r < 6; r++) {
            for (let c = 0; c < 4; c++) {
                if (board[r][c] && board[r][c] === board[r][c+1] && board[r][c] === board[r][c+2] && board[r][c] === board[r][c+3]) {
                    return board[r][c];
                }
            }
        }
        // Check vertical
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 7; c++) {
                if (board[r][c] && board[r][c] === board[r+1][c] && board[r][c] === board[r+2][c] && board[r][c] === board[r+3][c]) {
                    return board[r][c];
                }
            }
        }
        // Check diagonal
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 4; c++) {
                if (board[r][c] && board[r][c] === board[r+1][c+1] && board[r][c] === board[r+2][c+2] && board[r][c] === board[r+3][c+3]) {
                    return board[r][c];
                }
            }
        }
        for (let r = 0; r < 3; r++) {
            for (let c = 3; c < 7; c++) {
                if (board[r][c] && board[r][c] === board[r+1][c-1] && board[r][c] === board[r+2][c-2] && board[r][c] === board[r+3][c-3]) {
                    return board[r][c];
                }
            }
        }
        return null;
    }
    
    function handleClick(e) {
        const index = parseInt(e.target.dataset.index);
        const col = index % 7;
        
        // Find lowest empty row
        let row = -1;
        for (let r = 5; r >= 0; r--) {
            if (board[r][col] === 0) {
                row = r;
                break;
            }
        }
        
        if (row === -1 || !gameActive) return;
        
        board[row][col] = currentPlayer;
        renderBoard();
        
        const winner = checkWin();
        if (winner) {
            gameActive = false;
            statusEl.textContent = `Player ${winner === 1 ? 'Red' : 'Yellow'} Wins!`;
        } else if (board.every(row => row.every(cell => cell !== 0))) {
            gameActive = false;
            statusEl.textContent = "It's a Draw!";
        } else {
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            statusEl.textContent = `Player ${currentPlayer === 1 ? 'Red' : 'Yellow'}'s Turn`;
        }
    }
    
    function renderBoard() {
        for (let r = 0; r < 6; r++) {
            for (let c = 0; c < 7; c++) {
                const cell = cells[r * 7 + c];
                if (board[r][c] === 1) {
                    cell.style.background = '#ef4444';
                } else if (board[r][c] === 2) {
                    cell.style.background = '#eab308';
                } else {
                    cell.style.background = '#fff';
                }
            }
        }
    }
    
    function restart() {
        board = Array(6).fill().map(() => Array(7).fill(0));
        currentPlayer = 1;
        gameActive = true;
        statusEl.textContent = "Player Red's Turn";
        cells.forEach(cell => cell.style.background = '#fff');
    }
    
    cells.forEach(cell => cell.addEventListener('click', handleClick));
    restartBtn.addEventListener('click', restart);
}

// Simon Says
function openSimonSays() {
    const content = `
        <div class="simon" style="display: flex; flex-direction: column; align-items: center; padding: 1rem; height: 100%; background: var(--bg-dark);">
            <h2 style="margin-bottom: 0.5rem;">Simon Says</h2>
            <div id="simonStatus" style="margin-bottom: 1rem;">Press Start to Play</div>
            <div id="simonBoard" style="display: grid; grid-template-columns: repeat(2, 100px); gap: 10px; margin-bottom: 1rem;">
                <div class="simon-btn" data-color="0" style="width: 100px; height: 100px; background: #ef4444; border-radius: 10px 0 0 10px; cursor: pointer;"></div>
                <div class="simon-btn" data-color="1" style="width: 100px; height: 100px; background: #22c55e; border-radius: 0 10px 0 0; cursor: pointer;"></div>
                <div class="simon-btn" data-color="2" style="width: 100px; height: 100px; background: #3b82f6; border-radius: 0 0 0 10px; cursor: pointer;"></div>
                <div class="simon-btn" data-color="3" style="width: 100px; height: 100px; background: #eab308; border-radius: 0 0 10px 0; cursor: pointer;"></div>
            </div>
            <div style="display: flex; gap: 1rem; align-items: center;">
                <div>Score: <span id="simonScore">0</span></div>
                <button id="simonStart" style="padding: 0.5rem 1rem; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer;">Start</button>
            </div>
        </div>
    `;
    
    const winId = createWindow('Simon Says', '🎮', content, { width: '280px', height: '380px' });
    initSimonSays(winId);
}

function initSimonSays(winId) {
    const win = document.getElementById(winId);
    const buttons = win.querySelectorAll('.simon-btn');
    const statusEl = win.querySelector('#simonStatus');
    const scoreEl = win.querySelector('#simonScore');
    const startBtn = win.querySelector('#simonStart');
    
    const colors = ['#ef4444', '#22c55e', '#3b82f6', '#eab308'];
    const lightColors = ['#fca5a5', '#86efac', '#93c5fd', '#fde047'];
    
    let sequence = [];
    let playerSequence = [];
    let score = 0;
    let playing = false;
    
    function flashButton(index) {
        buttons[index].style.background = lightColors[index];
        setTimeout(() => {
            buttons[index].style.background = colors[index];
        }, 300);
    }
    
    function playSequence() {
        playerSequence = [];
        statusEl.textContent = 'Watch...';
        let i = 0;
        const interval = setInterval(() => {
            flashButton(sequence[i]);
            i++;
            if (i >= sequence.length) {
                clearInterval(interval);
                setTimeout(() => {
                    statusEl.textContent = 'Your turn!';
                }, 400);
            }
        }, 600);
    }
    
    function handleButtonClick(e) {
        if (!playing) return;
        
        const index = parseInt(e.target.dataset.color);
        flashButton(index);
        playerSequence.push(index);
        
        const currentIndex = playerSequence.length - 1;
        if (playerSequence[currentIndex] !== sequence[currentIndex]) {
            playing = false;
            statusEl.textContent = `Wrong! Game Over. Score: ${score}`;
            return;
        }
        
        if (playerSequence.length === sequence.length) {
            score++;
            scoreEl.textContent = score;
            statusEl.textContent = 'Correct! Next round...';
            setTimeout(() => {
                sequence.push(Math.floor(Math.random() * 4));
                playSequence();
            }, 1000);
        }
    }
    
    function startGame() {
        sequence = [Math.floor(Math.random() * 4)];
        score = 0;
        scoreEl.textContent = '0';
        playing = true;
        playSequence();
    }
    
    buttons.forEach(btn => btn.addEventListener('click', handleButtonClick));
    startBtn.addEventListener('click', startGame);
}

// Add games to Apps object
Apps.simon = { name: 'Simon Says', icon: '🎮', description: 'Memory game', category: 'Games', executable: () => openSimonSays() };
Apps.memory = { name: 'Memory Match', icon: '🧠', description: 'Card matching game', category: 'Games', executable: () => openMemoryGame() };
Apps.tictactoe = { name: 'Tic-Tac-Toe', icon: '❌', description: 'Classic two-player game', category: 'Games', executable: () => openTicTacToe() };
Apps.pong = { name: 'Pong', icon: '🏓', description: 'Classic paddle game', category: 'Games', executable: () => openPongGame() };
Apps.whackamole = { name: 'Whack-a-Mole', icon: '🔨', description: 'Whack the moles!', category: 'Games', executable: () => openWhackAMole() };
Apps.sudoku = { name: 'Sudoku', icon: '🔢', description: 'Number puzzle game', category: 'Games', executable: () => openSudoku() };
Apps.connect4 = { name: 'Connect 4', icon: '🔴', description: 'Four in a row', category: 'Games', executable: () => openConnectFour() };
