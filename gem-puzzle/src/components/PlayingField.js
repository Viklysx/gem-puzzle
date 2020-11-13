class PlayingField {
    constructor() {
        this.root = document.querySelector('#root');
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

        cell.element.style.top = `${this.empty.top*this.cellSize}px`;
        cell.element.style.left = `${this.empty.left*this.cellSize}px`;

        const emptyLeft = this.empty.left; // координаты пустой ячейки
        const emptyTop = this.empty.top;

        this.empty.left = cell.left; // координаты текущей ячейки
        this.empty.top = cell.top;

        cell.left = emptyLeft;
        cell.top = emptyTop;

        const isFinished = this.cells.every(cell => {
            return cell.value === cell.top * 4 + cell.left;
        });

        if (isFinished) { // если все фишки на своих местах
            alert('ура!')
        }
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
            for (let i = 0; i < 15; i++) {
                const cell = document.createElement('div');

                cell.className = 'cell';
                cell.innerHTML = combination[i];

                const left = (i + 1) % 4; // позиция ячейки, считая слева
                const top = ((i + 1) - left) / 4;

                const leftImg = (combination[i]-1) % 4; // позиция ячейки, считая слева
                const topImg = ((combination[i]-1) - leftImg) / 4;

                this.cells.push({
                    value: value,
                    left: left,
                    top: top,
                    element: cell
                })

                cell.style.top = `${top*this.cellSize}px`;
                cell.style.left = `${left*this.cellSize}px`;
                cell.style['background-position'] = `calc((100% / 3) * ${leftImg}) calc((100% / 3) * ${topImg})`;
                root.append(cell);
                console.log(top, left, combination[i]);

                cell.addEventListener('click', () => {
                    this.move(i + 1);
                })
            }
        } else this.startCombination();
    }


}

export default PlayingField;