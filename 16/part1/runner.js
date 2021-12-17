const raw = require('../data');
const hexToBitsRaw = `0 = 0000
1 = 0001
2 = 0010
3 = 0011
4 = 0100
5 = 0101
6 = 0110
7 = 0111
8 = 1000
9 = 1001
A = 1010
B = 1011
C = 1100
D = 1101
E = 1110
F = 1111`;

const parseHexToBits = (raw) => {
    const lines = raw.split('\n');
    return lines.reduce((acc, line) => {
        const [hex, bits] = line.split(' = ');
        acc[hex] = bits;
        return acc;
    }, {});
}

const convertHexToBits = (hex, hxbMap) => {
    const bits = [];
    return hex.split('').map(char => {
        return hxbMap[char];
    }).join('');
}

const parseBitArray = (bitArray) => {

    if (bitArray.length < 7 ) {
        //console.log('bitArray', bitArray);
        return 0;
    }
    
    const version = parseInt(bitArray.splice(0, 3).join(''), 2);
    const type = parseInt(bitArray.splice(0, 3).join(''), 2);

    //console.log({ version, type });
    let versionSum = version;

    if (type === 4) {
        const bits = [];
        while (true) {
            const next = bitArray.splice(0, 5);
            const flag = next.splice(0, 1);
            bits.push(next.join(''));
            if (flag[0] === '0') {
                break;
            }
        }
        //console.log({ literal: parseInt(bits.join(''), 2) });
        versionSum += parseBitArray(bitArray);
    } else {

        const countType = bitArray.splice(0, 1).join('');
        //console.log({ countType });

        if (countType === '0') {
            const bitsLen = bitArray.splice(0, 15);
            //ERROR - not what I should be doing here, really it s/b
            // parseInt(bitArray.splice(0, 15).join(''), 2);
            //console.log({ bitsLen:bitsLen.length });
            versionSum += parseBitArray(bitArray);
        } else if (countType === '1') {
            const packetsCount = parseInt(bitArray.splice(0, 11).join(''), 2);
            //console.log({ packetsCount }); 
            for (let i = 0; i < packetsCount; i++) {
                versionSum += parseBitArray(bitArray);
            }
        } else {
            throw new Error('Invalid count type');
        }
    }
    return versionSum;
}

const hxbMap = parseHexToBits(hexToBitsRaw);

const bitString = convertHexToBits(raw, hxbMap);
//console.log(bitString);
console.log(parseBitArray(bitString.split('')));

/**
 8A004A801A8002F478
 4   2  1
100 010 1 00000000001 00101010000     00
001 010 1 00000000001 10101000000
101 010 0 000000000001011 11010001111
110 100   01111
VVV TTT I LLLLLLLLLLL AAAAAAAAAAA

620080001611562C8802118E34

011 000 1 00000000010 00000000000 00000010110 
000 000 0 00000001000

101010110001011001000100000000010000100011000111000110100
 */