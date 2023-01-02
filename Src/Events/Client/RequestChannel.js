const { playerhandler } = require('../../Handler/RequestChannelEvent');
const { PermissionFlagsBits } = require('discord.js');

module.exports = new Object({
    name: 'requestChannel',
    /**
     *
     * @param {import("../../Saavan")} client
     * @param {import('discord.js').Message} message
     */
    async execute(client, message) {
        const color = client.color ? client.color : '#f50a83';
        if (message.author.bot) return;
        const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const prefix = await client.util.getPrefix(message.guildId, client);
        const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
        var args;
        var cmd;
        if (prefixRegex.test(message.content)) {
            const [, matchedPrefix] = message.content.match(prefixRegex);
            args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
            cmd = args.shift().toLowerCase();
            var command = client.Commands.get(cmd);
            if (!command) command = client.Commands.get(client.Aliases.get(cmd));
            if (command) {
                if (message.content) message.delete()
                return client.util.oops(message.channel, `${client.emoji.cross} **Please use a Command Somewhere else!**`, color)
            }
        }

        if (!message.member.voice.channel) {
            await client.util.oops(message.channel, `${client.emoji.cross} You are not connected to a voice channel to queue songs.`, color);
            if (message) await message.delete().catch(() => { });
            return;
        }

        if (!message.member.voice.channel.permissionsFor(client.user).has([PermissionFlagsBits.Connect, PermissionFlagsBits.Speak])) {
            await client.util.oops(message.channel, `${client.emoji.cross} I don't have enough permission to connect/speak in ${message.member.voice.channel}`);
            if (message) await message.delete().catch(() => { });
            return;
        }

        if (message.guild.members.me.voice.channel && message.guild.members.me.voice.channelId !== message.member.voice.channelId) {
            await client.util.oops(message.channel, `${client.emoji.cross} You are not connected to <#${message.guild.members.me.voice.channelId}> to queue songs`, color);
            if (message) await message.delete().catch(() => { });
            return;
        }
        let dispatcher = client.dispatcher.players.get(message.guildId);
        if (!dispatcher) dispatcher = await client.dispatcher.createPlayer({
            guildId: message.guildId,
            textId: message.channelId,
            voiceId: message.member.voice.channelId,
            deaf: true,
            shardId: message.guild.shardId,
        });
        if (message) await message.delete().catch(() => { });
        return await playerhandler(message.content, dispatcher, message, color, client);
    }
});