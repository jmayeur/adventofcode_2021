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

const findWinners = (cards) => {

    const winners = [];
    cards.forEach((card) => {
        //check rows;
        card.card.forEach((row) => {
            if (row.length === row.filter(item => item.hit).length) {
                winners.push(card);
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
                winners.push(card);
                col = 5;
            }
            count = 0;
        }
    });
    return winners;
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

let lastWinnerFound = false;
data.draw.forEach((num) => {
    if (!lastWinnerFound) {
        data.cards.forEach((card) => {
            card.card.forEach((row) => {
                row.forEach((item) => {
                    if (item.number === num) {
                        item.hit = true;
                    }
                });
            });
        });

        const winners = findWinners(data.cards);

        // if (data.cards.length < 3) {
        //     console.log(JSON.stringify(data.cards));
        // }
        if (data.cards.length <= 1 && winners.length === 1) {
            lastWinnerFound = true;
            const winner = winners[0];
            console.log({ num, winner: JSON.stringify(winner.card) })
            console.log(sumUnMarked(winner) * num);
            return winner;
        }
        else {
            winners.forEach((winner) => {
                const i = data.cards.indexOf(winner);
                if (i >= 0) {
                    data.cards.splice(i, 1);
                }
            });
        }

    }
});