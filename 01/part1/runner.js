const raw = require('../data');


const parseData = (raw) => {
    const depthStrings = raw.split('\n');
    return depthStrings.map((depth) => parseInt(depth,0));
};

const countIncreases = (depths) => {
    return depths.reduce((increases, depth, index) => {
        if (index === 0) {
            return increases;
        } 
        if (depth > depths[index - 1]) {
            return increases + 1;
        }

        return increases;
    }, 0);
}

console.log(countIncreases(parseData(raw)));