
const raw = require('../data');

const parseData = (raw) => {
    const lines = raw.split('\n');
    return lines.map(line => {
        return line.split('').map(v => parseInt(v));
    });
};

const isLowest = (value, rowIndex, colIndex, arr, rowLength, colLength) => {
    if (value === 9) {
        // is highest - bail out
        return false;
    }

    // check left
    if (colIndex > 0 && arr[rowIndex][colIndex - 1] < value) {
        return false; //bail out
    }

    // check up
    if (rowIndex > 0 && arr[rowIndex - 1][colIndex] < value) {
        return false; //bail out
    }

    // check right
    if (colIndex < colLength - 1 && arr[rowIndex][colIndex + 1] < value) {
        return false; //bail out
    }

    // check down
    if (rowIndex < rowLength - 1 && arr[rowIndex + 1][colIndex] < value) {
        return false; //bail out
    }

    return true;
};

const walkUntilNine = (rowIndex, colIndex, arr, rowLength, colLength, visited) => {

    let result = 1;
    let nColIndex;
    let nRowIndex;
    let nValue;
    let slot;
    // up
    nColIndex = colIndex;
    nRowIndex = rowIndex - 1;
    slot = `${nRowIndex}_${nColIndex}`;
    if (nRowIndex >= 0 && !visited.includes(slot)) {
        visited.push(slot);
        nValue = arr[nRowIndex][nColIndex];
        if (nValue !== 9) {
            // console.log('up', nValue);
            result = result + walkUntilNine(nRowIndex, nColIndex, arr, rowLength, colLength, visited);
        }
    }

    // right
    nColIndex = colIndex + 1;
    nRowIndex = rowIndex;
    slot = `${nRowIndex}_${nColIndex}`;
    if (nColIndex < colLength && !visited.includes(slot)) {
        visited.push(slot);
        nValue = arr[nRowIndex][nColIndex];
        if (nValue !== 9) {
            // console.log('right', nValue);
            result = result + walkUntilNine(nRowIndex, nColIndex, arr, rowLength, colLength, visited);
        }
    }

    // down
    nColIndex = colIndex;
    nRowIndex = rowIndex + 1;
    slot = `${nRowIndex}_${nColIndex}`;
    if (nRowIndex < rowLength && !visited.includes(slot)) {
        visited.push(slot);
        nValue = arr[nRowIndex][nColIndex];
        if (nValue !== 9) {
            // console.log('down', nValue);
            result = result + walkUntilNine(nRowIndex, nColIndex, arr, rowLength, colLength, visited);
        }
    }

    // left
    nColIndex = colIndex - 1;
    nRowIndex = rowIndex;
    slot = `${nRowIndex}_${nColIndex}`;
    if (nColIndex >= 0 && !visited.includes(slot)) {
        visited.push(slot);
        nValue = arr[nRowIndex][nColIndex];
        if (nValue !== 9) {
            // console.log('left', nValue);
            result = result + walkUntilNine(nRowIndex, nColIndex, arr, rowLength, colLength, visited);
        }
    }

    return result;
};

const findBasins = (input) => {
    const rowLength = input.length;
    const colLength = input[0].length;
    return input.reduce((acc, row, ri) => {
        row.forEach((col, ci) => {
            if (isLowest(col, ri, ci, input, rowLength, colLength)) {
                const slot = `${ri}_${ci}`;
                const basinScore = walkUntilNine(ri, ci, input, rowLength, colLength, [slot]);
                // console.log({ col, basinScore })
                acc.push(basinScore);
            }
        });
        return acc;
    }, []);
};

const calcuateRisk = (basinScores) => {
    return basinScores.sort((a,b) => b - a).slice(0,3).reduce((acc, v) => acc * v, 1);
}

const arr = parseData(raw);
const basins = findBasins(arr);
console.log(calcuateRisk(basins));
