module.exports = new Object({
    name: "join",
    description: "Make the bot join a VC.",
    category: "Music",
    cooldown: 60,
    usage: '',
    aliases: ['connect'],
    examples: [''],
    sub_commands: [],
    args: false,
    permissions: {
        client: ['Connect'],
        user: ['Connect'],
        dev: false,
    },
    player: { voice: true, active: false, dj: false,  },

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
        if (dispatcher && message.guild.members.me.voice.channel) {
            return await client.util.msgReply(message, `${client.emoji.cross} I'm already connected in ${message.guild.channels.cache.has(dispatcher.voiceId) ? `<#${dispatcher.voiceId}>` : '`Unknown Channel`'}`, color);
        }
        if (!message.guild.members.me.voice.channel && !message.member.voice.channel.joinable) {
            return await client.util.msgReply(message, `${client.emoji.cross} I can't join your voice channel because it's full.`, color);
        }
        if (!dispatcher) dispatcher = await client.dispatcher.createPlayer({
            guildId: message.guildId,
            voiceId: message.member.voice.channelId,
            textId: message.channelId,
            deaf: true,
            shardId: message.guild.shardId,
        });
        if (!dispatcher.textId) dispatcher.setTextChannel(message.channelId);
        return await client.util.msgReply(message, `${client.emoji.tick} Joined ${message.member.voice.channel}`, color);
    }
})