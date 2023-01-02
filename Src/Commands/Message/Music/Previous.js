module.exports = new Object({
    name: "previous",
    description: "Play's previous song to the queue.",
    category: "Music",
    cooldown: 20,
    usage: '',
    aliases: ['adp'],
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
        const but1 = client.button().setCustomId("addprevious").setLabel("Add Previous").setStyle(client.config.button.grey);
        const but2 = client.button().setCustomId("playprevious").setLabel("Play Previous").setStyle(client.config.button.grey);
        const embed = client.embed()
            .setColor(color)
            .setDescription('Previous, what previous?')
        const m = await message.reply({ embeds: [embed], components: [client.row().addComponents([but1, but2])] });

        const collector = m.createMessageComponentCollector({
            filter: (b) => {
                if (b.user.id === message.author.id) return true;
                else { b.reply({ ephemeral: true, content: `${client.emoji.cross} Only **${interaction.member.user.tag}** can use this button.` }); return false; };
            },
            max: 1,
            time: 60000,
            idle: 60000 / 2
        });
        collector.on("end", async () => {
            if (m) await m.edit({ components: [client.row().addComponents(but1.setDisabled(true), but2.setDisabled(true))] }).catch(() => { })
            else return;
        });
        collector.on('collect', async (int) => {
            if (int.customId === 'addprevious') {
                await int.deferUpdate().catch(() => { });
                if (!dispatcher.queue.previous) return await m.edit({ embeds: [client.embed().setDescription(`${client.emoji.cross} No previously played track is located.`).setColor(color)], components: [client.row().addComponents([but1, but2])] }).catch(() => { });
                if (m) return await m.edit({ embeds: [embed.setDescription(`${client.emoji.tick} Added - \`${dispatcher.queue.previous.title}\` to the queue.`)], components: [client.row().addComponents([but1, but2])] }).catch(() => { });
                dispatcher.queue.unshift(dispatcher.queue.previous);
                await client.util.update(dispatcher, client);
            } else if (int.customId === 'playprevious') {
                await int.deferUpdate().catch(() => { });
                if (!dispatcher.queue.previous) return await m.edit({ embeds: [client.embed().setDescription(`${client.emoji.cross} No previously played track is located.`).setColor(color)], components: [client.row().addComponents([but1, but2])] }).catch(() => { });
                dispatcher.queue.unshift(dispatcher.queue.previous);
                dispatcher.skip()
                await client.util.update(dispatcher, client);
                if (m) return await m.edit({ embeds: [client.embed().setDescription(`${client.emoji.tick} Added - \`${dispatcher.queue.previous.title}\` to the queue.`).setColor(color)], components: [client.row().addComponents([but1, but2])] }).catch(() => { });
            }
        })
    }
})