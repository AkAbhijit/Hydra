const { readdirSync } = require('node:fs');
const { join } = require('path');
/**
 * @param {import('../Saavan')} client 
 */
module.exports = (client) => {
    let count = 0
    readdirSync(join(__dirname, "..", "Commands", "Message")).forEach((folder) => {
        const commandFiles = readdirSync(join(__dirname, "..", "Commands", "Message", `${folder}`)).filter((files) => files.endsWith(".js"));
        for (const files of commandFiles) {
            const command = require(`../Commands/Message/${folder}/${files}`);
            if (command.category && command.category !== folder) command.category = folder;
            client.Commands.set(command.name, command);
            if (command.aliases && Array.isArray(command.aliases)) for (const i of command.aliases) client.Aliases.set(i, command.name);
            count++
        };
    });
    client.console.log(`Command Loaded: ${count}`, "cmd");
}