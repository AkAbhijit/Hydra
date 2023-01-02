const _setupdata = require("../../../Models/Setup"),
    _djdata = require("../../../Models/Dj"),
    _tfsdata = require("../../../Models/247"),
    _announcedata = require("../../../Models/Announce");
module.exports = new Object({
    name: "player",
    description: "Shows the latency of the bot.",
    category: "Misc",
    usage: "",
    cooldown: 10,
    usage: '',
    aliases: ['playerinfo'],
    examples: [''],
    sub_commands: [],
    args: false,
    permissions: {
        client: [],
        user: [],
        dev: false,
    },
    player: { voice: true, active: true, dj: false,  },
    /**
     * 
     * @param {import("../../../Saavan")} client 
     * @param {import("discord.js").Message} message
     * @param {String[]} args
     * @param {String} prefix
     * @param {String} color
     */
    async execute(client, message, args, prefix, color) {
        const player = client.dispatcher.players.get(message.guildId);

        let _247data = await _tfsdata.findOne({ _id: message.guildId });
        let djdata = await _djdata.findOne({ _id: message.guildId });
        let announcedata = await _announcedata.findOne({ _id: message.guildId });
        let setupdata = await _setupdata.findOne({ _id: message.guildId });

        const embed = client.embed()
            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() ? message.guild.iconURL() : client.user.displayAvatarURL(), url: client.config.links.support })
            .setTitle('Player stats')
            .setColor(color)
            .setDescription(`Player is Currently ${player.playing ? '`Active`' : '`Inactive`'}`)
            .addFields(
                {
                    name: 'Queue Stat(s)',
                    value: `Here is the Queue Stat(s)\n\n**• Now Playing** - \` ${player.playing ? 'Active' : 'Inactive'} \`\n**• Loop** - \`${player.loop !== "none" ? player.loop === "track" ? "Track" : "Queue" : "Off"}\`\n**• Total Tracks** - \` ${player.queue.length} \`\n**• Volume** - \` ${player.volume * 100}% \`\n**• Duration** - \` ${client.util.msToTime(player.playing ? player.queue.current.length : 0)} \``,
                    inline: false,
                },
                {
                    name: 'Setup Stat(s)',
                    value: `Here is the Setup Stat(s)\n\n**• Setup** - \` ${setupdata && setupdata ? 'Enabled' : 'Disabled'} \`\n**• Announcing** - \` ${announcedata && announcedata.mode ? 'Enabled' : 'Disabled'} \`\n**• 24/7** - \` ${_247data && _247data.mode ? 'Enabled' : 'Disabled'} \`\n**• DJ** - \` ${djdata && djdata.mode ? 'Enabled' : 'Disabled'} \``,
                    inline: false,
                },
            );
        return await message.reply({ embeds: [embed] });
    },
});