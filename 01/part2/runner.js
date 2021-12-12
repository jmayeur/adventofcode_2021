const raw = require('../data');

const parseData = (raw) => {
    const depthStrings = raw.split('\n');
    return depthStrings.map((depth) => parseInt(depth,0));
};

const countIncreases = (depths) => {
    return depths.reduce((increases, depth, index) => {
        if (index === 0 || index + 2 >= depths.length) {
            return increases;
        } 
    
        const sum1 = depths[index - 1] + depth + depths[index + 1];
        const sum2 = depth + depths[index + 1] + depths[index + 2]

        if (sum2 > sum1) {
            return increases + 1;
        }

        return increases;
    }, 0);
}

console.log(countIncreases(parseData(raw)));