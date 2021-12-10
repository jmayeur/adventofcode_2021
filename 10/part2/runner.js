
const raw = require('../data');

const parseData = (raw) => {
    return raw.split('\n').map(line => line.split(''));
};

const groupMap = {
    '(': ')',
    '[': ']',
    '{': '}',
    "<": '>',
};

const scoreCloseing = (arr) => {
    return arr.reduce((acc, line) => {

        let stack = [];

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (groupMap[char]) {
                stack.push(char);
            } else {
                if (stack.length < 1 && i !== line.length - 1) {
                    stack = [];
                    // bad line - skip it
                    break;
                } else {
                    const lastOpen = stack.pop();
                    if (groupMap[lastOpen] !== char) {
                        stack = [];
                        // bad line - skip it
                        break;
                    }
                }
            }
        }

        if (stack.length > 0) {
            acc.push(scoreIt(stack));
        }

        return acc;
    }, []);

};

const values = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4,
}

const scoreIt = (opens) => {
    const closes = opens.reverse().map(o => groupMap[o]);
    return closes.reduce((acc, v) => {
        return (acc * 5) + values[v];
    }, 0);
}

const findMiddle = (scores) => {
    const sortedScores = scores.sort((a, b) => a - b);
    return sortedScores[Math.ceil(scores.length / 2) - 1];
};

const data = parseData(raw);
console.log(findMiddle(scoreCloseing(data)));