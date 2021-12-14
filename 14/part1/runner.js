const raw = require('../data');

const parseData = (raw) => {
    const sections = raw.split('\n\n');
    const initialSequenceBase = sections[0].split('');

    const pairMappings = sections[1].split('\n').map(line => {
        const [pair, insertion] = line.split(' -> ');
        return {
            pair,
            insertion
        }
    });

    return {
        initialSequenceBase,
        pairMappings,
    }
};

const generatePairs = (initialSequenceBase) => {
    const pairs = [];
    initialSequenceBase.forEach((letter, index) => {
        if(index < initialSequenceBase.length - 1) {
            const pair = letter + initialSequenceBase[index + 1];
            pairs.push(pair);
        }
    });
    return pairs;
}

const generateNextSequenceBase = (pairs, pairMappings) => {
    const nextSequenceBase = [];
    pairs.forEach((pair, index) => {
        const pairParts = pair.split('');
        const insertion = pairMappings.find(mapping => mapping.pair === pair).insertion;
        nextSequenceBase.push(pairParts[0]);
        nextSequenceBase.push(insertion);
        if (index === pairs.length - 1) {
            nextSequenceBase.push(pairParts[1]);
        }
        
    });
    return nextSequenceBase;
};

const countChars = (sequenceBase) => {
    const chars = {};
    sequenceBase.forEach(char => {
        if(!chars[char]) {
            chars[char] = 0;
        }
        chars[char]++;
    });
    return chars;
};

const getDiffBetweenLeastAndMostCommon = (chars) => {
    const sortedChars = Object.values(chars).sort((a, b) => b - a);
    return sortedChars[0] - sortedChars[sortedChars.length - 1];
};

const baseData = parseData(raw);
// console.log(baseData);

let pairs = generatePairs(baseData.initialSequenceBase);
let nextSequenceBase;
// console.log(pairs);

for(let i = 0; i < 7; i++) {
    nextSequenceBase = generateNextSequenceBase(pairs, baseData.pairMappings);
    pairs = generatePairs(nextSequenceBase);
}

const counts = countChars(nextSequenceBase);

const diff = getDiffBetweenLeastAndMostCommon(counts);
console.log(diff);
