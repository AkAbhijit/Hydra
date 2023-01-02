module.exports = new Object({
    name: "bassboost",
    description: "Applies the Bassboost effect.",
    category: "Filters",
    cooldown: 20,
    usage: '[level]',
    aliases: ['bb'],
    examples: ["bassboost", "bassboost none", "bassboost low", "bassboost medium", "bassboost high"],
    sub_commands: ["none", "low", "medium", "high"],
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
            if (["none", "n"].includes(args[0])) {
                if (dispatcher.bassboostLevel === "none") return await client.util.replyOops(message, `${client.emoji.cross} Bassboost level is already at \`[ ${dispatcher.bassboostLevel} ]\``, color);

                dispatcher.setBassboost("none");
                return await client.util.msgReply(message, `${client.emoji.tick} Bassboost level set to \`[ ${dispatcher.bassboostLevel} ]\``, color);
            } else if (["low", "l"].includes(args[0])) {
                if (dispatcher.bassboostLevel === "low") return await client.util.replyOops(message, `${client.emoji.cross} Bassboost level is already at \`[ ${dispatcher.bassboostLevel} ]\``, color);

                dispatcher.setBassboost("low");
                return await client.util.msgReply(message, `${client.emoji.tick} Bassboost level set to \`[ ${dispatcher.bassboostLevel} ]\``, color);
            } else if (["medium", "m"].includes(args[0])) {
                if (dispatcher.bassboostLevel === "medium") return await client.util.replyOops(message, `${client.emoji.cross} Bassboost level is already at \`[ ${dispatcher.bassboostLevel} ]\``, color);

                dispatcher.setBassboost("medium");
                return await client.util.msgReply(message, `${client.emoji.tick} Bassboost level set to \`[ ${dispatcher.bassboostLevel} ]\``, color);
            } else if (["high", "h"].includes(args[0])) {
                if (dispatcher.bassboostLevel === "high") return await client.util.replyOops(message, `${client.emoji.cross} Bassboost level is already at \`[ ${dispatcher.bassboostLevel} ]\``, color);

                dispatcher.setBassboost("high");
                return await client.util.msgReply(message, `${client.emoji.tick} Bassboost level set to \`[ ${dispatcher.bassboostLevel} ]\``, color);
            } else return await client.util.invalidArgs("bassboost", message, `${client.emoji.cross} Please provide a valid bassboost level, \`none, low, medium, high\``, client);
        } else {
            const embed1 = client.embed().setColor(color).setDescription(`Choose the bassboost level that you want.`);

            const none = client.button().setCustomId("bb_button_none").setLabel("None").setStyle(client.config.button.blue);
            const low = client.button().setCustomId("bb_button_low").setLabel("Low").setStyle(client.config.button.blue);
            const medium = client.button().setCustomId("bb_button_medium").setLabel("Medium").setStyle(client.config.button.blue);
            const high = client.button().setCustomId("bb_button_high").setLabel("High").setStyle(client.config.button.blue);

            if (dispatcher.bassboostLevel.includes("none")) none.setDisabled(true).setStyle(client.config.button.grey);
            else if (dispatcher.bassboostLevel.includes("low")) low.setDisabled(true).setStyle(client.config.button.grey);
            else if (dispatcher.bassboostLevel.includes("medium")) medium.setDisabled(true).setStyle(client.config.button.grey);
            else if (dispatcher.bassboostLevel.includes("high")) high.setDisabled(true).setStyle(client.config.button.grey);

            const m = await message.reply({ embeds: [embed1], components: [client.row().addComponents(none, low, medium, high)] });

            const collector = m.createMessageComponentCollector({
                filter: (b) => b.user.id === message.author.id ? true : false && b.deferUpdate().catch(() => { }),
                max: 4,
                time: 60000,
                idle: 60000 / 2
            });

            collector.on("end", async () => {
                if (!m) return;
                await m.edit({ components: [client.row().addComponents(none.setDisabled(true).setStyle(client.config.button.grey), low.setDisabled(true).setStyle(client.config.button.grey), medium.setDisabled(true).setStyle(client.config.button.grey), high.setDisabled(true).setStyle(client.config.button.grey))] }).catch(() => { });
            });

            collector.on("collect", async (button) => {
                if (!button.replied) await button.deferReply({ ephemeral: true }).catch(() => { });

                if (!dispatcher) return await client.util.intReply(button, `${client.emoji.cross} Nothing is playing right now to set bassboost level.`, color);
                if (!dispatcher.queue) return await client.util.intReply(button, `${client.emoji.cross} Nothing is playing right now to set bassboost level.`, color);
                if (!dispatcher.queue.current) return await client.util.intReply(button, `${client.emoji.cross} Nothing is playing right now to set bassboost level.`, color);

                if (button.customId === "bb_button_none") {
                    dispatcher.setBassboost("none");

                    none.setDisabled(true).setStyle(client.config.button.grey);
                    low.setDisabled(false).setStyle(client.config.button.blue);
                    medium.setDisabled(false).setStyle(client.config.button.blue);
                    high.setDisabled(false).setStyle(client.config.button.blue);

                    if (m) await m.edit({ components: [client.row().addComponents(none, low, medium, high)] }).catch(() => { });
                    return await client.util.intReply(button, `${client.emoji.tick} Bassboost level set to \`[ ${dispatcher.bassboostLevel} ]\``, color);
                } else if (button.customId === "bb_button_low") {
                    dispatcher.setBassboost("low");

                    none.setDisabled(false).setStyle(client.config.button.blue);
                    low.setDisabled(true).setStyle(client.config.button.grey);
                    medium.setDisabled(false).setStyle(client.config.button.blue);
                    high.setDisabled(false).setStyle(client.config.button.blue);

                    if (m) await m.edit({ components: [client.row().addComponents(none, low, medium, high)] }).catch(() => { });

                    return await client.util.intReply(button, `${client.emoji.tick} Bassboost level set to \`[ ${dispatcher.bassboostLevel} ]\``, color);
                } else if (button.customId === "bb_button_medium") {
                    dispatcher.setBassboost("medium");

                    none.setDisabled(false).setStyle(client.config.button.blue);
                    low.setDisabled(false).setStyle(client.config.button.blue);
                    medium.setDisabled(true).setStyle(client.config.button.grey);
                    high.setDisabled(false).setStyle(client.config.button.blue);

                    if (m) await m.edit({ components: [client.row().addComponents(none, low, medium, high)] }).catch(() => { });

                    return await client.util.intReply(button, `${client.emoji.tick} Bassboost level set to \`[ ${dispatcher.bassboostLevel} ]\``, color);
                } else if (button.customId === "bb_button_high") {
                    dispatcher.setBassboost("high");

                    none.setDisabled(false).setStyle(client.config.button.blue);
                    low.setDisabled(false).setStyle(client.config.button.blue);
                    medium.setDisabled(false).setStyle(client.config.button.blue);
                    high.setDisabled(true).setStyle(client.config.button.grey);

                    if (m) await m.edit({ components: [client.row().addComponents(none, low, medium, high)] }).catch(() => { });
                    return await client.util.intReply(button, `${client.emoji.tick} Bassboost level set to \`[ ${dispatcher.bassboostLevel} ]\``, color);
                } else return;
            });
        };
    }
})