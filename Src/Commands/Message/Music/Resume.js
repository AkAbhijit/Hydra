module.exports = new Object({
    name: "resume",
    description: "Resumes the current paused track.",
    category: "Music",
    cooldown: 10,
    usage: '',
    aliases: ['res'],
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
        if (dispatcher.paused) {
            await client.util.update(dispatcher, client);
            await client.util.msgReply(message, `${client.emoji.tick} Resumed the song at ${dispatcher.shoukaku.position}.`, color).catch(() => { });
            dispatcher.pause(false);
        } else {
            return await client.util.msgReply(message, `${client.emoji.cross} The song is not paused.`, color).catch(() => { });
        }
    }
})