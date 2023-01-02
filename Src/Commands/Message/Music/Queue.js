module.exports = new Object({
    name: "queue",
    description: "Shows the Server song queue.",
    category: "Music",
    cooldown: 15,
    usage: '',
    aliases: ['q'],
    examples: [''],
    sub_commands: [],
    args: false,
    permissions: {
        client: [],
        user: [],
        dev: false,
    },
    player: { voice: true, active: true, dj: false,  },

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
        if (!dispatcher.queue.length) return await client.util.msgReply(message, `Now Playing - [${dispatcher.queue.current.title}](${dispatcher.queue.current.uri})`, color)


        const queuedSongs = dispatcher.queue.map((track, i) => `\`${i + 1}.\` ${track.title.length > 64 ? track.title.substring(0, 64) + '...' : track.title} | [${track.isStream ? 'LIVE' : client.util.duration(track.length)}]\n`);
        const mapping = client.util.chunk(queuedSongs, 10);
        const pages = mapping.map((s) => s.join('\n'));
        let page = 0;
        if (queuedSongs.length <= 10) {
            return message.reply({
                embeds: [
                    client.embed()
                        .setColor(color)
                        .setAuthor({ name: 'Queue', url: client.config.links.support, iconURL: client.user.displayAvatarURL(), url: client.config.links.support })
                        .setDescription(`**Queued Songs**\n\n${pages[page]}`),
                ],
            });
        } else {
            const embed2 = client.embed()
                .setColor(color)
                .setDescription(`**Queued Songs**\n\n${pages[page]}`)
                .setFooter({ text: `Page ${page + 1}/${pages.length}`, iconURL: message.author.displayAvatarURL({ dynamic: true }), url: client.config.links.support })
                .setAuthor({ name: client.user.username, iconURL: message.client.user.displayAvatarURL() });
            const but1 = client.button()
                .setCustomId('queue_cmd_but_1')
                .setLabel('Next')
                .setStyle(client.config.button.grey);
            const but2 = client.button()
                .setCustomId('queue_cmd_but_2')
                .setLabel('Previous')
                .setStyle(client.config.button.grey);
            const but3 = client.button()
                .setCustomId('queue_cmd_but_3')
                .setLabel(`${page + 1}/${pages.length}`)
                .setStyle(client.config.button.green)
                .setDisabled(true);
            const but4 = client.button()
                .setCustomId('queue_cmd_but_4')
                .setLabel('Last')
                .setStyle(client.config.button.grey);
            const but5 = client.button()
                .setCustomId('queue_cmd_but_5')
                .setLabel('First')
                .setStyle(client.config.button.grey);
            const row = client.row().addComponents([but5.setDisabled(true), but2, but3, but1, but4]);
            const msg = await message.reply({ embeds: [embed2], components: [row] });
            const collector = msg.createMessageComponentCollector({
                filter: (b) => { if (b.member.user.id === message.author.id) return true; else { b.reply({ ephemeral: true, content: `${client.emoji.cross} Only **${message.author.tag}** can use this button.` }); return false; } },
                time: 60000 * 5,
                idle: 30e3,
            });
            collector.on('collect', async (int) => {
                if (!int.replied) int.deferUpdate().catch(() => { });
                if (int.customId === 'queue_cmd_but_1') {
                    page = page + 1 < pages.length ? ++page : 0;
                    let d_but4 = false,
                        d_but5 = false;
                    if (page === 0) d_but5 = true;
                    if (page === pages.length - 1) d_but4 = true;
                    await msg.edit({
                        embeds: [
                            client.embed()
                                .setColor(color)
                                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL(), url: client.config.links.support })
                                .setDescription(`**Queued Songs**\n\n${pages[page]}`)
                                .setFooter({ text: `Page ${page + 1} of ${pages.length}`, iconURL: message.author.displayAvatarURL() }),
                        ],
                        components: [client.row().addComponents(but5.setDisabled(d_but5), but2, but3.setLabel(`Page ${page + 1} of ${pages.length}`), but1, but4.setDisabled(d_but4))],
                    });
                } else if (int.customId === 'queue_cmd_but_2') {
                    page = page > 0 ? --page : pages.length - 1;
                    let d_but4 = false,
                        d_but5 = false;
                    if (page === 0) d_but5 = true;
                    if (page === pages.length - 1) d_but4 = true;
                    await msg.edit({
                        embeds: [
                            client.embed()
                                .setColor(color)
                                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL(), url: client.config.links.support })
                                .setDescription(`**Queued Songs**\n\n${pages[page]}`)
                                .setFooter({ text: `Page ${page + 1} of ${pages.length}`, iconURL: message.author.displayAvatarURL() }),
                        ],
                        components: [client.row().addComponents(but5.setDisabled(d_but5), but2, but3.setLabel(`Page ${page + 1} of ${pages.length}`), but1, but4.setDisabled(d_but4))],
                    });
                } else if (int.customId === 'queue_cmd_but_4') {
                    page = pages.length - 1;
                    let d_but4 = false,
                        d_but5 = false;
                    if (page === 0) d_but5 = true;
                    if (page === pages.length - 1) d_but4 = true;
                    await msg.edit({
                        embeds: [
                            client.embed()
                                .setColor(color)
                                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL(), url: client.config.links.support })
                                .setDescription(`**Queued Songs**\n\n${pages[page]}`)
                                .setFooter({ text: `Page ${page + 1} of ${pages.length}`, iconURL: message.author.displayAvatarURL() }),
                        ],
                        components: [client.row().addComponents(but5.setDisabled(d_but5), but2, but3.setLabel(`Page ${page + 1} of ${pages.length}`), but1, but4.setDisabled(d_but4))],
                    });
                } else if (int.customId === 'queue_cmd_but_5') {
                    page = 0;
                    let d_but4 = false,
                        d_but5 = false;
                    if (page === 0) d_but5 = true;
                    if (page === pages.length - 1) d_but4 = true;
                    await msg.edit({
                        embeds: [
                            client.embed()
                                .setColor(color)
                                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL(), url: client.config.links.support })
                                .setDescription(`**Queued Songs**\n\n${pages[page]}`)
                                .setFooter({ text: `Page ${page + 1} of ${pages.length}`, iconURL: message.author.displayAvatarURL() }),
                        ],
                        components: [client.row().addComponents(but5.setDisabled(d_but5), but2, but3.setLabel(`Page ${page + 1} of ${pages.length}`), but1, but4.setDisabled(d_but4))],
                    });
                }
            });
            collector.on('end', async () => {
                if (msg) { await msg.edit({ components: [client.row().addComponents(but5.setDisabled(true), but2.setDisabled(true), but3, but1.setDisabled(true), but4.setDisabled(true))] }); } else return;
            });
        }
    }
})