module.exports = new Object({
    name: 'ready',
    /**
     * @param {import("../../Saavan")} client
     * @param {import("kazagumo").KazagumoPlayer} dispatcher
     */
    async execute(client, name) {
        client.console.log(`${name}: Ready!`, 'node');
    },
});