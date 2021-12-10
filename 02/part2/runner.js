const raw = require('../data');


const parseData = (raw) => {
    const commandsStrings = raw.split('\n');

    return commandsStrings.map((commandString) => {
        const commandParts = commandString.split(' ');
        return {
            dir: commandParts[0],
            dist: parseInt(commandParts[1], 0)
        }
    });
};

const calculateFinalPosition = (commands) => {
    return commands.reduce((position, command, index) => {
        switch (command.dir) {
            case 'forward':
                return {
                    aim: position.aim,
                    depth: position.depth + (position.aim * command.dist),
                    horizontal: position.horizontal + command.dist 
                }
                break;
            case 'down':
                return {
                    aim: position.aim + command.dist,
                    depth: position.depth,
                    horizontal: position.horizontal
                }
                break;
            case 'up':
                return {
                    aim: position.aim - command.dist,
                    depth: position.depth,
                    horizontal: position.horizontal
                }
                break;
        }

    }, {
        aim: 0,
        depth: 0,
        horizontal: 0
    });

}
const finalPosition = calculateFinalPosition(parseData(raw));
console.log(finalPosition);
console.log(finalPosition.depth * finalPosition.horizontal);