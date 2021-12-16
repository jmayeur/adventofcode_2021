const raw = require('../data');

const parseData = (raw) => {
    return raw.split('\n').map(line => {
        return line.split('').map(v => parseInt(v));
    });
};

// Make the matrix bigger and up the risks
const expandTheMatrix = (matrix) => {
    // build the new Matrix 5 times as wide and 5 times as tall
    const newMatrix = Array.from({ length: matrix.length * 5 }, () => Array.from({ length: matrix[0].length * 5 }, () => 0));
    let xLen = matrix[0].length;
    const yLen = matrix.length;
    for (let xplus = 1; xplus < 5; xplus++) {
        for (let y = 0; y < yLen; y++) {
            for (let x = 0; x < xLen; x++) {
                newMatrix[y][x] = matrix[y][x];
                let newVal;
                if (xplus > 1) {
                    newVal = newMatrix[y][(xplus - 1) * xLen + x] + 1;
                } else {
                    newVal = matrix[y][x] + xplus
                }
                if (newVal > 9) {
                    newVal = 1;
                }
                newMatrix[y][xLen * xplus + x] = newVal;
            }
        }
    }

    xLen = newMatrix[0].length;

    for (let yplus = 1; yplus < 5; yplus++) {
        for (let y = 0; y < yLen; y++) {
            for (let x = 0; x < xLen; x++) {

                let newVal;
                if (yplus > 1) {
                    newVal = newMatrix[(yplus - 1) * yLen + y][x] + 1;
                } else {
                    newVal = newMatrix[y][x] + yplus;
                }
                if (newVal > 9) {
                    newVal = 1;
                }
                newMatrix[yLen * yplus + y][x] = newVal;
            }
        }

    }
    return newMatrix;
};

// So this is a nice way to ensure you always pull out the "lowest" risk
// You could also just have an array of risks, and sort it before you pop off
// the lowest risk, but this encapsulates the logic of finding the lowest risk
class PriorityQueue {
    constructor() {
        this.values = [];
    }
    enqueue(vertex, risk) {
        this.values.push({ vertex, risk });
        this.sort();
    };
    dequeue() {
        return this.values.shift();
    };
    sort() {
        this.values.sort((a, b) => a.risk - b.risk);
    };
}

const vKey = (x, y) => `${x}_${y}`;

//Start is 0_0
const buildGraph = (matrix) => {
    let graph = {};
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            const currKey = vKey(x, y);
            const neighbors = [];
            if (x > 0) {
                const leftKey = vKey(x - 1, y);
                neighbors.push(leftKey);
            }
            if (y > 0) {
                const upKey = vKey(x, y - 1);
                neighbors.push(upKey);
            }
            if (x < matrix[y].length - 1) {
                const rightKey = vKey(x + 1, y);
                neighbors.push(rightKey);
            }
            if (y < matrix.length - 1) {
                const downKey = vKey(x, y + 1);
                neighbors.push(downKey);
            }
            graph[currKey] = neighbors;
        }
    }
    return graph;
}

const dijkstrasSP = (startVertex, endVertex, graph) => {
    // List1
    const riskScoreFromStart = {};
    // List2
    const visitedRisks = new PriorityQueue();
    // List3
    const prev = {};

    let current;
    let result = [];

    // We use this to "seed" our risks with Infinity, that way when we calculate
    // the shortest/lowest risk path - we we'll be lower, and can update our "map"
    // with the new risk score
    for (let vertex in graph) {
        if (vertex === startVertex) {
            // we didn't go anywhere, so 0 risk
            riskScoreFromStart[vertex] = 0;
            visitedRisks.enqueue(vertex, 0);
        } else {
            // it will be bad, the risk is incalcuable - really we just need a seed that
            // is higher than any possible risk
            riskScoreFromStart[vertex] = Infinity;
        }
        prev[vertex] = null;
    }

    while (visitedRisks.values.length) {
        // for dijksta's algorithm, we always take the shortest path/lowest risk in our case
        current = visitedRisks.dequeue().vertex;

        // if we're done - lets bail out & record our path
        if (current === endVertex) {
            // Done
            while (prev[current]) {
                result.push(current);
                current = prev[current];
            }
            break;
        }
        else {
            // okay walk neighbors
            for (let neighbor of graph[current]) {
                const [x, y] = neighbor.split('_');

                // add our current accumulated risk to the neighbors risk
                const distance = riskScoreFromStart[current] + matrix[y][x];
                // if that new accumulated risk is less than the current risk to get 
                // to this neighbor, then we update our map with the new risk
                // *prev* is used to track the node that got us to current with the
                // lowest risk
                // then we update our list of visited risks with the new risk & it gets sorted
                // by the priority queue
                if (distance < riskScoreFromStart[neighbor]) {
                    riskScoreFromStart[neighbor] = distance;
                    prev[neighbor] = current;
                    visitedRisks.enqueue(neighbor, distance);
                }
            }
        }
    }

    // return the steps take and order them from the start to the end
    return result.concat(current).reverse();
}

const calculateRisk = (path, matrix) => {
    return path.reduce((acc, curr) => {
        if (curr === '0_0') {
            return acc;
        }
        const [x, y] = curr.split('_');
        return acc + matrix[y][x];
    }, 0);
};


let matrix = parseData(raw);
matrix = expandTheMatrix(matrix);
//console.log(exandedMatrix.map(row => row.join('')).join('\n'));

const graph = buildGraph(matrix);

const leastRiskPath = dijkstrasSP(vKey(0, 0), vKey(matrix[0].length - 1, matrix.length - 1), graph);
const risk = calculateRisk(leastRiskPath, matrix);

console.log(risk);