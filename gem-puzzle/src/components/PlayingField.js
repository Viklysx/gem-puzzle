import Utils from './Utils';

class PlayingField {
    constructor() {
        this.wrapper = document.querySelector('#root');
        this.cellSize = 100;
        if (localStorage.getItem('flag-owl') == null) localStorage.setItem('flag-owl', true);
        else localStorage.setItem('flag-owl', false);
        this.sound = document.createElement("audio");
        this.sound.setAttribute("src", './audio/sound.wav');
        this.wrapper.appendChild(this.sound);  
        this.init();
    }

    init() {
        this.empty = { // пустая ячейка
            value: 0,
            top: 3,
            left: 3
        }
        const mix = JSON.parse(localStorage.getItem('cells-owl-massMix'));
        if (mix != null && mix != 'null') this.massMix = mix;
        else this.massMix = [];    
        this.steps = 0;  
        this.cells = [];       
        this.massReset = [];
        this.nullIndex;
        this.combinationlength;
        this.cells.push(this.empty); // здесь храним информацию о клетках
        this.startCombination();           
        document.querySelector('.text-step-content').innerHTML = '0';
    }

    move(index) {      
        let cell = this.cells[index + 1];
        let stepTextContent = document.querySelector('.text-step-content');
        const leftDiff = Math.abs(this.empty.left - cell.left);
        const topDiff = Math.abs(this.empty.top - cell.top);
        if (leftDiff + topDiff > 1) { // если ячейки не соседние
            return
        }
        this.steps++;       
        this.sound.play();
        this.sound.currentTime = 0.0;
        stepTextContent.innerHTML = this.steps;

        cell.element.style.top = `${this.empty.top*this.cellSize + 150}px`;
        cell.element.style.left = `${this.empty.left*this.cellSize}px`;

        const emptyLeft = this.empty.left; // координаты пустой ячейки
        const emptyTop = this.empty.top;

        this.empty.left = cell.left; // координаты текущей ячейки
        this.empty.top = cell.top;

        cell.left = emptyLeft;
        cell.top = emptyTop;
    }

    moveReload(index) {      
        let cell;
        let stepTextContent = document.querySelector('.text-step-content');
        const cellsOwl = JSON.parse(localStorage.getItem('cells-owl'));
        if (cellsOwl == null || cellsOwl == 'null') cell = this.cells[index + 1];
        else {
            this.cells.forEach((key, i) => {
                if (key.value === (index + 1)) {
                    cell = this.cells[i];
                }
            })
        }
        const leftDiff = Math.abs(this.empty.left - cell.left);
        const topDiff = Math.abs(this.empty.top - cell.top);
        if (leftDiff + topDiff > 1) { // если ячейки не соседние
            return
        }
        this.steps++;
        this.sound.play();
        this.sound.currentTime = 0.0;
        stepTextContent.innerHTML = this.steps;
        cell.element.style.top = `${this.empty.top*this.cellSize + 150}px`;
        cell.element.style.left = `${this.empty.left*this.cellSize}px`;

        const emptyLeft = this.empty.left; // координаты пустой ячейки
        const emptyTop = this.empty.top;

        this.empty.left = cell.left; // координаты текущей ячейки
        this.empty.top = cell.top;

        cell.left = emptyLeft;
        cell.top = emptyTop;
    }

    moveAndFinal(index) {
        this.move(index);
        const final = new Utils(this.cells, this.timerName);
        final.checkFinal();
    }

    moveAndFinalReload(index) {
        this.moveReload(index);
        const final = new Utils(this.cells, this.timerName);
        final.checkFinal();
    }

