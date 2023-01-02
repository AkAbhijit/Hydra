module.exports = new Object({
    name: "node",
    description: "Get the node stats",
    category: "Developers",
    usage: "",
    cooldown: 10,
    usage: '',
    aliases: ['lavalink'],
    examples: [''],
    sub_commands: [],
    args: false,
    permissions: {
        client: [],
        user: [],
        dev: true,
         
    },
    player: { voice: false, active: false, dj: false,  },
    /**
     * 
     * @param {import("../../../Saavan")} client 
     * @param {import("discord.js").Message} message
     * @param {String[]} args
     * @param {String} prefix
     * @param {String} color
     */
    async execute(client, message, args, prefix, color) {
        return message.channel.send({
            embeds: [
                client.embed()
                    .setColor(color)
                    .setAuthor({ name: "Node Statistics", url: client.config.links.support, iconURL: client.user.displayAvatarURL() })
                    .setTimestamp()
                    .setDescription(`\`\`\`nim\n${[...client.dispatcher.shoukaku.nodes.values()].map((node) => `Node         :: ${node.state === 1 ? "🟢" : "🔴"} ${node.name}\nMemory Usage :: ${client.util.formatBytes(node.stats.memory.allocated)} - ${node.stats.cpu.lavalinkLoad.toFixed(2)}%\nConnections  :: ${client.dispatcher.players.size}\nUptime       :: ${client.util.msToTime(node.stats.uptime)}`).join("\n\n------------------------------------------------------------\n\n")}\`\`\``),
            ],
        });
    },
});