module.exports = new Object({
    name: 'playerException',
    /**
     * @param {import("../../Saavan")} client
     * @param {import("kazagumo").KazagumoPlayer} dispatcher
     * @param {*} reason
     */
    async execute(client, dispatcher, reason) {
        client.console.log(`Player Get exception ${reason}`, 'error');
        const guild = client.guilds.cache.get(dispatcher.guildId);
        if (!guild) return;
        dispatcher.destroy(guild.id);
    },
});