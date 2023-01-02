module.exports = new Object({
    name: 'disconnect',
    /**
     * @param {import("../../Saavan")} client
     * @param {import("kazagumo").KazagumoPlayer} players
     * @param {import("kazagumo").KazagumoTrack} track
     */
    async execute(client, name, players, moved) {
        if (moved) return;
        players.map(player => player.connection.disconnect());
        client.console.log(`Lavalink ${name}: Disconnected`, 'node');
    },
});