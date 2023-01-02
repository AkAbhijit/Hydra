module.exports = new Object({
    name: "seek",
    description: "Seeks the current playing track to given time.",
    category: "Music",
    cooldown: 15,
    usage: '<time>',
    aliases: ['sk'],
    examples: ['seek 1:34'],
    sub_commands: [],
    args: true,
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
        if (!dispatcher.queue.current.isSeekable) return await client.util.msgReply(message, `${client.emoji.cross} This track cannot be seeked.`, color).catch(() => { });
        const time = args[0];
        if (!/^[0-5]?[0-9](:[0-5][0-9]){1,2}$/.test(time)) return message.reply({ content: `${client.emoji.cross} You provided an invalid duration. Valid duration e.g. \`1:34\``});
        let ms = () => { return (time.split(':').map(Number).reduce((a, b) => a * 60 + b, 0) * 1000); };
        ms = ms();
        if (ms > dispatcher.queue.current.length) return await client.util.msgReply(message, `${client.emoji.cross} The duration you provided exceeds the duration of the current track.`, color).catch(() => { });
        dispatcher.shoukaku.seekTo(ms);
        return await client.util.msgReply(message, `${client.emoji.tick} Seeked to \`${time}\`.`, color).catch(() => { });
    }
})