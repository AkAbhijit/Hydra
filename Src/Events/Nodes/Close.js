module.exports = new Object({
    name: 'close',
    /**
     * @param {import("../../Saavan")} client
     */
    async execute(client, name, code, reason) {
        client.console.log(`${name}: Closed, Code ${code}`, 'node');
    },
});