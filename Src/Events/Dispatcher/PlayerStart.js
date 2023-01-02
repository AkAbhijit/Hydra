const db = require('../../Models/Setup');
const { trackStartHandler } = require('../../Handler/RequestChannelEvent');
const db2 = require('../../Models/Announce');

module.exports = new Object({
    name: 'playerStart',
    /**
     * @param {import("../../Saavan")} client
     * @param {import("kazagumo").KazagumoPlayer} dispatcher
     * @param {import("kazagumo").KazagumoTrack} track
     */
    async execute(client, dispatcher, track) {
        const color = client.color;
        dispatcher.data.set('autoplayfunction', track);
        const guild = client.guilds.cache.get(dispatcher.guildId);
        if (!guild) return;
        let channel = guild.channels.cache.get(dispatcher.textId);
        if (!channel) return;
        const { author } = dispatcher.queue.current;
        const data = await db.findOne({ _id: guild.id });
        const data2 = await db2.findOne({ _id: guild.id });
        if (data && data.channel) {
            const textChannel = guild.channels.cache.get(data.channel);
            const id = data.message;
            if (channel.id === textChannel.id) {
                if (data2 && data2.mode && data2.channel) {
                    channel = guild.channels.cache.get(data2.channel);
                    if (data2.prunning) {
                        if (channel && channel.sendable && channel.id !== textChannel.id) me1 = await channel.send({ embeds: [client.embed().setTitle('Started Playing').setDescription(`[${track.title}](${track.uri}) by ${author}`).setColor(String(color))] }).then(x => dispatcher.data.set("message", x));
                    } else {
                        if (channel && channel.id !== textChannel.id && channel.sendable) await channel.send({ embeds: [client.embed().setTitle('Started Playing').setDescription(`[${track.title}](${track.uri}) by ${author}`).setColor(String(color))] }).catch(() => { });
                    }
                }
                return await trackStartHandler(id, textChannel, dispatcher, track, client, color);
            } else {
                await trackStartHandler(id, textChannel, dispatcher, track, client, color);
            }
        }
        if (data2 && !data2.mode) return;
        if (data2 && data2.channel) channel = guild.channels.cache.get(data2.channel);
        if (data2 && data2.prunning) {
            await channel.send({ embeds: [client.embed().setTitle('Started Playing').setDescription(`[${track.title}](${track.uri}) by ${author}`).setColor(String(color))] }).then(x => dispatcher.data.set("message", x));
        }
        await channel.send({ embeds: [client.embed().setTitle('Started Playing').setDescription(`[${track.title}](${track.uri}) by ${author}`).setColor(String(color))] }).then(x => dispatcher.data.set("message", x));
    },
});