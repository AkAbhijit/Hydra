module.exports = new Object({
    name: "interactionCreate",
    /**
     * @param {import("../../Saavan")} client 
     * @param {import('discord.js').CommandInteraction} interaction
     */
    async execute(client, interaction) {
        if (interaction.isButton()) {
            client.emit('ButtonInteraction', interaction)
        }
    }
})