// Memory Match Game
const MemoryApp = {
    emojis: ['🎮','🎯','🎨','🎭','🎪','🎬','🎤','🎧'],
    cards: [],
    flipped: [],
    matched: [],
    moves: 0,
    pairs: 0,
    locked: false,
    
    init() {
        this.cards = [...this.emojis, ...this.emojis].sort(() => Math.random() - 0.5);
        this.render();
    },
    
    render() {
        const grid = document.getElementById('memoryGrid');
        grid.innerHTML = '';
        this.cards.forEach((emoji, i) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            if (this.flipped.includes(i) || this.matched.includes(i)) {
                card.classList.add('flipped');
                card.textContent = emoji;
            }
            if (this.matched.includes(i)) card.classList.add('matched');
            card.addEventListener('click', () => this.clickCard(i));
            grid.appendChild(card);
        });
        document.getElementById('memoryMoves').textContent = this.moves;
        document.getElementById('memoryPairs').textContent = this.pairs;
    },
    
    clickCard(i) {
        if (this.locked || this.flipped.includes(i) || this.matched.includes(i)) return;
        this.flipped.push(i);
        this.render();
        
        if (this.flipped.length === 2) {
            this.moves++;
            this.locked = true;
            const [a, b] = this.flipped;
            if (this.cards[a] === this.cards[b]) {
                this.matched.push(a, b);
                this.pairs++;
                this.flipped = [];
                this.locked = false;
                this.render();
                if (this.pairs === 8) setTimeout(() => alert(`You won in ${this.moves} moves!`), 300);
            } else {
                setTimeout(() => {
                    this.flipped = [];
                    this.locked = false;
                    this.render();
                }, 1000);
            }
        }
    }
};

MemoryApp.init();
