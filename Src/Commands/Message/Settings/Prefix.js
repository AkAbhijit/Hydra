const db = require('../../../Models/Prefix');

module.exports = new Object({
    name: "prefix",
    description: "To configure the server prefix.",
    category: "Settings",
    usage: "",
    cooldown: 10,
    usage: '[sub_command]',
    aliases: [],
    examples: ["prefix set pls", "prefix clear", "prefix reset", "prefix info"],
    sub_commands: ['set', 'clear', 'reset', 'info'],
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
     */
    async execute(client, message, args, prefix, color) {
        let data = await db.findOne({ _id: message.guildId });

        if (["set", "s", "change"].includes(args[0])) {
            if (!args[1]) return await client.util.replyOops(message, `${client.emoji.cross} Please provide a prefix(symbol) to set.`, color);
            if (args[1].length >= 4) return await client.util.replyOops(message, `${client.emoji.cross} Prefix shouldn't be more than 3 characters.`, color);
            if (args[1].length <= 0) return await client.util.replyOops(message, `${client.emoji.cross} Prefix shouldn't be less than 0 characters.`, color);

            let newPrefix = args[1];
            if (data) {
                if (data.prefix === newPrefix) return await client.util.replyOops(message, `${client.emoji.cross} This prefix is already provided by <@${data.moderator}>`, color);

                data.oldPrefix = prefix;
                data.prefix = newPrefix;
                data.moderator = message.author.id;
                data.lastUpdated = Math.round(Date.now() / 1000);

                await data.save();
                return await client.util.msgReply(message, `${client.emoji.tick} Successfully saved server prefix as \`[ ${newPrefix} ]\``, color);
            } else {
                if (newPrefix === prefix) return await client.util.replyOops(message, `${client.emoji.cross} This is already the default prefix of the bot.`, color);
                data = new db({
                    _id: message.guildId,
                    prefix: newPrefix,
                    oldPrefix: prefix,
                    moderator: message.author.id,
                    lastUpdated: Math.round(Date.now() / 1000)
                });

                await data.save();
                return await client.util.msgReply(message, `${client.emoji.tick} Successfully updated server prefix to \`[ ${newPrefix} ]\``, color);
            };
        } else if (["clear", "delete", "d"].includes(args[0])) {
            if (!data) return await client.util.replyOops(message, `${client.emoji.cross} No prefix data found for this server.`, color);
            await data.delete();

            return await client.util.msgReply(message, `${client.emoji.tick} Successfully cleared server prefix and set to default \`[ ${client.config.prefix} ]\``);
        } else if (["reset", "restore", "r"].includes(args[0])) {
            if (!data) return await client.util.replyOops(message, `${client.emoji.cross} No prefix data found for this server.`, color);

            data.prefix = data.oldPrefix;
            data.oldPrefix = prefix;
            data.moderator = message.author.id;
            data.lastUpdated = Math.round(Date.now() / 1000);

            await data.save();
            return await client.util.msgReply(message, `${client.emoji.tick} Successfully reset server prefix to \`[ ${data.prefix} ]\``)
        } else if (["info", "stats", "status"].includes(args[0])) {
            const embed1 = client.embed().setColor(color).setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }), url: client.config.links.support }).setTitle(`Prefix Info/Stats`).addFields([
                {
                    name: "Current Prefix",
                    value: `\`[ ${prefix} ]\``,
                    inline: true
                },
                {
                    name: "Old Prefix",
                    value: `\`[ ${data && data.oldPrefix ? data.oldPrefix : prefix} ]\``,
                    inline: true
                }
            ]);

            if (data && data.moderator) embed1.addField("Moderator", `<@${data.moderator}> (\`id: ${data.moderator}\`)`, true);
            if (data && data.lastUpdated) embed1.addField("Last Updated", `<t:${data.lastUpdated}>`, true);

            return await message.reply({ embeds: [embed1] }).catch(() => { });
        } else return await client.util.invalidArgs("prefix", message, "Please furnish the demanded sub command.", client);
    },
});