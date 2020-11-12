import './css/style.css';
import './css/style.scss';

const root = document.querySelector('#root');
const cellSize = 100;

const empty = { // пустая ячейка
    value: 0,
    top: 0,
    left: 0
}

const cells = [];
cells.push(empty); // здесь храним информацию о клетках

function move(index) {
    const cell = cells[index];
    const leftDiff = Math.abs(empty.left - cell.left);
    const topDiff = Math.abs(empty.top - cell.top);

    if (leftDiff + topDiff > 1) { // если ячейки не соседние
        return
    }

    cell.element.style.top = `${empty.top*cellSize}px`;
    cell.element.style.left = `${empty.left*cellSize}px`;

    const emptyLeft = empty.left; // координаты пустой ячейки
    const emptyTop = empty.top;

    empty.left = cell.left; // координаты текущей ячейки
    empty.top = cell.top;

    cell.left = emptyLeft;
    cell.top = emptyTop;

    const isFinished = cells.every(cell => {
        return cell.value === cell.top * 4 + cell.left;
    });

    if (isFinished) { // если все фишки на своих местах

    }
}

const numbers = [...Array(15).keys()]
    .sort(() => Math.random() - 0.5);
const combination = [];

let value;

for (let i = 1; i <= 15; i++) {
    value = numbers[i - 1] + 1;
    combination.push(value);
}
console.log(combination);

// проверяем комбинацию на решаемость
let z = 0;
for (let i = 0; i < combination.length - 1; i++) {
    for (let j = i + 1; j < combination.length; j++) {
        if (combination[i] > combination[j]) {
            console.log(combination[i], combination[j]);
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

        const left = (i+1) % 4; // позиция ячейки, считая слева
        const top = ((i+1) - left) / 4;

        cells.push({
            value: value,
            left: left,
            top: top,
            element: cell
        })

        cell.style.top = `${top*cellSize}px`;
        cell.style.left = `${left*cellSize}px`;
        root.append(cell);

        cell.addEventListener('click', () => {
            move(i+1);
        })
    }
}