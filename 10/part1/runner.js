
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

const findFirstIllegalChars = (arr) => {
    return arr.reduce((acc, line) => {

        const stack = [];

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (groupMap[char]) {
                stack.push(char);
            } else {
                if (stack.length < 1 && i !== line.length - 1) {
                    acc.push(char);
                    break;
                } else {
                    const lastOpen = stack.pop();
                    if (groupMap[lastOpen] !== char) {
                        acc.push(char);
                        break;
                    }
                }
            }
        }

        return acc;
    }, []);
};

const values = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137,
    
}
const scoreIllegals = (illegals)=> {
    return illegals.reduce((acc, v) => acc+ values[v],0)
};

const data = parseData(raw);
console.log(scoreIllegals(findFirstIllegalChars(data)));