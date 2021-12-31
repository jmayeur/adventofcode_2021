const raw = require('../data');

const parseData = (raw) => {
    const lines = raw.split('\n');
    return lines.map(line => {
        return line.split('');
    });
};

const processTurn = (map) => {

    const moved = []
    // East first
    for (let row = 0; row < map.length; row++) {
        let blockFirstCol = false;
        for (let col = 0; col < map[row].length; col++) {
            let key = `${row},${col}`;
            if (map[row][col] === '>' && !moved.includes(key)) {
                if (col < map[row].length - 1) {

                    if (map[row][col + 1] === '.') {
                        map[row][col + 1] = '>';
                        map[row][col] = '.';
                        key = `${row},${col + 1}`;
                        moved.push(key);
                        if (col === 0) {
                            blockFirstCol = true;
                        }
                    }
                } else if (!blockFirstCol) {
                    key = `${row},0`;
                    if (map[row][0] === '.' && !moved.includes(key)) {
                        map[row][0] = '>';
                        map[row][col] = '.';
                        moved.push(key);
                    }
                }
            }
        }
    }

    // Then south
    for (let col = 0; col < map[0].length; col++) {
        let blockFirstRow = false;
        for (let row = 0; row < map.length; row++) {

            let key = `${row},${col}`;
            if (map[row][col] === 'v' && !moved.includes(key)) {
                if (row < map.length - 1) {

                    if (map[row + 1][col] === '.') {
                        map[row + 1][col] = 'v';
                        map[row][col] = '.';
                        key = `${row + 1},${col}`;
                        moved.push(key);
                        if (row === 0) {
                            blockFirstRow = true;
                        }
                    }
                } else if (!blockFirstRow) {
                    key = `0,${col}`;
                    if (map[0][col] === '.' && !moved.includes(key)) {
                        map[0][col] = 'v';
                        map[row][col] = '.';
                        moved.push(key);
                    }
                }
            }
        }
    }
    return moved.length > 0;
};

const printMap = (map) => {
    map.forEach(row => {
        console.log(row.join(''));
    });
    console.log('\n');
}

const map = parseData(raw);
let i;
for (i = 0; i < 10000; i++) {
    // if (i < 10) {
    //     console.log('Step: ' + i);
    //     printMap(map);
    // }
    if (!processTurn(map)) {
        break;
    }
}

console.log(i + 1);
//printMap(map);

/*
Step: 1
....>.>v.>
v.v>.>v.v.
>v>>..>v..
>>v>v>.>.v
.>v.v...v.
v>>.>vvv..
..v...>>..
vv...>>vv.
>.v.v..v.v

Step: 2
>.v.v>>..v
v.v.>>vv..
>v>.>.>.v.
>>v>v.>v>.
.>..v....v
.>v>>.v.v.
v....v>v>.
.vv..>>v..
v>.....vv.

After 2 steps:
>.v.v>>..v
v.v.>>vv..
>v>.>.>.v.
>>v>v.>v>.
.>..v....v
.>v>>.v.v.
v....v>v>.
.vv..>>v..
v>.....vv.


*/