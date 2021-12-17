const raw = require('../data');

const startPosition = { x: 0, y: 0 };
const drag = 1;

const parseTargetArea = (raw) => {
    //target area: x=20..30, y=-10..-5
    const [xRange, yRange] =
        raw.replace('target area:', '')
            .replace(' ', '')
            .split(',')
            .map(line => {
                const [_, range] = line.split('=');
                const [min, max] = range.split('..').map(Number);
                return { min, max }
            });
    return { xRange, yRange };
};

const targetHit = (position, targetArea) => {
    const { xRange, yRange } = targetArea;
    return position.x >= xRange.min && position.x <= xRange.max &&
        position.y >= yRange.min && position.y <= yRange.max;
};

const getVelocityRanges = (targetArea) => {
    const { xRange, yRange } = targetArea;

    // Okay we need to at least make it to the Min
    // Target X - it's a reducing sum ex. (n) =>  (n * (n+1)) / 2;
    // I can approximate that with sqrt(target.min.x);
    // I'll see how taking the ceiling does
    const minXVelocity = Math.ceil(Math.sqrt(xRange.min));

    // starting with x = 0, the most that can be added is
    // the target.max.x
    const maxXVelocity = xRange.max + 1;

    // For y, it can't pass the box on one try, so the
    // floor is the target.min.y
    const minYVelocity = yRange.min;

    // Because y will eventually cross 0 at the same
    // velocity it was launched with, we can just
    // abs the target.min.y
    const maxYVelocity = Math.abs(minYVelocity);

    return {
        xRange: { min: minXVelocity, max: maxXVelocity },
        yRange: { min: minYVelocity, max: maxYVelocity },
    };
};

const checkForFailureState = (position, targetArea, stateObj) => {
    const { x, y } = position;
    const { xRange, yRange } = targetArea;

    let failed = false;
    if (stateObj.xMinCrossed) {
        failed = x > xRange.max;
    } else if (x > xRange.min) {
        stateObj.xMinCrossed = true;
    }

    if (stateObj.yMinCrossed) {
        failed = y < yRange.max;
    } else if (y < yRange.min) {
        stateObj.yMinCrossed = true;
    }
    return { failed, stateObj };
};

const processStep = (position, velocities) => {
    const { x, y } = position;
    const { xVelocity, yVelocity } = velocities;
    const newPosition = { x: x + xVelocity, y: y + yVelocity };
    let nextXVelocity = xVelocity;
    if (nextXVelocity > 0) {
        nextXVelocity -= drag;
    } else if (nextXVelocity < 0) {
        nextXVelocity += drag;
    }
    const newVelocities = { xVelocity: nextXVelocity, yVelocity: yVelocity - drag };
    return { position: newPosition, velocities: newVelocities };
};

const shootEmHigh = (position, velocities, targetArea) => {

    let _position = { ...position };
    let _velocities = { ...velocities };
    let stateObj = { xMinCrossed: false, yMinCrossed: false };
    let highestY = Number.MIN_VALUE;
    while (!checkForFailureState(_position, targetArea, stateObj).failed) {

        const nextStep = processStep(_position, _velocities);
        _position = nextStep.position;
        _velocities = nextStep.velocities;
        highestY = Math.max(highestY, _position.y);
        if (targetHit(_position, targetArea)) {
            return {
                success: true,
                velocities: _velocities,
                position: _position,
                highestY,
            };
        }
    }
    return {
        success: false,
    }
};

const drive = (startPosition, targetArea, velocityRanges) => {
    let highestYDetails = {
        highestY: Number.MIN_VALUE,
        success: false,
    };
    const { xRange, yRange } = velocityRanges;
    for (let yVelocity = yRange.max; yVelocity >= yRange.min; yVelocity--) {
        for (let xVelocity = xRange.max; xVelocity >= xRange.min; xVelocity--) {
            const { success, highestY } = shootEmHigh(startPosition, { xVelocity, yVelocity }, targetArea);
            if (success) {
                if (highestY > highestYDetails.highestY) {
                    highestYDetails = {
                        highestY,
                        xVelocity,
                        yVelocity
                    };
                };
            }
        }
    }
    return highestYDetails;
};

const targetArea = parseTargetArea(raw);
//console.log(targetArea);
const velocityRanges = getVelocityRanges(targetArea);
//console.log(velocityRanges);
const highestYDetails = drive(startPosition, targetArea, velocityRanges);
console.log(highestYDetails);
