module.exports = new Object({
    name: 'error',
    /**
     * @param {import("../../Saavan")} client
     */
    async execute(client, name, error) {
        client.console.log(`${name}: Error Caught,`, 'node');
    },
});