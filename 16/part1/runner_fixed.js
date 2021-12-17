const raw = require('../data');

const getHexToBitsMap = () => {
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
    const lines = hexToBitsRaw.split('\n');
    return lines.reduce((acc, line) => {
        const [hex, bits] = line.split(' = ');
        acc[hex] = bits;
        return acc;
    }, {});
};

const convertHexStringToBitArray = (hex, hexToBitsMap) => {
    return hex.split('').map(char => {
        return hexToBitsMap[char];
    }).join('').split('');
}

const calculateVersionSum = (bitArray) => {

    let versionSum = 0;
    while (bitArray.length >= 6) {
        const version = parseInt(bitArray.splice(0, 3).join(''), 2);
        const type = parseInt(bitArray.splice(0, 3).join(''), 2);
        versionSum += version;

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
            //End of the line - this is a literal and doesn't have subsets
            return versionSum;
        } else {

            const countType = bitArray.splice(0, 1).join('');

            if (countType === '0') {
                const subSetBitCount = parseInt(bitArray.splice(0, 15).join(''), 2);
                const subSetBitArray = bitArray.splice(0, subSetBitCount);
                while (subSetBitArray.length > 0) {
                    versionSum += calculateVersionSum(subSetBitArray);
                }
            } else if (countType === '1') {
                const packetsCount = parseInt(bitArray.splice(0, 11).join(''), 2);
                for (let i = 0; i < packetsCount; i++) {
                    versionSum += calculateVersionSum(bitArray);
                }
            } else {
                throw new Error('Invalid count type');
            }
        }
    }
    return versionSum;
}

const hexToBitsMap = getHexToBitsMap();
//console.log(hexToBitsMap)

const bitsArray = convertHexStringToBitArray(raw, hexToBitsMap);
//console.log(bitsArray.join(''));

const versionSum = calculateVersionSum(bitsArray);
console.log(versionSum);

/**
 8A004A801A8002F478
 4   2  1
100 010 1 00000000001 00101010000     00
001 010 1 00000000001 10101000000
101 010 0 000000000001011 11010001111
110 100   01111
VVV TTT I LLLLLLLLLLL AAAAAAAAAAA
100 010 1 00000000001 00101010000 
001 010 1 0000
0000001101010000000000000101111010001111000

620080001611562C8802118E34

011 000 1 00000000010 00000000000 00000010110
000 000 0 00000001000

101010110001011001000100000000010000100011000111000110100
 */
