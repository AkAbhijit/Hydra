module.exports = new Object({
    name: "replay",
    description: "Replays the current playing track.",
    category: "Music",
    cooldown: 10,
    usage: '',
    aliases: ['rep'],
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
        const { tracks } = await dispatcher.search(dispatcher.queue.current.title, { requester: message.author, engine: 'spotify' })
        dispatcher.queue.add(tracks[0])
        dispatcher.skip()
        await client.util.update(dispatcher, client);
        return await client.util.msgReply(message, `${client.emoji.tick} Replaying the Current Song`, color);
    }
})