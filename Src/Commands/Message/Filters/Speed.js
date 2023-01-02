module.exports = new Object({
    name: "speed",
    description: "Applies Speed filter.",
    category: "Filters",
    cooldown: 20,
    usage: '',
    aliases: [],
    examples: ["speed 1", "speed 2", "speed 3"],
    sub_commands: ["1", "2", "3", "reset"],
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
        if (args.length) {
            if (["reset", "r"].includes(args[0])) {
                dispatcher.setSpeed(1);
                return await client.util.msgReply(message, `${client.emoji.tick} Speed set to default \`[ ${dispatcher.speedAmount}x ]\``, color);
            } else {
                let value = parseInt(args[0]);
                if (isNaN(value)) return await client.util.replyOops(message, `${client.emoji.cross} Please provide a valid number, 1, 2, or 3.`, color);

                if (value <= 0 || value > 3) return await client.util.replyOops(message, `${client.emoji.cross} Please provide a valid number, 1, 2 or 3.`, color);

                dispatcher.setSpeed(value);
                return await client.util.msgReply(message, `${client.emoji.tick} Speed set to \`[ ${dispatcher.speedAmount}x ]\``, color);
            };
        } else {
            const embed1 = client.embed().setColor(color).setDescription(`Select the speed value that you want.`);

            const one = client.button().setCustomId("speed_button_1").setLabel("1x").setStyle(client.config.button.blue);
            const two = client.button().setCustomId("speed_button_2").setLabel("2x").setStyle(client.config.button.blue);
            const three = client.button().setCustomId("speed_button_3").setLabel("3x").setStyle(client.config.button.blue);
            const reset = client.button().setCustomId("speed_button_reset").setLabel("Reset").setStyle(client.config.button.blue);

            if (dispatcher.speedAmount === 1) one.setDisabled(true).setStyle(client.config.button.grey);
            else if (dispatcher.speedAmount === 2) two.setDisabled(true).setStyle(client.config.button.grey);
            else if (dispatcher.speedAmount === 3) three.setDisabled(true).setStyle(client.config.button.grey);
            else if (dispatcher.speedAmount === 0) reset.setDisabled(true).setStyle(client.config.button.grey);

            const m = await message.reply({ embeds: [embed1], components: [client.row().addComponents(one, two, three, reset)] });

            const collector = m.createMessageComponentCollector({
                filter: (b) => b.user.id === message.author.id ? true : false && b.deferUpdate().catch(() => { }),
                max: 4,
                time: 60000,
                idle: 60000 / 2
            });

            collector.on("end", async () => {
                if (!m) return;
                await m.edit({ components: [client.row().addComponents(one.setDisabled(true).setStyle(client.config.button.grey), two.setDisabled(true).setStyle(client.config.button.grey), three.setDisabled(true).setStyle(client.config.button.grey), reset.setDisabled(true).setStyle(client.config.button.grey))] }).catch(() => { });
            });

            collector.on("collect", async (button) => {
                if (!button.replied) await button.deferReply({ ephemeral: true }).catch(() => { });
                if (!dispatcher) return await client.util.intReply(button, `${client.emoji.cross} Nothing is playing right now to set bassboost level.`, color);
                if (!dispatcher.queue) return await client.util.intReply(button, `${client.emoji.cross} Nothing is playing right now to set bassboost level.`, color);
                if (!dispatcher.queue.current) return await client.util.intReply(button, `${client.emoji.cross} Nothing is playing right now to set bassboost level.`, color);

                if (button.customId === "speed_button_1") {
                    dispatcher.setSpeed(1);

                    one.setDisabled(true).setStyle(client.config.button.blue);
                    two.setDisabled(false).setStyle(client.config.button.blue);
                    three.setDisabled(false).setStyle(client.config.button.blue);
                    reset.setDisabled(true).setStyle(client.config.button.grey);

                    if (m) await m.edit({ components: [client.row().addComponents(one, two, three, reset)] }).catch(() => { });

                    return await client.util.intReply(button, `${client.emoji.tick} Speed set to \`[ ${dispatcher.speedAmount}x ]\``, color);
                } else if (button.customId === "speed_button_2") {
                    dispatcher.setSpeed(2);

                    one.setDisabled(false).setStyle(client.config.button.blue);
                    two.setDisabled(true).setStyle(client.config.button.grey);
                    three.setDisabled(false).setStyle(client.config.button.blue);
                    reset.setDisabled(false).setStyle(client.config.button.blue);

                    if (m) await m.edit({ components: [client.row().addComponents(one, two, three, reset)] }).catch(() => { });

                    return await client.util.intReply(button, `${client.emoji.tick} Speed set to \`[ ${dispatcher.speedAmount}x ]\``, color);
                } else if (button.customId === "speed_button_3") {
                    dispatcher.setSpeed(3);

                    one.setDisabled(false).setStyle(client.config.button.blue);
                    two.setDisabled(false).setStyle(client.config.button.blue);
                    three.setDisabled(true).setStyle(client.config.button.grey);
                    reset.setDisabled(false).setStyle(client.config.button.blue);

                    if (m) await m.edit({ components: [client.row().addComponents(one, two, three, reset)] }).catch(() => { });

                    return await client.util.intReply(button, `${client.emoji.tick} Speed set to \`[ ${dispatcher.speedAmount}x ]\``, color);
                } else if (button.customId === "speed_button_reset") {
                    dispatcher.setSpeed(1);

                    one.setDisabled(false).setStyle(client.config.button.blue);
                    two.setDisabled(false).setStyle(client.config.button.blue);
                    three.setDisabled(false).setStyle(client.config.button.blue);
                    reset.setDisabled(true).setStyle(client.config.button.grey);

                    if (m) await m.edit({ components: [client.row().addComponents(one, two, three, reset)] }).catch(() => { });

                    return await client.util.intReply(button, `${client.emoji.tick} Speed set to default \`[ ${dispatcher.speedAmount}x ]\``, color);
                } else return;
            });
        };
    },
});