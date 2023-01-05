module.exports = new Object({
    name: "nowplaying",
    description: "Shows the info related to the current playing track.",
    category: "Music",
    cooldown: 10,
    usage: '',
    aliases: ['np'],
    examples: [''],
    sub_commands: [],
    args: false,
    permissions: {
        client: [],
        user: [],
        dev: false,

    },
    player: { voice: true, active: true, dj: false, },

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
        const { title, uri, length, requester, isStream, thumbnail, author } = dispatcher.queue.current;
        const parsedCurrentDuration = client.util.duration(dispatcher.shoukaku.position || 0);
        const parsedDuration = client.util.duration(length);
        const part = Math.floor((dispatcher.shoukaku.position / length) * 13);
        const percentage = dispatcher.shoukaku.position / length;
        const embed = client.embed()
            .setAuthor({ name: 'Now playing' })
            .setTitle(title)
            .setURL(uri)
            .setColor(color)
            .setThumbnail(thumbnail)
            .addFields(
                {
                    name: 'Track Author(s)',
                    value: author,
                    inline: true,
                },
                {
                    name: 'Requsted By:',
                    value: `***\`${requester.tag}\`***`,
                    inline: true,
                },
                {
                    name: 'Duration',
                    value: `${percentage < 0.05 ? client.emoji.progress7 : client.emoji.progress1}${client.emoji.progress2.repeat(part)}${percentage < 0.05 ? '' : client.emoji.progress3}${client.emoji.progress5.repeat(12 - part)}${client.emoji.progress6}  \`${parsedCurrentDuration} / ${isStream ? '◉ LIVE' : parsedDuration}\``,
                    inline: false,
                },
            )
            .setTimestamp()
        return message.reply({ embeds: [embed] });

    }
})