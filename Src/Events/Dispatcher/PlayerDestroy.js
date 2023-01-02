const db = require('../../Models/Setup');

module.exports = new Object({
    name: 'playerDestroy',
    /**
     * @param {import("../../Saavan")} client
     * @param {import("kazagumo").KazagumoPlayer} dispatcher
     */
    async execute(client, dispatcher) {

        const color = client.color ? client.color : '#f50a83';
        const guild = client.guilds.cache.get(dispatcher.guildId);
        if (!guild) return;
        const data = await db.findOne({ _id: guild.id });
        if (!data) return;
        const channel = guild.channels.cache.get(data.channel);
        if (!channel) return;
        const prefix = await client.util.getPrefix(dispatcher.guildId, client);
        let message;
        try { message = await channel.messages.fetch(data.message, { cache: true }); } catch (error) { }
        if (!message) return;

        const embed = client.embed()
            .setColor(color)
            .setTitle('No song playing currently')
            .setDescription(`[Invite](${client.config.links.invite}) | [Dashboard](${client.config.links.invite}) | [Commands](${client.config.links.invite}) | [Support](${client.config.links.support})`)
            .setFooter({ text: `Prefix for this server is: ${prefix}` })
            .setImage(client.config.links.bg);
        let disabled = true;
        const player = client.dispatcher.players.get(dispatcher.guildId);
        if (player && player.queue.current) disabled = false;
        const pausebut = client.button().setCustomId('pause_but').setEmoji(dispatcher && !dispatcher.paused ? "1053771643312414770" : "1053771645631856680").setStyle(client.config.button.grey).setDisabled(disabled);
        const skipbut = client.button().setCustomId('skipbut_but').setEmoji('1053771641110405163').setStyle(client.config.button.grey).setDisabled(disabled);
        const shuffle = client.button().setCustomId('shuffle_but').setEmoji('1053771639004860456').setStyle(client.config.button.grey).setDisabled(disabled);
        const Loop = client.button().setCustomId('loopmodesbut_but').setEmoji('1053771636547010580').setStyle(client.config.button.grey).setDisabled(disabled);
        const stopbut = client.button().setCustomId('stop_but').setEmoji('1053880333793247352').setStyle(client.config.button.grey).setDisabled(disabled);
        const row = client.row().addComponents([pausebut, skipbut, stopbut, Loop, shuffle]);

        await message.edit({ content: 'Join a voice channel and queue songs by name or url in here.', embeds: [embed], components: [row] });
    },
});