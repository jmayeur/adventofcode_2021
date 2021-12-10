const raw = require('../data');


const parseData = (raw) => {
    const rawBitStrings = raw.split('\n');

    return rawBitStrings.map((bitString) => {
        return bitString.split('').map(bit => parseInt(bit, 0));
        
    });
};

const calculateGammaBits = (bitsArray) => {
    
    const counts = bitsArray.reduce((acc, bits) => {
         bits.forEach((b, i) => {
             acc[i] = (acc[i] || 0) + b;
         });
         return acc;
    }, []);

    return parseInt(counts.map((c) => {
        if (c >= bitsArray.length/2) {
            return 1;
        }
        return 0;
    }).join(''),2);
};

const calculateEpsilonBits = (bitsArray) => {
    
    const counts = bitsArray.reduce((acc, bits) => {
         bits.forEach((b, i) => {
             acc[i] = (acc[i] || 0) + b;
         });
         return acc;
    }, []);

    return parseInt(counts.map((c) => {
        if (c >= bitsArray.length/2) {
            return 0;
        }
        return 1;
    }).join(''),2);
};

const data = parseData(raw);
//console.log(data);
const gamma = calculateGammaBits(data);
const epsilon = calculateEpsilonBits(data);
console.log({gamma, epsilon});
const result = gamma * epsilon;
console.log({result});