module.exports = new Object({
    name: "invite",
    description: "Get a link to invite.",
    category: "Misc",
    usage: "",
    cooldown: 10,
    usage: '',
    aliases: ['addme', 'add'],
    examples: [''],
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
                    .setDescription(`[Click here](${client.config.links.invite}) to invite the bot.`)
                    .setColor(color),
            ],
        });
    },
});