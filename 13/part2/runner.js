const raw = require('../data');

const buildKey = (raw) => {
    const sections = raw.split('\n\n');

    const points = sections[0].split('\n').map(line => {
        const [x, y] = line.split(',').map(Number);
        return { x, y };
    });

    const foldInstructions = sections[1].split('\n').map(instruction => {
        let inst = instruction.replace('fold along ', '');
        const [axis, distance] = inst.split('=');
        return {
            axis,
            distance: parseInt(distance)
        }
    });

    return {
        points,
        foldInstructions,
    }
};

const getMaxXY = (points) => {
    return points.reduce((acc, point) => {
        return {
            x: Math.max(acc.x, point.x),
            y: Math.max(acc.y, point.y)
        }
    }, { x: Number.MIN_VALUE, y: Number.MIN_VALUE });
};

const drawPoints = (result) => {
    const maxXY = getMaxXY(result.points);

    const out = [];
    for (let y = 0; y <= maxXY.y; y++) {
        let row = '';
        for (let x = 0; x <= maxXY.x; x++) {

            const point_map = `${x}_${y}`;
            if (result.map.includes(point_map)) {
                row += '#';
            } else {
                row += '.';
            }
        }
        out.push(row);
    }
    console.log(out.join('\n'));
};

const key = buildKey(raw);

const result = key.foldInstructions.reduce((acc, fold) => {
    const maxXY = getMaxXY(acc.points);
    return acc.points.reduce((acc, point) => {
        let newPoint = point;
        if (fold.axis === 'x') {
            if (point.x > fold.distance) {
                newPoint = {
                    x: (maxXY.x - point.x),
                    y: point.y
                }
            }

        } else {
            if (point.y > fold.distance) {
                newPoint = {
                    x: point.x,
                    y: (maxXY.y - point.y)
                }
            }
        }
        const point_map = `${newPoint.x}_${newPoint.y}`;
        if (!acc.map.includes(point_map)) {
            acc.map.push(point_map);
            acc.points.push(newPoint);
        }
        return acc;
    }, { map: [], points: [] });
}, { points: key.points });

if (result.points.length < 100) {
    drawPoints(result);
} else {
    console.error('Too many points');
}