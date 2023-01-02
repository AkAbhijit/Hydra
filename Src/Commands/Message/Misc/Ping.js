module.exports = new Object({
    name: "ping",
    description: "Shows the latency of the bot.",
    category: "Misc",
    usage: "",
    cooldown: 10,
    usage: '',
    aliases: ['pong'],
    examples: [''],
    sub_commands: [],
    args: false,
    permissions: {
        client: [],
        user: [],
        dev: false,
    },
    player: { voice: false, active: false, dj: false, },
    /**
     * 
     * @param {import("../../../Saavan")} client 
     * @param {import("discord.js").Message} message
     * @param {String[]} args
     * @param {String} prefix
     * @param {String} color
     */
    async execute(client, message, args, prefix, color) {

        let ping = Math.floor(client.ws.ping);
        if (ping === 0) {
            ping = '⚫ `' + Math.floor(client.ws.ping) + ' ms`';
        } else if (ping < 100) {
            ping = '🟢 `' + Math.floor(client.ws.ping) + ' ms`';
        } else if (ping < 180) {
            ping = '🟡 `' + Math.floor(client.ws.ping) + ' ms`';
        } else ping = '🔴 `' + Math.floor(client.ws.ping) + ' ms`';
        const embed = client.embed()
            .setColor(color)
            .setDescription(ping)
        return message.reply({ embeds: [embed] })
    }
})