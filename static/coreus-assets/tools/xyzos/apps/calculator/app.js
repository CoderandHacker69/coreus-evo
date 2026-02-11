// Calculator App
const CalcApp = {
    currentValue: '0',
    previousValue: '',
    operator: '',
    shouldResetScreen: false,
    
    init() {
        const expression = document.getElementById('calcExpression');
        const result = document.getElementById('calcResult');
        
        document.querySelectorAll('.calc-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const value = btn.dataset.value;
                const action = btn.dataset.action;
                
                if (value !== undefined) {
                    if (this.currentValue === '0' || this.shouldResetScreen) {
                        this.currentValue = value === '.' ? '0.' : value;
                        this.shouldResetScreen = false;
                    } else {
                        if (value === '.' && this.currentValue.includes('.')) return;
                        this.currentValue += value;
                    }
                }
                
                if (action === 'clear') {
                    this.currentValue = '0';
                    this.previousValue = '';
                    this.operator = '';
                } else if (action === 'negate') {
                    this.currentValue = (parseFloat(this.currentValue) * -1).toString();
                } else if (action === 'percent') {
                    this.currentValue = (parseFloat(this.currentValue) / 100).toString();
                } else if (action === 'operator') {
                    if (this.operator && this.previousValue) {
                        this.calculate();
                    }
                    this.operator = btn.dataset.op;
                    this.previousValue = this.currentValue;
                    this.shouldResetScreen = true;
                } else if (action === 'equals') {
                    if (this.operator && this.previousValue) {
                        this.calculate();
                        this.operator = '';
                    }
                }
                
                result.textContent = this.currentValue;
                expression.textContent = `${this.previousValue} ${this.operator}`;
            });
        });
    },
    
    calculate() {
        const prev = parseFloat(this.previousValue);
        const curr = parseFloat(this.currentValue);
        let res;
        switch (this.operator) {
            case '+': res = prev + curr; break;
            case '-': res = prev - curr; break;
            case '*': res = prev * curr; break;
            case '/': res = prev / curr; break;
        }
        this.currentValue = res.toString();
        this.previousValue = '';
    }
};

CalcApp.init();
