module.exports = new Object({
    name: 'playerResumed',
    /**
     * @param {import("../../Saavan")} client
     * @param {import("kazagumo").KazagumoPlayer} dispatcher
     */
    async execute(client, dispatcher) {
        client.console.log(`Player Resume in @ ${dispatcher.guildId}`, 'player');
    },
});