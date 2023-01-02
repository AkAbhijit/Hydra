module.exports = new Object({
    name: "eval",
    description: "Evals the code.",
    category: "Developers",
    usage: "",
    cooldown: 10,
    usage: '',
    aliases: ['e'],
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
        const code = args.join(' ');
        if (!code) {
            return message.reply({ embeds: [client.embed().setColor(color).setDescription('Please provide code to eval!')] });
        }
        try {
            let evaled = await eval(code);
            if (typeof evaled !== 'string') { evaled = require('util').inspect(evaled, { depth: 0 }) }
            if (code.includes('client.config.Token') || code.includes('client.config.MongoData')) {
                evaled = 'No, shut up, what will you do it with the token?';
            }
            if (evaled.includes(client.config.Token)) {
                evaled = evaled.replace(client.config.Token, 'CENSORED');
            }
            if (evaled.includes(client.config.MongoData)) {
                evaled = evaled.replace(client.config.MongoData, 'CENSORED');
            }
            const splitDescription = evaled;
            return message.reply({
                content: `\`\`\`js\n${splitDescription}\n\`\`\``,
                components: [
                    client.row().addComponents(
                        client.button()
                            .setStyle(client.config.button.red)
                            .setCustomId("delete")
                            .setEmoji(client.emoji.delete)
                    ),
                ],
            });
        } catch (e) {
            client.console.log(e, 'error');
            return message.reply({
                content: `\`\`\`js\n${e}\n\`\`\``,
                components: [
                    client.row().addComponents(
                        client.button()
                            .setStyle(client.config.button.red)
                            .setCustomId("delete")
                            .setEmoji(client.emoji.delete)
                    )
                ],
            });
        }
    },
});
