const { readdirSync } = require('node:fs');
const { join } = require('path');
/**
 * @param {import('../Saavan')} client 
 */
module.exports = (client) => {
    let count = 0
    const eventFiles = readdirSync(join(__dirname, "..", "Events", "Client")).filter((files) => files.endsWith(".js"));
    for (const files of eventFiles) {
        const event = require(`../Events/Client/${files}`);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(client, ...args));
        } else { client.on(event.name, (...args) => event.execute(client, ...args)) };
        count++
    };
    client.console.log(`Loaded: ${count}`, "client");
}