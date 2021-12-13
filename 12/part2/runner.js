const raw = require('../data');

const parseData = (raw) => {
    const lines = raw.split('\n');
    const map = {};
    lines.forEach(line => {
        const parts = line.split('-');
        const key = parts[0];
        const value = parts[1];
        if (!map[key]) { map[key] = [] };
        if (!map[value]) { map[value] = [] };

        map[key].push(value);
        map[value].push(key);

    });
    return map;
};

const allowsMultiVisits = (key) => {
    return /[A-Z]/.test(key);
}

const walkTheMap = (node, path, smallDoubleUsed) => {

    path.push(node);
    if (node === 'end') {
        return [path];
    }

    let found = [];
    for (const de of map[node]) {

        if (de === 'start') {
            continue;
        }

        if (!allowsMultiVisits(de) && path.includes(de)) {
            if (smallDoubleUsed || path.filter(p => p === de).length >= 2) {
                continue;
            } else {
                found = found.concat(walkTheMap(de, [...path], true));
            }
        } else {
            found = found.concat(walkTheMap(de, [...path], smallDoubleUsed));
        }
    }
    return found;
}

const map = parseData(raw);
const paths = walkTheMap('start', [], false).map(path => path.join(','));
console.log(paths.length);