module.exports = new Object({
    name: "help",
    description: "Shows bot’s help panel.",
    category: "Misc",
    usage: "",
    cooldown: 10,
    usage: "[command_name]",
    aliases: ['h', 'commands', 'cmds'],
    examples: ["help", "help play", "help p"],
    sub_Commands: [],
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
        if (args.length) {
            let name, c;
            if (["music"].includes(args[0])) {
                name = "Music";
                c = client.Commands.filter((x) => x.category && x.category === name).map((x) => `\`${x.name}\``);

                return await message.reply({ embeds: [client.embed().setColor(color).setTitle(`${name} Commands`).setDescription(c.join(", ")).setFooter({ text: `Total ${c.length} ${name.toLowerCase()} Commands.` })] }).catch(() => { });
            } else if (["filters"].includes(args[0])) {
                name = "Filters";
                c = client.Commands.filter((x) => x.category && x.category === name).map((x) => `\`${x.name}\``);

                return await message.reply({ embeds: [client.embed().setColor(color).setTitle(`${name} Commands`).setDescription(c.join(", ")).setFooter({ text: `Total ${c.length} ${name.toLowerCase()} Commands.` })] }).catch(() => { });
            } else if (["settings", "config"].includes(args[0])) {
                name = "Settings";
                c = client.Commands.filter((x) => x.category && x.category === name).map((x) => `\`${x.name}\``);

                return await message.reply({ embeds: [client.embed().setColor(color).setTitle(`${name} Commands`).setDescription(c.join(", ")).setFooter({ text: `Total ${c.length} ${name.toLowerCase()} Commands.` })] }).catch(() => { });
            } else if (["misc"].includes(args[0])) {
                name = "Misc";
                c = client.Commands.filter((x) => x.category && x.category === name).map((x) => `\`${x.name}\``);

                return await message.reply({ embeds: [client.embed().setColor(color).setTitle(`${name} Commands`).setDescription(c.join(", ")).setFooter({ text: `Total ${c.length} ${name.toLowerCase()} Commands.` })] }).catch(() => { });
            } else {
                const command = client.Commands.get(args[0]) || client.Commands.get(client.Aliases.get(args[0]));
                if (!command) return await client.util.replyOops(message, `${client.emoji.cross} Cannot find the command called "${args[0]}"`, color);

                let commandAliases = [];
                if (Array.isArray(command.aliases)) for (let i of command.aliases) commandAliases.push(`${prefix}${i}`);

                let commandExamples = [];
                if (Array.isArray(command.examples)) for (let i of command.examples) commandExamples.push(`${prefix}${i}`);

                let CommandsubCommands = [];
                if (Array.isArray(command.sub_Commands)) for (i of command.sub_Commands) CommandsubCommands.push(`${prefix}${command.name} ${i}`);

                const fieldData = [
                    {
                        name: "Usage",
                        value: `${command.usage ? `\`${prefix}${command.name} ${command.usage}\`` : `\`${prefix}${command.name}\``}`,
                        inline: false
                    },
                    {
                        name: "Cooldown",
                        value: `${command.cooldown ? `\`[ ${client.util.msToTime(1000 * command.cooldown)} ]\`` : "`[ 3s ]`"}`,
                        inline: false
                    },
                    {
                        name: "Category",
                        value: `${command.category ? command.category : "None"}`,
                        inline: false
                    }
                ];

                if (commandAliases.length > 0) fieldData.push({
                    name: "Aliases",
                    value: `${commandAliases.map((x) => `\`${x}\``).join(", ")}`,
                    inline: false
                });

                if (CommandsubCommands.length > 0 && CommandsubCommands.length < 5) fieldData.push({
                    name: "Sub command(s)",
                    value: `${CommandsubCommands.map((x) => `\`${x}\``).join("\n")}`,
                    inline: false
                });

                if (commandExamples.length > 0 && commandExamples.length < 5) fieldData.push({
                    name: "Example(s)",
                    value: `${commandExamples.map((x) => `\`${x}\``).join("\n")}`,
                    inline: false
                });

                if (CommandsubCommands.length >= 5 || commandExamples.length >= 5) {
                    for (let i of fieldData) i.inline = true;

                    const embed1 = client.embed().setColor(color).setDescription(command.description).setTitle(`Help **${command.name}**`).setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) }).addFields(fieldData);

                    const fieldData2 = [];
                    if (CommandsubCommands.length > 0) fieldData2.push({
                        name: "Sub command(s)",
                        value: `${CommandsubCommands.map((x) => `\`${x}\``).join("\n")}`,
                        inline: true
                    });

                    if (commandExamples.length > 0) fieldData2.push({
                        name: "Example(s)",
                        value: `${commandExamples.map((x) => `\`${x}\``).join("\n")}`,
                        inline: true
                    });

                    const embed2 = client.embed().setColor(color).setDescription(command.description).setTitle(`Help **${command.name}**`).setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) }).addFields(fieldData2);

                    const pages = [embed1, embed2];
                    let page = 0;

                    embed2.setFooter({ text: `Page ${page + 1} of ${pages.length}` });
                    embed1.setFooter({ text: `Page ${page + 1} of ${pages.length}` });

                    const previousbut = client.button().setCustomId(`previous_but_help_cmd`).setEmoji({ name: '⬅️' }).setStyle(client.config.button.grey);
                    const nextbut = client.button().setCustomId(`next_but_help_cmd`).setEmoji({ name: '➡️' }).setStyle(client.config.button.grey);
                    const m = await message.reply({ embeds: [pages[page]], components: [client.row().addComponents(previousbut, nextbut)] });

                    const collector = m.createMessageComponentCollector({
                        filter: (b) => b.user.id === message.author.id ? true : false && b.deferUpdate().catch(() => { }),
                        time: 60000 * 2,
                        idle: 60000
                    });

                    collector.on("end", async () => {
                        if (!m) return;
                        await m.edit({ components: [client.row().addComponents(previousbut.setDisabled(true), nextbut.setDisabled(true))] }).catch(() => { });
                    });

                    collector.on("collect", async (button) => {
                        if (!button.deferred) await button.deferUpdate().catch(() => { });
                        if (button.customId === "previous_but_help_cmd") {
                            page = page - 1 < 0 ? pages.length - 1 : --page;
                            if (!m) return;

                            pages[page].setFooter({ text: `Page ${page + 1} of ${pages.length}` });
                            return await m.edit({ embeds: [pages[page]] }).catch(() => { });
                        } else if (button.customId === "next_but_help_cmd") {
                            page = page + 1 >= pages.length ? 0 : ++page;
                            if (!m) return;
                            pages[page].setFooter({ text: `Page ${page + 1} of ${pages.length}` });
                            return await m.edit({ embeds: [pages[page]] }).catch(() => { });
                        } else return;
                    });
                } else {
                    const embed2 = client.embed().setColor(color).setDescription(command.description).setTitle(`Help **${command.name}**`).setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ dynamic: true }) }).addFields(fieldData);
                    return await message.reply({ embeds: [embed2] }).catch(() => { });
                };
            };
        } else {
            info_commands = client.Commands.filter((x) => x.category && x.category === "Misc").map((x) => `\`${x.name}\``);
            music_commands = client.Commands.filter((x) => x.category && x.category === "Music").map((x) => `\`${x.name}\``);
            admin_commands = client.Commands.filter((x) => x.category && x.category === "Settings").map((x) => `\`${x.name}\``);
            filter_commands = client.Commands.filter((x) => x.category && x.category === "Filters").map((x) => `\`${x.name}\``);

            const embed = client.embed()
                .setAuthor(
                    {
                        name: 'Help Command',
                        icon_url: 'https://cdn.discordapp.com/avatars/547905866255433758/2fcb77582acae7ecedd97db9c238c1f3.png',
                        proxy_icon_url: 'https://images-ext-1.discordapp.net/external/HWSlVcfQM2HnJUZF0rUpmL5MsjS70OjoW3AbCveagrg/https/cdn.discordapp.com/avatars/547905866255433758/2fcb77582acae7ecedd97db9c238c1f3.png'
                    }
                )
                .setThumbnail(client.user.displayAvatarURL())
                .addFields(
                    {
                        name: 'Everyone commands',
                        value: info_commands.join(", "),
                        inline: false
                    },
                    {
                        name: 'DJ commands',
                        value: client.Commands.filter((x) => x.player && x.player.dj).map((x) => `\`${x.name}\``).join(", "),
                        inline: false
                    },
                    {
                        name: 'Admin commands',
                        value: admin_commands.join(", "),
                        inline: false
                    },
                    {
                        name: 'Music commands',
                        value: music_commands.join(", "),
                        inline: false
                    },
                )
                .setColor(color)
                .setFooter({ text: `Type '${prefix}help <CommandName>' for details on a command` });

            const m = await message.reply({ embeds: [embed] })
        }
    },
});