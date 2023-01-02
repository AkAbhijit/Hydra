const setupSchema = require('../Models/Setup');
/**
 *
 * @param {String} msgId
 * @param {TextChannel} channel
 * @param {import("kazagumo").KazagumoPlayer} dispatcher
 * @param {import("kazagumo").KazagumoTrack} track
 * @param {import("../Saavan")} client
 * @param {String} color
 */

async function trackStartHandler(msgId, channel, dispatcher, track, client, color) {
    try {
        let me;
        try { me = await channel.messages.fetch(msgId, { cache: true }); } catch (error) { }
        await me.delete()
        const { title, length, author } = dispatcher.queue.current;

        const icon = client.config.links.bg;
        const embed = client.embed()
            .setTitle(`[ ${client.util.duration(length)} ] - ${author} - ${title}`)
            .setColor(color)
            .setImage(icon)
            .setFooter({ text: `${dispatcher.queue.length} songs in queue  |  Volume: ${dispatcher.volume * 100}%${dispatcher.loop !== 'none' ? `  |  Loop: ${dispatcher.loop === "track" ? "Track" : "Queue"}` : ""}${dispatcher.paused ? "  |  Song Paused" : ""}`, })

        const pausebut = client.button().setCustomId('pause_but').setEmoji(dispatcher && !dispatcher.paused ? "1053771643312414770" : "1053771645631856680").setStyle(client.config.button.grey).setDisabled(false);
        const skipbut = client.button().setCustomId('skipbut_but').setEmoji('1053771641110405163').setStyle(client.config.button.grey).setDisabled(false);
        const shuffle = client.button().setCustomId('shuffle_but').setEmoji('1053771639004860456').setStyle(client.config.button.grey).setDisabled(false);
        const Loop = client.button().setCustomId('loopmodesbut_but').setEmoji('1053771636547010580').setStyle(client.config.button.grey).setDisabled(false);
        const stopbut = client.button().setCustomId('stop_but').setEmoji('1053880333793247352').setStyle(client.config.button.grey).setDisabled(false);
        const row = client.row().addComponents([pausebut, skipbut, stopbut, Loop, shuffle]);

        let m = await channel.send({
            content: dispatcher.queue?.length
                ? `**__Queue List:__**\n\n${client.util.trimArray(dispatcher.queue.map((track, i) => `${++i}. ${track.title.length > 64 ? track.title.substring(0, 64) + "..." : track.title} [ ${client.util.duration(track.length)} ] `))}`
                : "Join a voice channel and queue songs by name or url in here.",
            embeds: [embed],
            components: [row],
        });

        return await setupSchema.findOneAndUpdate({ _id: channel.guildId }, { message: m.id });
    } catch (error) {
        return console.error(error);
    }
}


/**
 *
 * @param {String} query
 * @param {import("kazagumo").KazagumoPlayer} dispatcher
 * @param {import("discord.js").Message} message
 * @param {String} color
 * @param {import('../Saavan')} client
 */

async function playerhandler(query, dispatcher, message, color, client) {
    if (query.startsWith("https://") || query.startsWith("http://")) {
        if (!query.match(/(?:https:\/\/open\.spotify\.com\/|spotify:)(?:.+)?(track|playlist|album|artist)[\/:]([A-Za-z0-9]+)/)) {
            if (!query.match(/^https?:\/\/(soundcloud\.com|snd\.sc)\/(.*)$/)) {
                return client.util.oops(message.channel, `${client.emoji.cross} Recently, We have removed youtube support from ${client.user.username}. Try giving the link from another source or type a track name to use our default platform.`)
            }
        }
    }

    if (dispatcher && dispatcher.state !== 'CONNECTED') dispatcher = await message.client.dispatcher.createPlayer({
        guildId: message.guildId,
        voiceId: message.member.voice.channelId,
        textId: message.channelId,
        shardId: message.guild.shardId,
        deaf: true,
    });

    let searchTrack = query;
    const { tracks, type, playlistName } = await dispatcher.search(searchTrack, { requester: message.author, engine: 'spotify' });
    if (!tracks.length) {
        return client.util.oops(message.channel, 'No songs found.', color);
    }
    if (type === 'PLAYLIST') {
        for (const track of tracks) {
            dispatcher.queue.add(track);
        }
        await client.util.update(dispatcher, client)
        if (!dispatcher.playing && !dispatcher.paused) dispatcher.play();
        await message.channel.send({
            embeds: [
                client.embed()
                    .setColor(color)
                    .setDescription(`Added **${tracks.length}** tracks from [${playlistName.length > 64 ? playlistName.substring(0, 64) + '...' : playlistName}](${query}) to the queue.`),
            ],
        }).then((a) => setTimeout(async () => await a.delete().catch(() => { }), 3000)).catch(() => { });
    } else {
        dispatcher.queue.add(tracks[0]);
        await client.util.update(dispatcher, client)
        if (!dispatcher.playing && !dispatcher.paused) dispatcher.play();
    }
}

module.exports = {
    trackStartHandler,
    playerhandler,
};