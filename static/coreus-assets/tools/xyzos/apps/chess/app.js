// Chess App - Simple Display
const ChessApp = {
    init() {
        const board = document.getElementById('chessBoard');
        const pieces = ['♜','♞','♝','♛','♚','♝','♞','♜','♟','♟','♟','♟','♟','♟','♟','♟','','','','','','','','','','♙','♙','♙','♙','♙','♙','♙','♙','♖','♘','♗','♕','♔','♗','♘','♖'];
        
        for (let i = 0; i < 64; i++) {
            const cell = document.createElement('div');
            cell.className = 'chess-cell ' + ((Math.floor(i / 8) + i) % 2 === 0 ? 'light' : 'dark');
            cell.textContent = pieces[i];
            board.appendChild(cell);
        }
    }
};

ChessApp.init();
