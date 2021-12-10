const raw = require('../data');


const parseData = (raw) => {
    const lines = raw.split('\n');
    return lines[0].split(',').map(v => parseInt(v));
};

const ageArray = (inputArray) => {
    const newLaternfish = [];

    const outPutArrayBase = inputArray.map(laternfish => {

        let newAge;
        if (laternfish === 0) {
            newAge = 6;
            newLaternfish.push(8);
        } else {
            newAge = laternfish - 1;
        }
        return newAge;
    });

    return outPutArrayBase.concat(newLaternfish);
};

const runSimulation = (days, intialArray) => {

    let laternFishArray = initialArray.slice();
    for (let i = 0; i < days; i++) {
        laternFishArray = ageArray(laternFishArray);
    }
    return laternFishArray.length;
};
const initialArray = parseData(raw);
console.log(initialArray);
const result = runSimulation(80, initialArray);
console.log({ result });


