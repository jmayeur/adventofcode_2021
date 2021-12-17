const raw = require('../data');

const convertHexStringToBitArray = (hex) => {
    return hex.split('').map(char => {
        return parseInt(char, 16).toString(2).padStart(4, '0');
    }).join('').split('');
}

const processSpecialTypes = (type, subResults) => {
    switch (type) {
        case 0:
            return subResults.reduce((acc, subResult) => {
                return acc + subResult;
            }, 0);
        case 1:
            return subResults.reduce((acc, subResult) => {
                return acc * subResult;
            }, 1);
        case 2:
            return Math.min(...subResults);
        case 3:
            return Math.max(...subResults);
        case 5:
            return subResults[0] > subResults[1] ? 1 : 0;
        case 6:
            return subResults[0] < subResults[1] ? 1 : 0;
        case 7:
            return subResults[0] === subResults[1] ? 1 : 0;

    }
    throw new Error('Type Not Handled', type);
};

const calculateMessageProduct = (bitArray) => {

    while (bitArray.length >= 6) {
        // noop, we just have to pull the version off the stack
        const version = parseInt(bitArray.splice(0, 3).join(''), 2);
        const type = parseInt(bitArray.splice(0, 3).join(''), 2);

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
            return parseInt(bits.join(''), 2);
        } else {
            const countType = bitArray.splice(0, 1).join('');
          
            if (countType === '0') {
                const bitsLen = bitArray.splice(0, 15);
                const subPacketLength = parseInt(bitsLen.join(''), 2);
                const subPackets = bitArray.splice(0, subPacketLength);
                const subResults = [];
                while (subPackets.length > 0) {
                    subResults.push(calculateMessageProduct(subPackets));
                }
                return processSpecialTypes(type, subResults);
            } else if (countType === '1') {
                const packetsCount = parseInt(bitArray.splice(0, 11).join(''), 2);
                const subResults = [];
                for (let i = 0; i < packetsCount; i++) {
                    subResults.push(calculateMessageProduct(bitArray));
                }
                return processSpecialTypes(type, subResults);
            } else {
                throw new Error('Invalid count type');
            }
        }
    }
}

const bitsArray = convertHexStringToBitArray(raw);
//console.log(bitsArray.join(''));

const messageProduct = calculateMessageProduct(bitsArray);
console.log(messageProduct);