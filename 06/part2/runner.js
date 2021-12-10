const raw = require('../data');

const parseData = (raw) => {
    const lines = raw.split('\n');
    return lines[0].split(',').map(v => parseInt(v));
};

const buildAgeMap = (inputArray) => {
    const ageMap = {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
    };

    inputArray.forEach(v => {
        ageMap[v] += 1;
    });

    return ageMap;
};

const ageTheFish = (ageMap) => {

    let newEights = 0;
    let newSixes = 0;
    for (let i = 0; i <= 8; i++) {
        if (i === 0) {
            newEights = ageMap[i];
            newSixes = newEights;
            ageMap[i] = ageMap[i + 1];
        } else if (i === 8) {
            ageMap[i] = newEights;
        } else {
            ageMap[i] = ageMap[i + 1];
        }
    }
    ageMap[6] = ageMap[6] + newSixes;
};

const runSimulation = (days, ageMap) => {
    for (let i = 0; i < days; i++) {
        ageTheFish(ageMap);
    }
    return Object.values(ageMap).reduce((acc, v) => acc + v);
};

let initialArray = parseData(raw);


const ageMap = buildAgeMap(initialArray);
const result = runSimulation(256, ageMap);
console.log({ result });


