module.exports = new Object({
    name: "stats",
    description: "Shows a deep status of the bot.",
    category: "Misc",
    usage: "",
    cooldown: 10,
    usage: '',
    aliases: ['info'],
    examples: ['info', 'stats', 'botinfo'],
    sub_commands: [],
    args: false,
    permissions: {
        client: [],
        user: [],
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
        return message.reply({
            embeds: [
                client.embed()
                    .setColor(color)
                    .setAuthor({
                        name: 'My Statistics',
                        url: client.config.links.support,
                        iconURL: client.user.displayAvatarURL({ forceStatic: true }),
                    })
                    .setTimestamp()
                    .setThumbnail(client.user.displayAvatarURL({ forceStatic: true }))
                    .addFields([
                        {
                            name: 'Status',
                            value: `Bot Latency : \`${Math.round(client.ws.ping)} ms\`\nUptime : <t:${(Date.now() / 1000 - client.uptime / 1000).toFixed()}:R>\nCommands : \`${client.Commands.filter((x) => x.category && x.category !== "Developers").map((x) => x.name).length}\``,
                            inline: false,
                        },
                        {
                            name: 'Servers',
                            value: `\`${client.guilds.cache.size}\``,
                            inline: true,
                        },
                        {
                            name: 'Users',
                            value: `\`${client.guilds.cache.reduce((x, y) => x + y.memberCount, 0)}\``,
                            inline: true,
                        },
                        {
                            name: 'Channels',
                            value: `\`${client.channels.cache.size}\``,
                            inline: true,
                        },
                        {
                            name: 'Host',
                            value: `Platform : \`${require('os').type}\`\nTotal Memory : \`${client.util.formatBytes(require('os').totalmem)}\`\nFree Memory : \`${client.util.formatBytes(require('os').freemem)}\`\nUptime : ${client.util.msToTime(require('os').uptime)}\n`,
                            inline: false,
                        },
                        {
                            name: 'Library',
                            value: `Discord.js : \`v${require('discord.js').version}\`\nNode : \`${process.version}\``,
                            inline: false,
                        },
                    ]),
            ],
        });
    },
});