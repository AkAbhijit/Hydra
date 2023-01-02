module.exports = new Object({
    name: "pause",
    description: "Pauses the current track.",
    category: "Music",
    cooldown: 10,
    usage: '',
    aliases: ['pau'],
    examples: [''],
    sub_commands: [],
    args: false,
    permissions: {
        client: [],
        user: [],
        dev: false,
    },
    player: { voice: true, active: true, dj: true, },

    /**
     * 
     * @param {import("../../../Saavan")} client 
     * @param {import("discord.js").Message} message
     * @param {String[]} args
     * @param {String} prefix
     * @param {String} color
     * @param {import('kazagumo').KazagumoPlayer} dispatcher
     */

    async execute(client, message, args, prefix, color, dispatcher) {
        if (dispatcher.paused) {
            return await client.util.msgReply(message, `${client.emoji.cross} The song is already paused.`, color);
        } else {
            dispatcher.pause(true);
            await client.util.update(dispatcher, client);
            await client.util.msgReply(message, `${client.emoji.tick} Paused the song at ${dispatcher.shoukaku.position}.`, color);
            dispatcher.pause(true);
        }
    }
})