    startCombination() {
        const cellsOwl = JSON.parse(localStorage.getItem('cells-owl'));
        const numbers = Array.from(Array(16).keys());
        const combination = [];
        const timerTextBlock = this.createElements({
            node: 'div',
            class: 'time-wrapper'
        });
        const stepsTextBlock = this.createElements({
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
        const stepText = this.createElements({
            node: 'span',
            class: 'text-step'
        });
        const stepTextContent = this.createElements({
            node: 'span',
            class: 'text-step-content'
        });
        timer.textContent = 'Время: ';
        minText.textContent = '0 : ';
        secText.textContent = '0';
        stepText.textContent = 'Ходы: ';
        timerTextBlock.append(timer, minText, secText);
        stepsTextBlock.append(stepText, stepTextContent);
        this.wrapper.append(timerTextBlock, stepsTextBlock);
        let value;
        this.timer(0);
        if (cellsOwl == null || cellsOwl == 'null') {
            for (let i = 1; i <= 15; i++) {
                value = numbers[i];
                combination.push(value); // выигрышное расположение элементов
            }
        } else {
            cellsOwl.sort((prev, next) => prev.left - next.left);
            cellsOwl.sort((prev, next) => prev.top - next.top);
            cellsOwl.forEach(keys => {
                combination.push(keys.value);
            });
            this.empty.left = Number(localStorage.getItem('cells-owl-empty-left'));
            this.empty.top = Number(localStorage.getItem('cells-owl-empty-top'));
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
        this.combinationlength = combination.length;
        for (let i = 0; i < combination.length; i++) {
            if (combination[i] === 0) this.nullIndex = i;
            else {
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

                cell.style.top = `${top*this.cellSize + 150}px`;
                cell.style.left = `${left*this.cellSize}px`;
                cell.style['background-position'] = `calc((100% / 3) * ${leftImg}) calc((100% / 3) * ${topImg})`;
                this.wrapper.append(cell);

                cell.addEventListener('click', () => {
                    this.massMix.push(i);
                    localStorage.setItem('cells-owl-massMix', JSON.stringify(this.massMix));
                    // this.move(i);
                    // this.moveAndFinal(combination[i]-1);
                    (combination.length == 16 && i > this.nullIndex) ? this.moveAndFinal(i - 1): this.moveAndFinal(i);
                    localStorage.setItem('cells-owl', null);
                    localStorage.setItem('cells-owl', JSON.stringify(this.cells));
                    localStorage.setItem('cells-owl-empty-left', this.cells[0].left);
                    localStorage.setItem('cells-owl-empty-top', this.cells[0].top);
                    // steps++;
                    // stepTextContent.innerHTML = steps;
                })
            }
        }
        const finalText = this.createElements({
            node: 'div',
            class: 'text-final-block'
        });
        const spanFinalText = this.createElements({
            node: 'span',
            class: 'text-final'
        });
        finalText.append(spanFinalText);
        this.wrapper.append(finalText);

        let elements = document.querySelectorAll('.cell');
        elements.forEach(key => {
            key.style.backgroundImage = `url(./img/${indexImg}.jpg)`;
        })
        this.addButtons();
        if (cellsOwl == null || cellsOwl == 'null') this.stirring();
    }

    createElements(options) {
        this.elem = document.createElement(options.node);
        this.elem.className = options.class;
        return this.elem;
    }

    addButtons() {
        const textTime = document.querySelector('.text-time');
        const textMin = document.querySelector('.text-time-min');
        const textSteps = document.querySelector('.text-step-content');
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
            // this.stirringBack(this.massMix);
            this.stirringBack(JSON.parse(localStorage.getItem('cells-owl-massMix')));
            clearInterval(this.timerName);
            textTime.innerHTML = ' 0';
            textMin.innerHTML = ' 0 :';
            textSteps.innerHTML = '0';
            this.timer(0);
        });

        newGame.addEventListener('click', () => {
            localStorage.setItem('flag-owl', true);
            localStorage.setItem('cells-owl-massMix', null);
            const node = document.querySelector('.root');
            while (node.firstChild) {
                node.removeChild(node.firstChild);
            }
            localStorage.setItem('cells-owl', null);
            this.init();
        });

        viewNumbers.addEventListener('click', () => {
            const spanBlocks = document.querySelectorAll('.span-element');
            spanBlocks.forEach(element => {
                element.classList.toggle('hide');
            })
        });

        sound.addEventListener('click', () => {
            if(!this.sound.classList.contains('sound')) this.sound.muted = true;
            else this.sound.muted = false;          
            this.sound.classList.toggle('sound');
        });
    }

    stirring() {       
        for (let i = 1; i <= 150; i++) {
            let randomNumber = (Math.floor(Math.random() * 15));
            this.move(randomNumber);
            this.massMix.push(randomNumber);
        }
        localStorage.setItem('cells-owl', JSON.stringify(this.cells));
        localStorage.setItem('cells-owl-massMix', JSON.stringify(this.massMix));
        localStorage.setItem('cells-owl-empty-left', this.cells[0].left);
        localStorage.setItem('cells-owl-empty-top', this.cells[0].top);
        this.steps = 0; 
    }

    stirringBack(massMix) {
        
        massMix = massMix.reverse();
        for (let i = 0; i < massMix.length; i++) {
            setTimeout(() => {     
            if (localStorage.getItem('flag-owl') == 'false' || localStorage.getItem('flag-owl') == false) this.moveAndFinalReload(massMix[i]);         
            else this.moveAndFinal(massMix[i]);               
            }, 100 * (i / 2));
        }
        this.steps = 0; 
    }

    timer() {
        let sec = 0;
        let min = 0;
        const textTime = document.querySelector('.text-time');
        const textMin = document.querySelector('.text-time-min');
        this.timerName = setInterval(function () {
            if (sec > 59) {
                sec = 0;
                min++;
                textMin.innerHTML = min + ' :';
            }
            textTime.innerHTML = ' ' + sec;
            sec++;
        }, 1000);
    }
}

export default PlayingField;