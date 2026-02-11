// Tic-Tac-Toe Game
const TicTacToeApp = {
    board: Array(9).fill(null),
    currentPlayer: 'X',
    gameActive: true,
    
    init() {
        this.render();
    },
    
    render() {
        const grid = document.getElementById('tttGrid');
        grid.innerHTML = '';
        this.board.forEach((cell, i) => {
            const div = document.createElement('div');
            div.className = 'tictactoe-cell';
            div.textContent = cell || '';
            div.style.color = cell === 'X' ? '#ef4444' : '#22c55e';
            div.addEventListener('click', () => this.clickCell(i));
            grid.appendChild(div);
        });
        document.getElementById('tttStatus').textContent = `Player ${this.currentPlayer}'s Turn`;
    },
    
    clickCell(i) {
        if (this.board[i] || !this.gameActive) return;
        this.board[i] = this.currentPlayer;
        
        if (this.checkWin()) {
            this.gameActive = false;
            document.getElementById('tttStatus').textContent = `Player ${this.currentPlayer} Wins!`;
            this.render();
            return;
        }
        
        if (!this.board.includes(null)) {
            this.gameActive = false;
            document.getElementById('tttStatus').textContent = "It's a Draw!";
            this.render();
            return;
        }
        
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        this.render();
    },
    
    checkWin() {
        const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        return wins.some(([a,b,c]) => this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]);
    },
    
    reset() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.render();
    }
};

TicTacToeApp.init();
