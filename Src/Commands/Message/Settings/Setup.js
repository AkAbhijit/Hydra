const { ChannelType, PermissionFlagsBits, AttachmentBuilder } = require('discord.js');
const db = require('../../../Models/Setup');

module.exports = new Object({
    name: "setup",
    description: "To setup song-request-channel for the server.",
    category: "Settings",
    usage: "",
    cooldown: 10,
    usage: '',
    aliases: [],
    examples: ["setup", "setup clear", "setup info"],
    sub_commands: ["change <channel_id>", "clear"],
    args: false,
    permissions: {
        client: ['Administrator', 'ManageGuild'],
        user: ['Administrator', 'ManageGuild'],
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
     * @param {import("kazagumo").KazagumoPlayer} dispatcher
     */
    async execute(client, message, args, prefix, color, dispatcher) {
        PermissionFlagsBits.Connect
        let data = await db.findOne({ _id: message.guildId });
        if (args.length) {
            if (["clear", "delete", "reset"].includes(args[0])) {
                if (!data) return await client.util.good(message.channel, `${client.emoji.cross} This server doesn\'t have done any setup configuration yet to use this command.`, color);
                await data.delete();
                return await client.util.good(message.channel, `${client.emoji.tick} Successfully deleted all the setup data.`, color);
            } else if (["info", "stats"].includes(args[0])) {
                if (!data) return await client.util.good(message.channel, `${client.emoji.cross} This server doesn\'t have done any setup configuration yet to use this command.`, color);
                const embed003 = client.embed()
                    .setColor(color)
                    .setTitle("Setup Info/Stats")
                    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }), url: client.config.links.support })
                    .addFields([
                        {
                            name: "Channel",
                            value: `<#${data.channel}> (\`id: ${data.channel}\`)`,
                            inline: false
                        },
                        {
                            name: "Moderator",
                            value: `<@${data.moderator}> (\`id: ${data.moderator}\`)`,
                            inline: false
                        },
                        {
                            name: "Last Updated",
                            value: `<t:${data.lastUpdated}>`,
                            inline: false
                        }
                    ]);
                return await message.reply({ embeds: [embed003] }).catch(() => { });
            } else return await client.util.invalidArgs("setup", message, "Please furnish the demanded sub command.", client);
        } else {
            if (data) return await client.util.replyOops(message, `${client.emoji.cross} Music setup is already finished in this server.`, color);

            const textChannel = await message.guild.channels.create({
                name: `${client.user.username}-song-requests`,
                type: ChannelType.GuildText,
                permissionOverwrites: [
                    {
                        type: 'member',
                        id: client.user.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks, PermissionFlagsBits.ReadMessageHistory],
                        deny: [PermissionFlagsBits.UseApplicationCommands],
                    },
                    {
                        type: 'role',
                        id: message.guild.roles.everyone.id,
                        allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory],
                        deny: [PermissionFlagsBits.UseApplicationCommands],
                    },
                ],
            });
            let disabled = true;
            const player = client.dispatcher.players.get(message.guildId);
            if (player && player.queue.current) disabled = false;

            const attachment = new AttachmentBuilder(client.config.links.banner, { name: 'Saavan.png' });

            const pausebut = client.button().setCustomId('pause_but').setEmoji(dispatcher && !dispatcher.paused ? "1053771643312414770" : "1053771645631856680").setStyle(client.config.button.grey).setDisabled(disabled);
            const skipbut = client.button().setCustomId('skipbut_but').setEmoji('1053771641110405163').setStyle(client.config.button.grey).setDisabled(disabled);
            const shuffle = client.button().setCustomId('shuffle_but').setEmoji('1053771639004860456').setStyle(client.config.button.grey).setDisabled(disabled);
            const Loop = client.button().setCustomId('loopmodesbut_but').setEmoji('1053771636547010580').setStyle(client.config.button.grey).setDisabled(disabled);
            const stopbut = client.button().setCustomId('stop_but').setEmoji('1053880333793247352').setStyle(client.config.button.grey).setDisabled(disabled);
            const row = client.row().addComponents([pausebut, skipbut, stopbut, Loop, shuffle]);

            const embed = client.embed()
                .setColor(color)
                .setTitle(player && player.queue && player.queue.current ? `[ ${client.util.duration(player.queue.current.length)} ] - ${player.queue.current.author} - ${player.queue.current.title}` : 'No song playing currently')
                .setDescription(player && player.queue && player.queue.current ? null : `[Invite](${client.config.links.invite}) | [Dashboard](${client.config.links.invite}) | [Commands](${client.config.links.invite}) | [Support](${client.config.links.support})`)
                .setFooter({ text: player && player.queue && player.queue.current ? `${dispatcher.queue.length} songs in queue  |  Volume: ${dispatcher.volume * 100}%${dispatcher.loop !== 'none' ? `  |  Loop: ${dispatcher.loop === "track" ? "Track" : "Queue"}` : ""}${dispatcher.paused ? "  |  Song Paused" : ""}` : `Prefix for this server is: ${prefix}` })
                .setImage(client.config.links.bg);
            await textChannel.send({ files: [attachment] })
            const msg = await textChannel.send({
                content: dispatcher && dispatcher.queue?.length
                    ? `**__Queue List:__**\n\n${client.util.trimArray(dispatcher.queue.map((track, i) => `${++i}. ${track.title.length > 64 ? track.title.substring(0, 64) + "..." : track.title} [ ${client.util.duration(track.length)} ] `))}`
                    : "Join a voice channel and queue songs by name or url in here.",
                embeds: [embed],
                components: [row]
            })

            if (dispatcher && dispatcher.queue.current) {
                await client.util.update(dispatcher, client)
            }

            data = new db({
                _id: message.guildId,
                channel: textChannel.id,
                setuped: true,
                message: msg.id,
                moderator: message.author.id,
                lastUpdated: Math.round(Date.now() / 1000),
            });
            await data.save();

            return await message.reply({ embeds: [client.embed().setColor(color).setDescription(`**Song request channel has been created!**\n\nChannel: ${textChannel}\n*You can rename and move this channel if you want to*.\n\n*Warning: Deleting the template embed in the setup channel may cause this system to stop working.*`)] });
        }
    }
})