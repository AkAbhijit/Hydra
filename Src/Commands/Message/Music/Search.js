module.exports = new Object({
    name: "search",
    description: "Searches song from spotify/soundcloud.",
    category: "Music",
    cooldown: 10,
    usage: "search <query>",
    aliases: ['se'],
    examples: ["search Naam by tulsi", "se Bhula diya"],
    sub_commands: [],
    args: true,
    permissions: {
        client: [],
        user: [],
        dev: false,
    },
    player: { voice: false, active: false, dj: true, },

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
        const query = args.join(' ');
        if (!dispatcher) dispatcher = await client.dispatcher.createPlayer({
            guildId: message.guildId,
            textId: message.channelId,
            voiceId: message.member.voice.channelId,
            deaf: true,
            shardId: message.guild.shardId,
        });
        const { tracks, type } = await dispatcher.search(query, { requester: message.author, engine: 'spotify' });

        switch (type) {
            case 'PLAYLIST': {
                return client.util.replyOops(message, `${client.emoji.cross} I do not support playlists in search. Please use the \`play\` command to play tracks from a playlist.`, color);
            }
            case 'TRACK': {
                return client.util.replyOops(message, `${client.emoji.cross} I do not support tracks in search. Please use the \`play\` command to play tracks.`, color);
            }
            case 'SEARCH': {
                const results = tracks.slice(0, 10);
                let n = 0;
                const str = tracks.slice(0, 10).map(r => `\`${++n}.\` [${r.title}](${r.uri})`).join('\n');
                const selectMenuArray = [];
                for (let i = 0; i < results.length; i++) {
                    const track = results[i];
                    let label = `${i + 1}. ${track.title}`;
                    if (label.length > 100) label = label.substring(0, 97) + '...';
                    selectMenuArray.push({
                        label: label,
                        description: dispatcher.author,
                        value: i.toString(),
                    });
                }
                const selectMenuRow = client.row()
                    .addComponents(
                        client.menu()
                            .setCustomId('SEARCH_SELECT_MENU')
                            .setPlaceholder('Nothing selected')
                            .setMinValues(1)
                            .setMaxValues(10)
                            .addOptions(selectMenuArray),
                    );
                const embed = client.embed()
                    .setAuthor({ name: 'Song Selection.', iconURL: message.author.displayAvatarURL({}) })
                    .setDescription(str)
                    .setFooter({ text: `You have 30 seconds to make your selection through the dropdown menu.` })
                    .setColor(color);
                await message.reply({ embeds: [embed], components: [selectMenuRow] }).then((message) => {
                    let count = 0;
                    const selectMenuCollector = message.createMessageComponentCollector({
                        time: 30000,
                    });
                    const toAdd = [];
                    try {
                        selectMenuCollector.on('collect', async (interaction) => {
                            if (!interaction.replied) await interaction.deferUpdate().catch(() => { });
                            for (const value of interaction.values) {
                                toAdd.push(tracks[value]);
                                count++;
                            }
                            dispatcher.queue.add(toAdd);
                            await client.util.update(dispatcher, client)
                            if (!dispatcher.playing && !dispatcher.paused) dispatcher.play();
                            if (message) await message.edit({ embeds: [client.embed().setColor(color).setDescription(`${client.emoji.tick} Added \`[ ${count} ]\` tracks to the queue.`)], components: [] });
                        });
                        selectMenuCollector.on('end', async () => {
                            if (message) await message.edit({ embeds: [client.embed().setDescription(`${client.emoji.cross} Time's up.`).setColor(color)], components: [] });
                        });
                    } catch (e) {
                        console.log(e);
                    }
                });
            }
        }
    }
})