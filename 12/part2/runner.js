
const raw = require('../testdata');

const parseData = (raw) => {
    const lines = raw.split('\n');
    return lines[0].split(',').map(v => parseInt(v));
};
