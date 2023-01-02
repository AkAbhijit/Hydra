module.exports = new Object({
    name: 'playerError',
    /**
     *
     * @param {import("../../Saavan")} client
     * @param {import("kazagumo").KazagumoPlayer} dispatcher
     * @param {*} type
     * @param {*} error
     */
    async execute(client, dispatcher, type, error) {
        client.console.log(`Player get error ${error.message}`, 'error');
        const guild = client.guilds.cache.get(dispatcher.guildId);
        if (!guild) return;
        await dispatcher.destroy(guild);
    },
});