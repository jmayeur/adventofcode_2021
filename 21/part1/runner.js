const raw = require('../data');

const parseData = (raw) => {
    return raw.split('\n').map(player => {
        const [input, name, startPosition] = player.match(/Player\s([0-9]*)\sstarting position:\s([0-9]*)/);
        return { name, startPosition: Number(startPosition) };
    });
};

const calculateNextPosition = (startPostion, rollScore) => {
    const optScore = (startPostion + rollScore) % 10;
    return optScore === 0 ? 10 : optScore;
};

const [player1, player2] = parseData(raw);

const playGame = (player1, player2) => {
    let p1Pos = player1.startPosition, p2Pos = player2.startPosition, p1Score = 0, p2Score = 0, rolls = 0;
    while (true) {
        let p1Roll = 0;
        for (let p1 = 0; p1 < 3; p1++) {
            rolls++;
            let dieFace = rolls === 100 ? 100 : rolls % 100;
            p1Roll += dieFace;
        }

        p1Pos = calculateNextPosition(p1Pos, p1Roll);
        p1Score += p1Pos;
        if (p1Score >= 1000) {
            return {
                winner: {
                    name: player1.name,
                    score: p1Score,
                    p1Pos,
                },
                loser: {
                    name: player2.name,
                    score: p2Score,
                    p2Pos,
                },
                rolls
            }
        }

        let p2Roll = 0;
        for (let p2 = 0; p2 < 3; p2++) {
            rolls++;
            let dieFace = rolls % 100;
            p2Roll += dieFace;
        }

        p2Pos = calculateNextPosition(p2Pos, p2Roll);
        p2Score += p2Pos;
        if (p2Score >= 1000) {
            return {
                loser: {
                    name: player1.name,
                    score: p1Score,
                    p1Pos,
                },
                winner: {
                    name: player2.name,
                    score: p2Score,
                    p2Pos,
                },
                rolls
            }
        }
    }
};

const outcome = playGame(player1, player2);

console.log(outcome.rolls * outcome.loser.score)

