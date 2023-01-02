module.exports = new Object({
    name: "getinvite",
    description: "Evals the code.",
    category: "Developers",
    usage: "",
    cooldown: 10,
    usage: '',
    aliases: ['gi'],
    examples: [''],
    sub_commands: [],
    args: false,
    permissions: {
        client: [],
        user: [],
        dev: true,
         
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
        const guild = client.guilds.fetch(args[0]);
        if (!guild) return await client.util.replyOops(message, 'Guild not found', color);
        let text;
        (await guild).channels.cache.forEach((channel) => {
            if (channel.type === require('discord.js').ChannelType.GuildText) {
                text = channel;
            }
        });
        if (!text) return await client.util.replyOops(message, "No text channel found", color);
        try {
            const invite = await text.createInvite();
            await message.reply({ content: `https://discord.gg/${invite.code}`, ephemeral: true });
        } catch (e) {
            client.console.log(e, 'error');
        }
    }
})