const db = require('../../Models/Setup');
module.exports = new Object({
    name: 'playerEnd',
    /**
     * @param {import("../../Saavan")} client
     * @param {import("kazagumo").KazagumoPlayer} dispatcher
     */
    async execute(client, dispatcher) {
        if (dispatcher.data.get("message") && !dispatcher.data.get("message").deleted) dispatcher.data.get("message").delete().catch(() => null);
    },
});