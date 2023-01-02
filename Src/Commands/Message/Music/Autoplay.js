module.exports = new Object({
    name: "autoplay",
    description: "Toggles Autoplay.",
    category: "Music",
    cooldown: 60,
    usage: '',
    aliases: ['ap'],
    examples: [''],
    sub_commands: [],
    args: false,
    permissions: {
        client: [],
        user: [],
        dev: false,
    },
    player: { voice: true, active: true, dj: true, },

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
        dispatcher.data.set('autoplay', !dispatcher.data.get('autoplay'));
        await client.util.update(dispatcher, client);
        return await client.util.msgReply(message, `${client.emoji.tick} Autoplay is now ${dispatcher.data.get('autoplay') ? '*`enabled`*' : '*`disabled`*'}.`, color);
    }
})