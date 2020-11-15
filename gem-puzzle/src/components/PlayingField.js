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
        const timerTextBlock = this.createElements({
            node: 'div',
            class: 'time-wrapper'
        });
        const timer = this.createElements({
            node: 'span',
            class: 'text-step'
        });
        const secText = this.createElements({
            node: 'span',
            class: 'text-time'
        });
        const minText = this.createElements({
            node: 'span',
            class: 'text-time-min'
        });
        const hourText = this.createElements({
            node: 'span',
            class: 'text-time-hour '
        });
        timer.textContent = 'Время: ';
        minText.textContent = '0 : ';
        hourText.textContent = '0 : ';
        timerTextBlock.append(timer, hourText, minText, secText);
        this.wrapper.append(timerTextBlock);
        this.timer(0);
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
        const textTime = document.querySelector('.text-time');
        const textHour = document.querySelector('.text-time-hour');
        const textMin = document.querySelector('.text-time-min');
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
            clearInterval(this.timerName);
            textTime.innerHTML = ' 0';
            textMin.innerHTML = '0 :';
            textHour.innerHTML = '0 :';
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

    timer() {
        let sec = 0;
        let min = 0;
        let hour = 0;
        const textTime = document.querySelector('.text-time');
        const textHour = document.querySelector('.text-time-hour');
        const textMin = document.querySelector('.text-time-min');
        this.timerName = setInterval(function () {
            if (sec > 59) {
                sec = 0;
                min++;
                textMin.innerHTML = min + ' :';
            }
            if (min > 59) {
                min = 0;
                hour++;
                textHour.innerHTML = hour + ' :';
            }
            textTime.innerHTML = ' ' + sec;
            sec++;
        }, 1000);
    }
}

export default PlayingField;