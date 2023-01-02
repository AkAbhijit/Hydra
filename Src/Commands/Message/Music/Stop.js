module.exports = new Object({
    name: "stop",
    description: "Stops the song and clear the queue.",
    category: "Music",
    cooldown: 20,
    usage: '',
    aliases: ['end'],
    examples: [''],
    sub_commands: [],
    args: false,
    permissions: {
        client: [],
        user: [],
        dev: false,
    },
    player: { voice: true, active: true, dj: true,  },

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
        dispatcher.queue.clear();
        dispatcher.destroy();
        return await client.util.msgReply(message, `${client.emoji.tick} Stopped the music and cleared the queue.`, color);
    }
})