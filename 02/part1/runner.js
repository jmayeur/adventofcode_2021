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
                    depth: position.depth,
                    horizontal: position.horizontal + command.dist
                }
                break;
            case 'down':
                return {
                    depth: position.depth + command.dist,
                    horizontal: position.horizontal
                }
                break;
            case 'up':
                return {
                    depth: position.depth - command.dist,
                    horizontal: position.horizontal
                }
                break;
        }

    }, {
        depth: 0,
        horizontal: 0
    });

}
const finalPosition = calculateFinalPosition(parseData(raw));
console.log(finalPosition);
console.log(finalPosition.depth * finalPosition.horizontal);