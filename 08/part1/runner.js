
const raw = require('../data');

const fixedDigits = {
    7: 3,
    4: 4,
    1: 2,
    8: 7,
}

const parseDataTest = (raw) => {
    const lines = raw.split('\n');
    return lines.reduce((acc, line, i) => {

        if (i % 2) {
            return acc;
        }
        const sigs = line.replace(' |', '').split(' ');
        const outs = lines[i + 1].split(' ');
        const data = {
            sigs,
            outs,
        };
        acc.push(data);
        return acc;
    }, []);
};


const parseData = (raw) => {
    const lines = raw.split('\n');
    return lines.map(line => {
        const parts = line.split(' | ');

        const sigs = parts[0].split(' ');
        const outs = parts[1].split(' ');
        return  {
            sigs,
            outs,
        };
        
    });
};

const countKnownOutputs = (data) => {
    return data.reduce((acc, item) => {
        return acc + item.outs.reduce((ia, ii) => {
            return ia + (Object.values(fixedDigits).includes(ii.length) ? 1 : 0);
        }, 0);
    }, 0);
};

const data = parseData(raw);
const out = countKnownOutputs(data);
console.log({out});
