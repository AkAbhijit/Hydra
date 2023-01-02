module.exports = new Object({
    name: "songinfo",
    description: "Shows the info related to the current playing track.",
    category: "Music",
    cooldown: 10,
    usage: '',
    aliases: ['si'],
    examples: [''],
    sub_cospotifyands: [],
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
        const track = dispatcher.queue.current
        const spotify = await client.spotify.getTrack(track.uri.split('track/')[1])
        const author = spotify.artists.map(x => `[${x.name}](${x.external_urls.spotify})`)
        let artists;
        if (author.length === 2) {
            artists = `${author[0]} & ${author[1]}`;
        } else artists = author.join(', ');
        const type = spotify.type ? spotify.type : spotify.album.type;
        const time = spotify.album.release_date;
        const date = Date.parse(time) / 1000;
        const embed = client.embed()
            .setAuthor({ name: 'Song Info', iconURL: client.config.links.spotify, url: client.config.links.support })
            .setTitle(track.title)
            .setURL(track.uri)
            .setColor(color)
            .setThumbnail(spotify.album.images[0].url)
            .addFields(
                [
                    {
                        name: 'Duration',
                        value: '**' + `${client.util.duration(spotify.duration_ms)}` + '**',
                        inline: true,
                    },
                    {
                        name: 'Type',
                        value: '`' + type[0].toUpperCase() + type.substring(1) + '`',
                        inline: true,
                    },
                    {
                        name: 'Released',
                        value: `On Spotify, <t:${date}:R>`,
                        inline: true,
                    },
                    {
                        name: 'Track Artist(s)',
                        value: artists,
                        inline: false,
                    },
                ]
            )

        await message.reply({ embeds: [embed] })
    }
})