module.exports = new Object({
    name: "shuffle",
    description: "Toggle Shuffle/Unshuffle the queue.",
    category: "Music",
    cooldown: 15,
    usage: '',
    aliases: ['mix'],
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
        if (dispatcher.queue.size < 3) return await client.util.msgReply(message, `${client.emoji.cross} Not enough songs in the queue to shuffle.`, color);
        if (dispatcher.shuffle) {
            dispatcher.setUnshuffle();
            client.util.update(dispatcher, client);
            return await client.util.msgReply(message, `${client.emoji.tick} Unshuffled the queue.`, color);
        } else {
            dispatcher.setShuffle();
            client.util.update(dispatcher, client);
            return await client.util.msgReply(message, `${client.emoji.tick} Shuffled the queue.`, color);
        }
    }
})