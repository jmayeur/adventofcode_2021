
const raw = require('../data');

const parseData = (raw) => {
    const lines = raw.split('\n');
    return lines.map(line => {
        return line.split('').map(v => parseInt(v));
    });
};

const isLowest = (value, rowIndex, colIndex, arr, rowLength, colLength) => {
    if (value === 9){
        // is highest - bail out
        return false;
    }

    // check left
    if (colIndex > 0 && arr[rowIndex][colIndex-1] < value){
        return false; //bail out
    }

    // check up
    if (rowIndex > 0 && arr[rowIndex - 1][colIndex] < value){
        return false; //bail out
    }

    // check right
    if (colIndex < colLength - 1 && arr[rowIndex][colIndex + 1] < value){
        return false; //bail out
    }

    // check down
    if (rowIndex < rowLength - 1 && arr[rowIndex + 1][colIndex] < value){
        return false; //bail out
    }

    return true;
};

const findLowest = (input) => {
    const rowLength = input.length;
    const colLength = input[0].length;
    return input.reduce((acc, row, ri) => {
        row.forEach((col, ci) => {
            if(isLowest(col, ri, ci, input, rowLength, colLength)){
                acc.push(col);
            }
        });
        return acc;
    },[]);
};

const calculateRiskScore = (lowPoints) => {
    return lowPoints.reduce((acc, v) => { return acc + v + 1;}, 0)
};


const arr = parseData(raw);
const lowest = findLowest(arr);
console.log(calculateRiskScore(lowest));
