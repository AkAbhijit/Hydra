module.exports = new Object({
    name: "nightcore",
    description: "Toggles Nightcore filter.",
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
        if (dispatcher.nightcore) {
            dispatcher.setNightCore(false);
            return await client.util.msgReply(message, `${client.emoji.tick} Nightcore filter/effect is now disabled.`, color);
        } else {
            dispatcher.setNightCore(true);
            return await client.util.msgReply(message, `${client.emoji.tick} Nightcore filter/effect is now enabled.`, color);
        }
    },
});