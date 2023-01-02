module.exports = new Object({
    name: 'playerMoved',
    /**
     *
     * @param {import("../../Saavan")} client
     * @param {import("kazagumo").KazagumoPlayer} dispatcher
     * @param {import("kazagumo").PlayerMovedState} state
     * @param {import("kazagumo").PlayerMovedChannels} channel
     */
    async execute(client, dispatcher, state, channel) {

        const guild = client.guilds.cache.get(dispatcher.guildId);
        if (!guild) return;
        const chn = client.channels.cache.get(dispatcher.textId);
        if (channel.newChannelId === channel.oldChannelId) return;
        if (channel.newChannelId === null || !channel.newChannelId) {
            if (!dispatcher) return;
            dispatcher.destroy();
            if (chn) return await chn.send({ embeds: [client.embed().setDescription(`${client.emoji.cross} Someone has disconnected me from <#${channel.oldChannelId}>.`).setColor(client.color)] }).then((a) => setTimeout(async () => await a.delete().catch(() => { }), 12000)).catch(() => { });
        } else {
            if (!dispatcher) return;
            dispatcher.setVoiceChannel(channel.newChannelId);
            if (chn) await chn.send({ embeds: [client.embed().setDescription(`${client.emoji.tick} Successfully locomoted player voice channel to <#${dispatcher.voiceId}>.`).setColor(client.color)] }).then((a) => setTimeout(async () => await a.delete().catch(() => { }), 12000)).catch(() => { });
            if (dispatcher.paused) dispatcher.pause(false);
        }
    },
});