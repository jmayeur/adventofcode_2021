const raw = require('../data');


const parseData = (raw) => {
    const objects = raw.split('\n\n');
    const draw = objects.shift().split(',').map(v => parseInt(v));
    const cards = objects.reduce((acc, cardRaw) => {
        const rowVals = cardRaw.split('\n').map((row) => {

            return row.match(/.{1,3}/g).map((v) => {
                return {
                    number: parseInt(v),
                    hit: false
                }
            });
        });

        acc.push({
            card: rowVals
        });
        return acc;
    }, []);

    return { draw, cards };
}

const checkForWinner = (cards) => {

    let result = false;
    let found = false;
    cards.forEach((card) => {
        //check rows;

        if (!found) {
            card.card.forEach((row) => {
                if (row.length === row.filter(item => item.hit).length) {
                    found = true;
                    result = card;
                }
            });

            //check cols
            let count = 0;
            for (let col = 0; col < 5; col++) {
                for (let row = 0; row < 5; row++) {
                    if (card.card[row][col].hit) {
                        count = count + 1;
                    }
                }
            
                if (count === 5) {
                    console.log('sdfsdfsdf')
                    found = true;
                    result = card;
                    col = 5
                }

                count = 0;

            }

            
        }

    });
    return result;
}

const sumUnMarked = (card) => {
    return card.card.reduce((acc, row) => {

            return row.reduce((ia, item) => {
                
                if (!item.hit) {
                    return ia + item.number;
                }
                return ia;
            }, acc);
    }, 0);
}

const data = parseData(raw);

let winnerFound = false;
data.draw.forEach((num) => {
    if (!winnerFound) {


        data.cards.forEach((card) => {

            card.card.forEach((row) => {
                row.forEach((item) => {
                    if (item.number === num) {
                        item.hit = true;
                    }
                });
            });
        });

        const winner = checkForWinner(data.cards);

        if (winner) {
            winnerFound = true;
            console.log({num, winner: JSON.stringify(winner.card)})
            console.log(sumUnMarked(winner) * num);
            return winner;
        }
    }
});