const raw = require('../data');

const parseData = (raw) => {
    const [imageEnhancementAlgorithm, inputImage] = raw.split('\n\n');
    return {
        imageEnhancementAlgorithm,
        inputImage: inputImage.split('\n'),
    }
};

const getBin = (inputImage, rowIndex, colIndex, iteration) => {
    const neighbors = [];
    for (let row = rowIndex - 1; row <= rowIndex + 1; row++) {
        for (let col = colIndex - 1; col <= colIndex + 1; col++) {
            if (inputImage[row]?.[col]) {
                const bit = inputImage[row][col] === '#' ? 1 : 0;
                neighbors.push(bit);
            } else {
                const flickerBit = iteration % 2 ? 1 : 0;
                neighbors.push(flickerBit);
            }

        }
    }
    return neighbors.join('');
};

const enhanceImage = (inputImage, imageEnhancementAlgorithm, iterations) => {

    let enhancedImage = [];
    let image = inputImage;

    
    for (let iteration = 0; iteration < iterations; iteration++) {
        // pad Image
        for (let row = -1; row < image.length + 1; row++) {
            enhancedImage.push('');

            for (let col = -1; col < image[0].length + 1; col++) {
                const bin = getBin(image, row, col, iteration);
                enhancedImage[enhancedImage.length - 1] += imageEnhancementAlgorithm[parseInt(bin, 2)];
            }
        }

        image = enhancedImage;
        enhancedImage = [];
    }

    return image;
};

const countLitpixels = (image) => {
    return image.join('').split('').filter(pixel => pixel === '#').length;
};

const printImage = (image) => {
    console.log(image.join('\n'));
};
const { imageEnhancementAlgorithm, inputImage } = parseData(raw);

const enhancedImage = enhanceImage(inputImage, imageEnhancementAlgorithm, 50);
//printImage(enhancedImage);
console.log(countLitpixels(enhancedImage));

