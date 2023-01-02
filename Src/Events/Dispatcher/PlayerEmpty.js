const setupdb = require('../../Models/Setup');
const twofourseven = require('../../Models/247');
module.exports = new Object({
    name: 'playerEmpty',
    /**
     *
     * @param {import("../../Saavan")} client
     * @param {import("kazagumo").KazagumoPlayer} dispatcher
     */
    async execute(client, dispatcher) {
        if (dispatcher.data.get('autoplay')) {
            dispatcher.queue.previous = dispatcher.data.get('autoplayfunction');
            return client.util.autoplay(client, dispatcher);
        }
        const color = client.color ? client.color : '#f50a83';
        const guild = client.guilds.cache.get(dispatcher.guildId);
        if (!guild) return;
        const channel = guild.channels.cache.get(dispatcher.textId);
        if (!channel) return;
        const prefix = await client.util.getPrefix(dispatcher.guildId, client);
        let data = await twofourseven.findOne({ _id: dispatcher.guildId });
        if (data && data.mode) {
            let d2 = await setupdb.findOne({ _id: dispatcher.guildId });
            if (!d2) return;

            let chn = guild.channels.cache.get(d2.channel);
            if (!chn) return;

            let me;
            try { me = await chn.messages.fetch(d2.message, { cache: true }); } catch (e) { };
            if (me) {
                let disabled = true;
                const player = client.dispatcher.players.get(dispatcher.guildId);
                if (player && player.queue.current) disabled = false;
                const pausebut = client.button().setCustomId('pause_but').setEmoji(dispatcher && !dispatcher.paused ? "1053771643312414770" : "1053771645631856680").setStyle(client.config.button.grey).setDisabled(disabled);
                const skipbut = client.button().setCustomId('skipbut_but').setEmoji('1053771641110405163').setStyle(client.config.button.grey).setDisabled(disabled);
                const shuffle = client.button().setCustomId('shuffle_but').setEmoji('1053771639004860456').setStyle(client.config.button.grey).setDisabled(disabled);
                const Loop = client.button().setCustomId('loopmodesbut_but').setEmoji('1053771636547010580').setStyle(client.config.button.grey).setDisabled(disabled);
                const stopbut = client.button().setCustomId('stop_but').setEmoji('1053880333793247352').setStyle(client.config.button.grey).setDisabled(disabled);
                const row = client.row().addComponents([pausebut, skipbut, stopbut, Loop, shuffle]);
                const embed1 = client.embed()
                    .setColor(color)
                    .setTitle('No song playing currently')
                    .setDescription(`[Invite](${client.config.links.invite}) | [Dashboard](${client.config.links.invite}) | [Commands](${client.config.links.invite}) | [Support](${client.config.links.support})`)
                    .setFooter({ text: `Prefix for this server is: ${prefix}` })
                    .setImage(client.config.links.bg);
                await me.edit({ content: 'Join a voice channel and queue songs by name or url in here.', embeds: [embed1], components: [row] });
            } else return;
        } else {
            let d2 = await setupdb.findOne({ _id: dispatcher.guildId });
            if (!d2) return;

            let chn = guild.channels.cache.get(d2.channel);
            if (!chn) return;

            let me;
            try { me = await chn.messages.fetch(d2.message, { cache: true }); } catch (e) { };
            if (me) {
                let disabled = true;
                const player = client.dispatcher.players.get(dispatcher.guildId);
                if (player && player.queue.current) disabled = false;
                const pausebut = client.button().setCustomId('pause_but').setEmoji(dispatcher && !dispatcher.paused ? "1053771643312414770" : "1053771645631856680").setStyle(client.config.button.grey).setDisabled(disabled);
                const skipbut = client.button().setCustomId('skipbut_but').setEmoji('1053771641110405163').setStyle(client.config.button.grey).setDisabled(disabled);
                const shuffle = client.button().setCustomId('shuffle_but').setEmoji('1053771639004860456').setStyle(client.config.button.grey).setDisabled(disabled);
                const Loop = client.button().setCustomId('loopmodesbut_but').setEmoji('1053771636547010580').setStyle(client.config.button.grey).setDisabled(disabled);
                const stopbut = client.button().setCustomId('stop_but').setEmoji('1053880333793247352').setStyle(client.config.button.grey).setDisabled(disabled);
                const row = client.row().addComponents([pausebut, skipbut, stopbut, Loop, shuffle]);
                const embed1 = client.embed()
                    .setColor(color)
                    .setTitle('No song playing currently')
                    .setDescription(`[Invite](${client.config.links.invite}) | [Dashboard](${client.config.links.invite}) | [Commands](${client.config.links.invite}) | [Support](${client.config.links.support})`)
                    .setFooter({ text: `Prefix for this server is: ${prefix}` })
                    .setImage(client.config.links.bg);
                await me.edit({ content: 'Join a voice channel and queue songs by name or url in here.', embeds: [embed1], components: [row] });
            } else return;
            setTimeout(async () => {
                if (dispatcher && !dispatcher.queue.current) {
                    const e = await channel.send({
                        embeds: [
                            client.embed()
                                .setColor(color)
                                .setDescription(`I left the voice channel due to inactivity.\nIf this is a Premium server, you can disable the disconnect via \`${prefix}\`24/7.`)
                        ]
                    });
                    dispatcher.destroy();
                    setTimeout(async () => await e.delete().catch(() => { }), 5000);
                };
            }, 60000);
        }

    },
});