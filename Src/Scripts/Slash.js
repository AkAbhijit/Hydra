const { readdirSync } = require('node:fs');
const { join } = require('path');
const { Routes, REST } = require("discord.js");

/**
 * @param {import('../Saavan')} client 
 */

module.exports = (client) => {
    let count = 0
    const commands = [];
    readdirSync(join(__dirname, "..", "Commands", "Slash")).forEach((folder) => {
        const slashCommandFile = readdirSync(join(__dirname, "..", "Commands", "Slash", `${folder}`)).filter((files) => files.endsWith(".js"));
        for (const files of slashCommandFile) {
            const slash_command = require(`../Commands/Slash/${folder}/${files}`);
            if (!slash_command.name) throw new Error("Missing Slash Command Name: " + files.replace(".js", ""));
            if (!slash_command.description) throw new Error("Missing Slash Command Description: " + files.replace(".js", ""));
            commands.push(slash_command);
            client.Slash.set(slash_command.name, slash_command);
            count++
        };
    });
    client.console.log(`Command Loaded: ${count}`, "Scmd");
    const rest = new REST({ version: "10" }).setToken(client.token);
    (async () => {
        try {
            client.console.log("Started refreshing application (/) commands.", "cmd");
            await rest.put(Routes.applicationCommands(client.config.Client.ID), { body: commands });
            client.console.log("Successfully reloaded application (/) commands.", "cmd");
        } catch (error) { console.error(error); }
    })();
    client.once("ready", async () => {
        try { await client.application.commands.set(commands); } catch (e) { client.console.log(e, "error"); };
    });
}