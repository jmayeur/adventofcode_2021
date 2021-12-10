const raw = require('../data');


const parseData = (raw) => {
    const lines = raw.split('\n');
    return lines.map((line) => {
        const pointsRaw = line.split(' -> ');
        const sE = pointsRaw[0].split(',');
        const eE = pointsRaw[1].split(',');
        return {
            x1: parseInt(sE[0]),
            y1: parseInt(sE[1]),
            x2: parseInt(eE[0]),
            y2: parseInt(eE[1]),
        }
    });
};

const filterForOnlyHorVerDia = (lines) => {
    return lines.filter((line) => {
        return line.x1 === line.x2 || line.y1 === line.y2 || (Math.abs(line.x1 - line.x2) === Math.abs(line.y1 - line.y2));
    });
};

const buildAndPopulateGrid = (lines) => {
    const result = {};

    lines.forEach((line) => {

        let x = line.x1;
        let y = line.y1;
        let key = `${x}_${y}`;
        if (result[key] === undefined) {
            result[key] = 0;
        }
        result[key] += 1;

        while (x !== line.x2 || y !== line.y2) {
            if (line.x2 !== line.x1) x = (line.x2 >= line.x1) ? x + 1: x - 1;
            if (line.y2 !== line.y1) y = (line.y2 >= line.y1) ? y + 1: y - 1;
            key = `${x}_${y}`;
            if (result[key] === undefined) {
                result[key] = 0;
            }
            result[key] += 1;
        }
    });
    return result;
};

const countMultiHits = (grid) => {
    return Object.values(grid).filter(v => v > 1).length;
};

const lines = parseData(raw);
const filterLines = filterForOnlyHorVerDia(lines);
const grid = buildAndPopulateGrid(filterLines);
console.log(countMultiHits(grid));



