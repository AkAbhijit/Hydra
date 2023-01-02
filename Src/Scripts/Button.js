const { readdirSync } = require('node:fs');
const { join } = require('path');
/**
 * @param {import('../Saavan')} client 
 */
module.exports = (client) => {
    let count = 0;
    const buttonFile = readdirSync(join(__dirname, '..', 'Components')).filter(
        files => files.endsWith('.js'),
    );
    for (const files of buttonFile) {
        const buttons = require(`../Components/${files}`);
        client.ButtonInt.set(buttons.id, buttons);
        count++;
    }
    client.console.log(`Loaded: ${count}`, 'button');
}