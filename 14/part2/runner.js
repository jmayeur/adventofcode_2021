const raw = require('../data');

const parseData = (raw) => {
    const sections = raw.split('\n\n');
    const initialSequenceBase = sections[0].split('');

    const pairMappings = sections[1].split('\n').reduce((acc, line) => {
        const [pair, insertion] = line.split(' -> ');
        const [first, second] = pair.split('');
        acc[pair] = { insertion, first, second };
        return acc;
    }, {});

    return {
        initialSequenceBase,
        pairMappings,
    }
};

const increment = (map, key, value) => {
    if (!map[key]) {
        map[key] = 0;
    }
    map[key] += value;
};

const generatePairs = (initialSequenceBase) => {
    const pairs = {};
    initialSequenceBase.forEach((letter, index) => {
        if (index < initialSequenceBase.length - 1) {
            const pair = letter + initialSequenceBase[index + 1];
            increment(pairs, pair, 1);
        }
    });
    return pairs;
};

const getBaseCount = (input) => {
    const chars = {};
    input.forEach(char => {
        if (!chars[char]) {
            chars[char] = 0;
        }
        chars[char]++;
    });
    return chars;
}

/**
 * Not clean code for sure, but basically we can't create an array this big
 * We need maps instead.  It would be cleaner to use an actual Map, but a
 * simple object map suffices.
 * 
 * One thing that kept me running in circles was mutating the map while iterating it
 * Once I made a copy of the map, I could iterate over the orignal and mutate the copy
 * 
 */
const mutatePairs = (pairs, pairMappings, letterCounts) => {
    const newPairs = Object.assign({}, pairs);
    Object.keys(pairs).forEach(pair => {

        const count = pairs[pair];
        if (count >= 1) {
            const [p1, p2] = pair.split('');
            const insertion = pairMappings[pair].insertion;
            const first = p1 + insertion;
            const second = insertion + p2;

            // new Letter 
            increment(letterCounts, insertion, count);
    
            // remove old pair
            increment(newPairs, pair, count * -1);

            // add new pairs
            increment(newPairs, first, count);
            increment(newPairs, second, count);
            //console.log(pairs);
        }
    });
    return newPairs;
};

const getDiffBetweenLeastAndMostCommon = (chars) => {
    const sortedChars = Object.values(chars).sort((a, b) => b - a);
    return sortedChars[0] - sortedChars[sortedChars.length - 1];
};

const baseData = parseData(raw);
//console.log(baseData);

let pairs = generatePairs(baseData.initialSequenceBase);
//console.log(pairs);
const letterCounts = getBaseCount(baseData.initialSequenceBase);

for (let i = 0; i < 5; i++) {
    pairs = mutatePairs(pairs, baseData.pairMappings, letterCounts);    
}

console.log(getDiffBetweenLeastAndMostCommon(letterCounts));