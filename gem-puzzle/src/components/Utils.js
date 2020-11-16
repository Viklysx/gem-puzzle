import PlayingField from './PlayingField';

class Utils {
    constructor(cells, timerName) {
        this.cells = cells;
        this.timerName = timerName;
    }

    checkFinal() {
        let counter = 0;
        this.cells.forEach((keys) => {
            if (keys.value > 0 && keys.value < 5) {
                if (keys.top === 0 && keys.left == keys.value - 1) counter++;
            }
            if (keys.value > 4 && keys.value < 9) {
                if (keys.top === 1 && keys.left == keys.value - 5) counter++;
            }
            if (keys.value > 8 && keys.value < 13) {
                if (keys.top == 2 && keys.left == keys.value - 9) counter++;
            }
            if (keys.value > 12 && keys.value < 16) {
                if (keys.top == 3 && keys.left == keys.value - 13) counter++;
            }
        })
        if (counter >= 15) {  
            clearInterval(this.timerName);
            const cell = document.querySelectorAll('.cell');
            const text = document.querySelector('.text-final');
            const textTime = document.querySelector('.text-time');
            const textMin = document.querySelector('.text-time-min');
            const textSteps = document.querySelector('.text-step-content');
            cell.forEach(element => {
                element.style.border = 'none';
                element.style.borderRadius = '0px';
            })  
            text.innerHTML = `Ура! Вы решили головоломку за ${textMin.textContent}${textTime.textContent} мин и ${textSteps.textContent} ходов`;  
        }
    }
}

export default Utils;