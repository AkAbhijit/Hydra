module.exports = new Object({
    name: "clear",
    description: "Clears filter/queue.",
    category: "Music",
    cooldown: 60,
    usage: '<query>',
    aliases: ['c'],
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
        const but = client.button().setCustomId('cqueue').setLabel('Queue').setStyle(client.config.button.blue);
        const but2 = client.button().setCustomId('cfilter').setLabel('Filter').setStyle(client.config.button.blue);
        const row = client.row().addComponents(but, but2);
        const thing = client.embed()
            .setColor(color)
            .setDescription('Which one do you want to clear?');
        const m = await message.reply({ embeds: [thing], components: [row] });
        const collector = m.createMessageComponentCollector({
            filter: (b) => {
                if (b.user.id === message.author.id) return true;
                else { b.reply({ ephemeral: true, content: `${client.emoji.cross} Only **${message.author.tag}** can use this button, if you want then you've to run the command again.` }); return false; }
            },
            max: 1,
            time: 60000,
            idle: 60000 / 2
        });
        collector.on('end', async () => {
            if (!m) return;
            await m.edit({ components: [client.row().addComponents(but.setDisabled(true), but2.setDisabled(true))] }).catch(() => { });
        });
        collector.on('collect', async (b) => {
            if (b.customId === 'cqueue') {
                await b.deferUpdate().catch(() => { });
                if (!dispatcher.queue) {
                    const mmmm = client.embed().setColor(color).setDescription(`${client.emoji.cross} There Is Nothing In The Queue`);
                    return message.reply({ embeds: [mmmm] });
                }
                dispatcher.queue.clear();
                await client.util.update(dispatcher, client);
                await m.edit({ embeds: null, components: [client.row().addComponents(but.setDisabled(true), but2.setDisabled(true))] });
                return await m.reply({ embeds: [client.embed().setDescription(`${client.emoji.tick} Cleared the Queue.`).setColor(color)] });
            }
            if (b.customId === 'cfilter') {
                await b.deferUpdate().catch(() => { });
                await dispatcher.clearfilter();
                await client.util.update(dispatcher, client);
                await m.edit({ embeds: null, components: [client.row().addComponents(but.setDisabled(true), but2.setDisabled(true))] });
                return await m.reply({ embeds: [client.embed().setDescription(`${client.emoji.tick} Cleared the Filter.`).setColor(color)] });
            }
        });
    }
})