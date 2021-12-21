const raw = require('../data');

const parseData = (raw) => {
    return raw.split('\n').map(player => {
        const [input, name, startPosition] = player.match(/Player\s([0-9]*)\sstarting position:\s([0-9]*)/);
        return { name, startPosition: Number(startPosition) };
    });
};

// So I needed some help on this one. Looking at this solution 
// https://github.com/constb/aoc2021/blob/master/21/index2.js

// It became clear that I needed to  generate all possible combinations 
// of dice rolls that might ccur in a players turn Ex:
// U1-P1-D1 === Universe 1 Player 1, Die Roll 1
// U1-P1-D1: result = 1
// U2-P1-D1: result = 2
// U3-P1-D1: result = 3

// These could all be other variants, U1-P1-D1 could be 2, or 3...
// For U1-P1-D2, the result could be 1, 2, or 3 as well.  To solve that
// I generate all possible combinations of dice rolls, and then determine
// how often a sum occurs, ex 1,2,3, 2,1,3, 3,2,1 and 2,2,2 all total to the
// same value, so we can just "lump" those outcomes together.
const genCombinationCounts = () => {
    const combinationCounts = new Map();
    for (let x = 1; x <= 3; x++) {
        for (let y = 1; y <= 3; y++) {
            for (let z = 1; z <= 3; z++) {
                const sum = x + y + z;
                combinationCounts.set(sum, (combinationCounts.get(sum) ?? 0) + 1);
            }
        }
    }

    return combinationCounts;
};

const calculateNextPosition = (startPostion, rollScore) => {
    const optScore = (startPostion + rollScore) % 10;
    return optScore === 0 ? 10 : optScore;
};

const recurseAndFlipTurns = (aPos, bPos, aScore, bScore, combinationCounts, outcomes) => {
    if (bScore >= 21) {
        // If the "second player" in this iteration is above 21
        // give the all the points. 
        // since this recursion really just toggles turns, it will be the last
        // player to roll
        return [0, 1];
    };

    // This is a nice way to shortcut have to score every round
    // If we come in with the same relative scores & positions, 
    // we know we'll get the same outcomes, let's cache & call it 
    const key = [aPos, bPos, aScore, bScore].join(",");
    const cached = outcomes.get(key);
    if (cached != null) {
        return cached
    };

    const res = [0, 0];

    for (const [sum, count] of combinationCounts.entries()) {
        const nextAPos = calculateNextPosition(aPos, sum);
        const nextAScore = aScore + nextAPos;
        const _recuriveResults = recurseAndFlipTurns(bPos, nextAPos, bScore, nextAScore, combinationCounts, outcomes);
        res[0] += _recuriveResults[1] * count;
        res[1] += _recuriveResults[0] * count;
    }

    outcomes.set(key, res); // memoize result
    return res;
};

const playGame = (player1, player2, combinationCounts) => {
    const outcomes = new Map();
    const result = recurseAndFlipTurns(player1.startPosition, player2.startPosition, 0, 0, combinationCounts, outcomes);

    return Math.max(...result);
};

const [player1, player2] = parseData(raw);
const wins = playGame(player1, player2, genCombinationCounts());
console.log({ wins });
