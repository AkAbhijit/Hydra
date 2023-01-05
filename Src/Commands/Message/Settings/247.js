const db = require('../../../Models/247');

module.exports = new Object({
    name: "247",
    description: "Toggles 24/7 mode.",
    category: "Settings",
    usage: "",
    cooldown: 10,
    usage: '[sub_command]',
    aliases: ["24/7", "24h"],
    category: "Settings",
    examples: ["247"],
    args: false,
    permissions: {
        client: [],
        user: ['Administrator', 'ManageGuild'],
        dev: false,

    },
    player: { voice: false, active: false, dj: false, },
    /**
     * 
     * @param {import("../../../Saavan")} client 
     * @param {import("discord.js").Message} message
     * @param {String[]} args
     * @param {String} prefix
     * @param {String} color
     *  @param {import('kazagumo').KazagumoPlayer} dispatcher
     */
    async execute(client, message, args, prefix, color, dispatcher) {
        let data = await db.findOne({ _id: message.guildId });
        const enable = new Array('enabled', 'activated');
        const disable = new Array('disabled', 'deactivated');
        if (!data) {
            data = new db({
                _id: message.guildId,
                mode: true,
                textChannel: message.channelId,
                voiceChannel: message.member.voice.channelId,
                moderator: message.author.id,
                lastUpdated: Math.round(Date.now() / 1000),
            });
            await data.save();
            if (!dispatcher) dispatcher = client.dispatcher.createPlayer({ guildId: message.guildId, textId: message.channelId, voiceId: message.member.voice.channelId, deaf: true, shardId: message.guild.shardId });

            return await client.util.msgReply(message, `${client.emoji.tick} 24/7 mode is now **${enable[~~(Math.random() * enable.length)]}**.`, color);
        } else {
            data._id = message.guildId;
            data.mode = true;
            data.textChannel = null;
            data.voiceChannel = null;
            data.mode = false;
            data.moderator = message.author.id;
            data.lastUpdated = Math.round(Date.now() / 1000);

            await data.save();
            return await client.util.msgReply(message, `${client.emoji.tick} 24/7 mode is now **${disable[~~(Math.random() * disable.length)]}**.`, color);
        }
    },
});