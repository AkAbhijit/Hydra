module.exports = new Object({
    name: "rewind",
    description: "Rewind the track to given position.",
    category: "Music",
    cooldown: 10,
    usage: "[position]",
    aliases: ['backward'],
    examples: ["rewind", "rewind 3", "backward", "backward 5"],
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
        if (!dispatcher.queue.current.isSeekable) return await client.util.msgReply(message, `${client.emoji.cross} Unable to Rewind this track.`, color);
        let position = 10000;
        if(args[0]) position = parseInt(args[0])*1000;
        let seekPosition = dispatcher.shoukaku.position - position;
        if(seekPosition >= dispatcher.queue.current.length) return await client.util.msgReply(message.channel, `${client.emoji.cross} Cannot Rewind any futher more of this track.`, color);
        dispatcher.shoukaku.seekTo(seekPosition);
        return await client.util.msgReply(message, `${client.emoji.tick} Rewinded \`[ ${client.util.msToTime(Number(position))} ]\` to \`[ ${client.util.msToTime(Number(dispatcher.shoukaku.position))} / ${client.util.msToTime(Number(dispatcher.queue.current.length))} ]\``, color);
    }
})