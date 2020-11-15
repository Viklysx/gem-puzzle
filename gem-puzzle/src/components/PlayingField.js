import CheckButtons from './CheckButtons';

class PlayingField {
    constructor() {
        this.wrapper = document.querySelector('#root');
        this.cellSize = 100;
        this.init();

    }

    init() {
        this.empty = { // пустая ячейка
            value: 0,
            top: 3,
            left: 3
        }
        this.cells = [];
        this.massMix = [];
        this.massReset = [];
        this.cells.push(this.empty); // здесь храним информацию о клетках
        this.startCombination();
    }

    move(index) {
        const cell = this.cells[index + 1]; // перемещаемый элементы

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
    }

    startCombination() {
        const numbers = Array.from(Array(16).keys());
        const combination = [];
        let value;

        for (let i = 1; i <= 15; i++) {
            value = numbers[i];
            combination.push(value); // выигрышное расположение элементов
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
        let indexImg;
        for (let i = 0; i < 15; i++) {
            const cell = document.createElement('div');

            cell.className = 'cell';
            cell.innerHTML = `<span class="span-element">${combination[i]}</span>`;
            indexImg = (Math.floor(Math.random() * 14 + 1));

            const left = (i) % 4; // позиция ячейки, считая слева
            const top = ((i) - left) / 4;

            const leftImg = (combination[i] - 1) % 4; // позиция ячейки, считая слева
            const topImg = ((combination[i] - 1) - leftImg) / 4;

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
                this.massMix.push(i);
                this.move(i);
            })
        }

        let elements = document.querySelectorAll('.cell');
        elements.forEach(key => {
            key.style.backgroundImage = `url(./img/${indexImg}.jpg)`;
        })
        this.addButtons();
        this.stirring();
    }

    createElements(options) {
        this.elem = document.createElement(options.node);
        this.elem.className = options.class;
        return this.elem;
    }

    addButtons() {
        const wrapButtons = this.createElements({
            node: 'div',
            class: 'root-elements'
        });
        const newGame = this.createElements({
            node: 'button',
            class: 'new-game'
        });
        const reset = this.createElements({
            node: 'button',
            class: 'reset'
        });
        const sound = this.createElements({
            node: 'button',
            class: 'sound'
        });
        const resolve = this.createElements({
            node: 'button',
            class: 'resolve'
        });
        const viewNumbers = this.createElements({
            node: 'button',
            class: 'numbers'
        });
        const rating = this.createElements({
            node: 'button',
            class: 'rating'
        });
        newGame.textContent = 'Новая игра';
        sound.textContent = 'Вкл/выкл звук';
        reset.textContent = 'Сбросить';
        resolve.textContent = 'Решение';
        viewNumbers.textContent = 'Скрыть/показать цифры';
        rating.textContent = 'Топ 10';
        wrapButtons.append(newGame, reset, resolve, viewNumbers, rating, sound);
        this.wrapper.append(wrapButtons);

        resolve.addEventListener('click', () => {
            this.stirringBack(this.massMix);
        });

        newGame.addEventListener('click', () => {
            const node = document.querySelector('.root');
            while (node.firstChild) {
                node.removeChild(node.firstChild);
            }
            this.init();
        });

        viewNumbers.addEventListener('click', () => {
            const spanBlocks = document.querySelectorAll('.span-element');
            spanBlocks.forEach(element => {
                element.classList.toggle('hide');
            })
        });
    }

    stirring() {
        for (let i = 1; i <= 300; i++) {
            let randomNumber = (Math.floor(Math.random() * 15));
            this.move(randomNumber);
            this.massMix.push(randomNumber);
        }
    }

    stirringBack(massMix) {
        massMix = massMix.reverse();
        for (let i = 0; i < massMix.length; i++) {
            setTimeout(() => {
                this.move(massMix[i]);
            }, 100 * (i / 2));
        }
    }
}

export default PlayingField;