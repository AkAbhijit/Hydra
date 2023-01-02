module.exports = new Object({
    name: "guildRemove",
    /**
     * @param {import("discord.js").Guild} guild
     * @param {import("../../Saavan")} client
     */
    async execute(_, guild, client) {
        const dispatcher = client.dispatcher.players.get(guild.id)
        if (!dispatcher) return;
        if (guild.id === dispatcher.guildId) dispatcher.destroy();
    }
})