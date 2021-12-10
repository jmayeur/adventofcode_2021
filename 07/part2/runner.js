
const raw = require('../data');

const parseData = (raw) => {
    const lines = raw.split('\n');
    return lines[0].split(',').map(v => parseInt(v));
};

const getHighLow = (input) => {
    return input.reduce((acc, v) => {
        if (v > acc.high) {
            acc.high = v;
        }
        if (v < acc.low) {
            acc.low = v;
        }

        return acc;

    },
        {
            high: Number.MIN_VALUE,
            low: Number.MAX_VALUE
        }
    )
};

const getFuelCosts = (n) => {
    return (n * (n + 1)) / 2
}

const getFewestSteps = (minMax, input) => {
    let result = Number.MAX_VALUE;

    for (let i = minMax.low; i <= minMax.high; i++) {
        const tempResult = input.reduce((acc, v) => {
            return acc + getFuelCosts(Math.abs(i - v));
        }, 0);

        if (tempResult < result) {
            result = tempResult;
        }
    }

    return result;
};

const hPosArray = parseData(raw);
const minMax = getHighLow(hPosArray);
const fewestSteps = getFewestSteps(minMax, hPosArray);
console.log(fewestSteps);

