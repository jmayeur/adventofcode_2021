const raw = require('../data');


const parseData = (raw) => {
    const rawBitStrings = raw.split('\n');

    return rawBitStrings.map((bitString) => {
        return bitString.split('').map(bit => parseInt(bit, 0));

    });
};

const getDominantValueForIndex = (index, bitsArray) => {

    let z_count = 0;
    let o_count = 0;

    bitsArray.forEach((bits) => {
        if (bits[index] === 1) {
            o_count = o_count + 1;
        } else {
            z_count = z_count + 1;
        }
    });

    if (z_count > o_count) {
        return 0;
    } else if (z_count === o_count) {
        return 1;
    }
    return 1;
};

const getRecessiveValueForIndex = (index, bitsArray) => {

    let z_count = 0;
    let o_count = 0;

    bitsArray.forEach((bits) => {
        if (bits[index] === 1) {
            o_count = o_count + 1;
        } else {
            z_count = z_count + 1;
        }
    });

    if (z_count < o_count) {
        return 0;
    } else if (z_count === o_count) {
        return 0;
    }
    return 1;
};

const calculateOxygen = (bitsArray) => {

    let currentIndex = 0;
    let activeArray = [...bitsArray];

    while (true) {

        const match = getDominantValueForIndex(currentIndex, activeArray);
        activeArray = activeArray.filter((bits) => {
            return bits[currentIndex] === match;
        });
        currentIndex++;
        if (activeArray.length <= 1) {
            break;
        }

    }

    return parseInt(activeArray[0].join(''), 2);

};

const calculateCO2 = (bitsArray) => {

    let currentIndex = 0;
    let activeArray = [...bitsArray];

    while (true) {

        const match = getRecessiveValueForIndex(currentIndex, activeArray);
        activeArray = activeArray.filter((bits) => {
            return bits[currentIndex] === match;
        });
        currentIndex++;
        if (activeArray.length <= 1) {
            break;
        }

    }

    return parseInt(activeArray[0].join(''), 2);

};


const bitsArray = parseData(raw);
//console.log(bitsArray);
const oxygen = calculateOxygen(bitsArray);
const CO2 = calculateCO2(bitsArray);
console.log({ oxygen, CO2 });
console.log({ result: oxygen * CO2 });
