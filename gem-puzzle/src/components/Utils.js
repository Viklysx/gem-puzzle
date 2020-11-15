import PlayingField from './PlayingField';

class Utils {
    constructor(cells) {
        this.cells = cells;
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
        console.log(counter);
        if (counter >= 15) {
            console.log('ура!');  
            const cell = document.querySelectorAll('.cell');
            cell.forEach(element => {
                element.style.border = 'none';
                element.style.borderRadius = '0px';
            })    
        }
    }
}

export default Utils;