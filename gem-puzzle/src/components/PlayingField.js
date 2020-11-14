class PlayingField {
    constructor() {
        this.wrapper = document.querySelector('#root');
        this.cellSize = 100;
        this.empty = { // пустая ячейка
            value: 0,
            top: 0,
            left: 0
        }
        this.cells = [];
        this.cells.push(this.empty); // здесь храним информацию о клетках
        this.startCombination();
    }

    move(index) {
        const cell = this.cells[index];
        const leftDiff = Math.abs(this.empty.left - cell.left);
        const topDiff = Math.abs(this.empty.top - cell.top);

        if (leftDiff + topDiff > 1) { // если ячейки не соседние
            return
        }

        cell.element.style.top = `${this.empty.top*this.cellSize + 100}px`;
        cell.element.style.left = `${this.empty.left*this.cellSize}px`;

        const emptyLeft = this.empty.left; // координаты пустой ячейки
        const emptyTop = this.empty.top;

        this.empty.left = cell.left; // координаты текущей ячейки
        this.empty.top = cell.top;
        

        cell.left = emptyLeft;
        cell.top = emptyTop;

        let caseСounter = 0;
        this.cells.forEach((keys) => {
            if (keys.value > 0 && keys.value < 5) {
                if (keys.top === 0 && keys.left == keys.value - 1) caseСounter++;
            }
            if (keys.value > 4 && keys.value < 9) {
                if (keys.top === 1 && keys.left == keys.value - 5) caseСounter++;
            }
            if (keys.value > 8 && keys.value < 13) {
                if (keys.top == 2 && keys.left == keys.value - 9) caseСounter++;
            }
            if (keys.value > 12 && keys.value < 16) {
                if (keys.top == 3 && keys.left == keys.value - 13) caseСounter++;
            }
        })

        if (caseСounter == 15) alert('ура!');
    }

    startCombination() {
        const numbers = [...Array(15).keys()]
            .sort(() => Math.random() - 0.5);
        const combination = [];
        let value;

        for (let i = 1; i <= 15; i++) {
            value = numbers[i - 1] + 1;
            combination.push(value);
        }
        // проверяем комбинацию на решаемость
        let z = 0;
        for (let i = 0; i < combination.length - 1; i++) {
            for (let j = i + 1; j < combination.length; j++) {
                if (combination[i] > combination[j]) {
                    z++;
                }
            }
        }
        z = z + 1; // прибавили номер ряда пустой ячейки
        if (z % 2 === 0) {
            let indexImg;
            for (let i = 0; i < 15; i++) {
                const cell = document.createElement('div');

                cell.className = 'cell';               
                cell.innerHTML = `<span>${combination[i]}</span>`;
                indexImg = combination[0];

                const left = (i + 1) % 4; // позиция ячейки, считая слева
                const top = ((i + 1) - left) / 4;

                const leftImg = (combination[i]-1) % 4; // позиция ячейки, считая слева
                const topImg = ((combination[i]-1) - leftImg) / 4;

                this.cells.push({
                    value: combination[i],
                    left: left,
                    top: top,
                    element: cell
                })

                cell.style.top = `${top*this.cellSize + 100}px`;
                cell.style.left = `${left*this.cellSize}px`;
                cell.style['background-position'] = `calc((100% / 3) * ${leftImg}) calc((100% / 3) * ${topImg})`;
                this.wrapper.append(cell);

                cell.addEventListener('click', () => {
                    this.move(i + 1);
                })
            }

            let elements =  document.querySelectorAll('.cell');
            elements.forEach(key => {
                key.style.backgroundImage = `url(./img/${indexImg}.jpg)`;
            })
            this.addButtons();
        } else this.startCombination();
    }

    createElements(options) {
        this.elem = document.createElement(options.node);
        this.elem.className = options.class;
        return this.elem;
    }

    addButtons() {
        const wrapButtons = this.createElements({node: 'div', class: 'root-elements'});
        const newGame = this.createElements({node: 'button', class: 'new-game'});
        const reset = this.createElements({node: 'button', class: 'reset'});
        const sound = this.createElements({node: 'button', class: 'new-game'});
        const resolve = this.createElements({node: 'button', class: 'resolve'});
        const viewNumbers = this.createElements({node: 'button', class: 'resolve'});
        const rating = this.createElements({node: 'button', class: 'reset'});
        newGame.textContent = 'Новая игра';
        sound.textContent = 'Вкл/выкл звук';
        reset.textContent = 'Сбросить';
        resolve.textContent = 'Решение';
        viewNumbers.textContent = 'Скрыть/показать цифры';
        rating.textContent = 'Топ 10';
        wrapButtons.append(newGame, reset, resolve, viewNumbers, rating, sound); 
        this.wrapper.append(wrapButtons);
    }
}

export default PlayingField;