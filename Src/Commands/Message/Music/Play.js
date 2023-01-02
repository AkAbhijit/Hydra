module.exports = new Object({
    name: "play",
    description: "Plays a song from given query/link.",
    category: "Music",
    cooldown: 5,
    usage: '<query>',
    aliases: ['p'],
    examples: ['play ncs'],
    sub_commands: [],
    args: true,
    permissions: {
        client: [],
        user: [],
        dev: false,
    },
    player: { voice: true, active: false, dj: false, },

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

        let query = args.join(' ');
        if (query.startsWith("https://") || query.startsWith("http://")) {
            if (!query.match(/(?:https:\/\/open\.spotify\.com\/|spotify:)(?:.+)?(track|playlist|album|artist)[\/:]([A-Za-z0-9]+)/)) {
                if (!query.match(/^https?:\/\/(soundcloud\.com|snd\.sc)\/(.*)$/)) {
                    return message.reply({
                        embeds: [
                            client.embed()
                                .setColor(color)
                                .setDescription(`${client.emoji.cross} Recently, We have removed youtube support from ${client.user.username}. Try giving the link from another source or type a track name to use our default platform.`)
                        ]
                    })
                }
            }
        }
        if (!dispatcher) dispatcher = await client.dispatcher.createPlayer({
            guildId: message.guild.id,
            voiceId: message.member.voice.channel.id,
            textId: message.channel.id,
            deaf: true,
        });
        if (!dispatcher.textId) dispatcher.setTextChannel(message.channel.id);
        let searchTrack = query;

        const { tracks, type, playlistName } = await dispatcher.search(searchTrack, { requester: message.author, engine: 'spotify' });
        if (!tracks.length) {
            return message.reply({
                embeds: [client.embed().setColor(color).setDescription(`${client.emoji.cross} No songs found.`)],
            });
        }

        if (type === 'PLAYLIST') {
            for (const track of tracks) {
                dispatcher.queue.add(track);
            }
            await client.util.update(dispatcher, client);
            if (!dispatcher.playing && !dispatcher.paused) dispatcher.play();
            return message.channel.send({
                embeds: [
                    client.embed()
                        .setColor(color)
                        .setDescription(`Queued **${tracks.length}** tracks from [${playlistName.length > 64 ? playlistName.substring(0, 64) + '...' : playlistName}](${query}) [${message.member}]`),
                ],
            });
        } else {
            dispatcher.queue.add(tracks[0]);
            await client.util.update(dispatcher, client);
            if (!dispatcher.playing && !dispatcher.paused) dispatcher.play();

            return message.channel.send({
                embeds: [
                    client.embed()
                        .setColor(color)
                        .setDescription(`Queued [${tracks[0].title.length > 64 ? tracks[0].title.substring(0, 64) + '...' : tracks[0].title}](${tracks[0].uri}) [${message.author}]`),
                ],
            });
        }
    }
})