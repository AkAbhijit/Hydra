module.exports = new Object({
    name: "skip",
    description: "Skips the current track or the provided number of tracks.",
    category: "Music",
    cooldown: 5,
    usage: '<position>',
    aliases: ['s'],
    examples: ['skip', 'skip 3'],
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
        const {title, uri} = dispatcher.queue.current;
        
        if (dispatcher.data.get('autoplay')) {
            if (args.length) {
                const trackNumber = args[0];
                if (!dispatcher.queue.size) return await client.util.msgReply(message, 'No songs left in the queue to skip.', color);
                if (trackNumber <= 0) return await client.util.msgReply(message, 'You\'ve provided an invalid track/song number to skipto.', color);
                if (trackNumber > dispatcher.queue.size) return await client.util.msgReply(message, 'You\'ve provided an invalid track/song number to skipto.', color);
                await client.util.autoplay(client, dispatcher, "skip")
                await client.util.update(dispatcher, client);
                return await client.util.msgReply(message, `**Skipped to track number \`[ ${trackNumber} ]\` in the queue.**`, color);
            }
            await client.util.autoplay(client, dispatcher, "skip")
            await client.util.update(dispatcher, client);
            return await client.util.msgReply(message, `Skipped \`${title}\``, color);
        } else if (dispatcher.queue.size === 0) return await client.util.msgReply(message, 'No more songs left in the queue to skip.', color);
        if (args.length) {
            const trackNumber = args[0];
            if (!dispatcher.queue.size) return await client.util.msgReply(message, 'No songs left in the queue to skip.', color);
            if (trackNumber <= 0) return await client.util.msgReply(message, 'You\'ve provided an invalid track/song number to skipto.', color);
            if (trackNumber > dispatcher.queue.size) return await client.util.msgReply(message, 'You\'ve provided an invalid track/song number to skipto.', color);
            if (dispatcher.paused) dispatcher.pause(false)
            dispatcher.queue.splice(0, trackNumber - 1);
            dispatcher.shoukaku.stopTrack();
            await client.util.update(dispatcher, client);
            return await client.util.msgReply(message, `**Skipped to track number \`[ ${trackNumber} ]\` in the queue.**`, color);
        }
        if (dispatcher.paused) dispatcher.pause(false)
        dispatcher.skip();
        await client.util.update(dispatcher, client);
        return await client.util.msgReply(message, `${client.emoji.tick} **Skipped** [${title}](${uri})`, color);
    }
})