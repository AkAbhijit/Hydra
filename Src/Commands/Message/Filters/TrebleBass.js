module.exports = new Object({
    name: "treblebass",
    description: "Toggle Treblebass effect.",
    category: "Filters",
    cooldown: 20,
    usage: '',
    aliases: [],
    examples: [""],
    sub_commands: [""],
    args: false,
    permissions: {
        client: [],
        user: [],
        dev: false,
         
    },
    player: { voice: true, active: true, dj: true,  },

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
        if (dispatcher.treblebass) {
            dispatcher.setTreblebass(false);
            return await client.util.msgReply(message, `${client.emoji.tick} Treblebass filter/effect is now disabled.`, color);
        } else {
            dispatcher.setTreblebass(true);
            return await client.util.msgReply(message, `${client.emoji.tick} Treblebass filter/effect is now enabled.`, color);
        }
    },
});