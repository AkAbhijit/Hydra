module.exports = new Object({
    name: "loop",
    description: "Toggle track/queue loop.",
    category: "Music",
    cooldown: 10,
    usage: '<input>',
    aliases: ['lp', 'repeat'],
    examples: ['loop queue', 'loop track', 'loop off'],
    sub_commands: ['queue', 'track', 'off'],
    args: true,
    permissions: {
        client: [],
        user: [],
        dev: false,
    },
    player: { voice: true, active: false, dj: true,  },

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
        const enable = new Array('enabled', 'activated');
        const disable = new Array('disabled', 'deactivated');
        const mode = args[0];
        if (mode === 'track') {
            if (dispatcher.loop !== 'track') {
                dispatcher.setLoop('track');
                await client.util.update(dispatcher, client);
                return await client.util.msgReply(message, `${client.emoji.tick} Looping the current song **${enable[~~(Math.random() * enable.length)]}**.`, color);
            } else {
                dispatcher.setLoop('none');
                await client.util.update(dispatcher, client);
                return await client.util.msgReply(message, `${client.emoji.tick} Looping the current song **${disable[~~(Math.random() * disable.length)]}**.`, color);
            }
        } else if (mode === 'queue') {
            if (dispatcher.loop !== 'queue') {
                dispatcher.setLoop('queue');
                await client.util.update(dispatcher, client);
                return await client.util.msgReply(message, `${client.emoji.tick} Looping the queue **${enable[~~(Math.random() * enable.length)]}**.`, color);
            } else {
                dispatcher.setLoop('none');
                await client.util.update(dispatcher, client);
                return await client.util.msgReply(message, `${client.emoji.tick} Looping the queue **${disable[~~(Math.random() * disable.length)]}**.`, color);
            }
        } else if (mode === 'off') {
            dispatcher.setLoop('none');
            await client.util.update(dispatcher, client);
            return await client.util.msgReply(message, `${client.emoji.tick} Looping is now **${disable[~~(Math.random() * disable.length)]}**.`, color);
        } else await client.util.invalidArgs("loop", message, "Please furnish the demanded sub command.", client)
    }
})