const raw = require('../data');

const parseData = (raw) => {
    const lines = raw.split('\n');
    return lines.map(line => line.split('').map(v => parseInt(v)));
};

const increment = (row, col, maxRow, maxCol, initNextState, flashedIndex, flashIndex) => {

    if (row <= maxRow && col <= maxCol && row >= 0 && col >= 0) {
        const key = `${row}_${col}`;
        if (!flashedIndex.includes(key)) {
            initNextState[row][col] = initNextState[row][col] + 1;

            if (initNextState[row][col] === 10) {
                initNextState[row][col] = 0;
                flashedIndex.push(key);
                flashIndex.push({ row, col });
            }
        }

    }
};

const processNeighbors = (rowCol, initNextState, flashedIndex, flashIndex) => {
    const maxRow = initNextState.length - 1;
    const maxCol = initNextState[0].length - 1;

    for (let row = rowCol.row - 1; row <= rowCol.row + 1; row++) {
        for (let col = rowCol.col - 1; col <= rowCol.col + 1; col++) {

            if (rowCol.col === col && rowCol.row === row) {
                //noop

            } else {
                increment(row, col, maxRow, maxCol, initNextState, flashedIndex, flashIndex);
            }
        }
    }
    return initNextState;
};

const processStep = (currentState) => {

    const flashedIndex = [];
    const flashIndex = [];
    let initNextState = currentState.map((stateLine, row) => {
        return stateLine.map((state, col) => {

            let nextState = state + 1;
            if (nextState === 10) {
                nextState = 0;
                flashIndex.push({ row, col });
                flashedIndex.push(`${row}_${col}`);
            }
            return nextState;
        });
    });

    while (flashIndex.length > 0) {
        initNextState = processNeighbors(flashIndex.splice(0, 1)[0], initNextState, flashedIndex, flashIndex);
    }
    return { initNextState, flashes: flashedIndex.length }
};

const checkStateFreshness = (state) => {
    const sum = state.reduce((rowAcc, row) => { 
        return rowAcc + row.reduce((colAcc, col) => {
            return colAcc + col;
        }, 0);
    }, 0);
    return 0 === sum;
};

const state = parseData(raw);

let nextState = state;
let result;
let hits = 0;
for (let i = 1; i <= 1000; i++) {
    result = processStep(nextState);
    nextState = result.initNextState;
    if(checkStateFreshness(nextState)) {
        console.log(i);
        break;
    }
}