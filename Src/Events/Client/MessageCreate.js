const { ChannelType, PermissionsBitField, Collection, WebhookClient } = require("discord.js");
const db = require('../../Models/Setup');
const DjSchema = require('../../Models/Dj');

module.exports = new Object({
    name: "messageCreate",
    /**
     * @param {import("../../Saavan")} client
     * @param {import("discord.js").Message} message
     */
    async execute(client, message) {
        if (message.author.bot || message.webhookId || !message.guild || !message.channel) return;
        if (message.channel.type == ChannelType.DM || message.channel.type == ChannelType.GuildForum) return;
        if (message.partial) await message.fetch();

        const data = await db.findOne({ _id: message.guildId });
        if (data && data.channel && message.channelId === data.channel) return client.emit('requestChannel', message);
        const prefix = await client.util.getPrefix(message.guildId, client);
        const color = client.color;
        const mention = new RegExp(`^<@!?${client.user.id}>( |)$`);
        if (message.content.match(mention)) {
            if (message.guild.members.cache.get(client.user.id).permissionsIn(message.channel).has(PermissionsBitField.Flags.SendMessages)) {
                return await message.reply({
                    embeds: [
                        client.embed()
                            .setTitle('Settings for this server')
                            .setDescription(`The prefix is set to: \`${prefix}\`\nServer ID:  \`${message.guildId}\`\n\nJoin a voice channel and \`${prefix}\`play a song.\nType \`${prefix}\`help for the list of commands.`)
                            .setFooter({ text: 'Developed by AkAbhijit#2923' })
                            .setColor(color)
                    ]
                }).catch(() => { });
            };
        };
        const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
        if (!prefixRegex.test(message.content)) return;
        const [matchedPrefix] = message.content.match(prefixRegex);
        const args = message.content.slice(matchedPrefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = client.Commands.get(commandName) || client.Commands.get(client.Aliases.get(commandName));
        if (!command) return;
        //Auto Permission Return
        if (!message.guild.members.cache.get(client.user.id).permissionsIn(message.channel).has(PermissionsBitField.Flags.SendMessages)) return await message.author.send({ content: `${client.emoji.cross} I don't have **\`SEND_MESSAGES\`** permission in <#${message.channelId}> to execute this **\`${command.name}\`** command.` }).catch(() => { });
        if (!message.guild.members.cache.get(client.user.id).permissionsIn(message.channel).has(PermissionsBitField.Flags.ViewChannel)) return;
        if (!message.guild.members.cache.get(client.user.id).permissionsIn(message.channel).has(PermissionsBitField.Flags.EmbedLinks)) return await message.reply({ content: `${client.emoji.cross} I don't have **\`EMBED_LINKS\`** permission to execute this **\`${command.name}\`** command.` }).catch(() => { });
        // Permission for handler
        if (command.permissions) {
            if (command.permissions.client) {
                if (!message.guild.members.cache.get(client.user.id).permissionsIn(message.channel).has(PermissionsBitField.resolve(command.permissions.client) || [])) return await client.util.replyOops(message, `${client.emoji.cross} I don't have \`${(command.permissions.client).join(", ")}\` permission(s) to execute this command.`, color);
            };
            if (command.permissions.user) {
                if (!message.guild.members.cache.get(message.author.id).permissionsIn(message.channel).has(PermissionsBitField.resolve(command.permissions.user) || [])) return await client.util.replyOops(message, `${client.emoji.cross} You don't have \`${(command.permissions.user).join(", ")}\` permissions to use this command.`, color);
            }
            if (command.permissions.dev) {
                if (client.owners) {
                    const findDev = client.owners.find((x) => x === message.author.id);
                    if (!findDev) return message.reply({ content: `${client.emoji.cross} Sorry! This is a owner based command you cant use it.` });
                };
            };
        };
        const dispatcher = client.dispatcher.players.get(message.guildId);

        if (command.player) {
            if (command.player.voice) {
                if (!message.member.voice.channel) return await client.util.replyOops(message, `${client.emoji.cross} You must be connected to a voice channel to use this \`${command.name}\` command.`, color);
                if (!message.guild.members.cache.get(client.user.id).permissionsIn(message.channel).has(PermissionsBitField.Flags.Connect)) return await client.util.replyOops(message, `${client.emoji.cross} I don't have \`CONNECT\` permissions to execute this \`${command.name}\` command.`, color);
                if (!message.guild.members.cache.get(client.user.id).permissionsIn(message.channel).has(PermissionsBitField.Flags.Speak)) return await client.util.replyOops(message, `${client.emoji.cross} I don't have \`SPEAK\` permissions to execute this \`${command.name}\` command.`, color);
                if (message.member.voice.channel.type == ChannelType.GuildStageVoice && !message.guild.members.cache.get(client.user.id).permissionsIn(message.channel).has(PermissionsBitField.Flags.RequestToSpeak)) return await client.util.replyOops(message, `${client.emoji.cross} I don't have \`REQUEST TO SPEAK\` permission to execute this \`${command.name}\` command.`, color);
                if (message.guild.members.cache.get(client.user.id).voice.channel) {
                    if (message.guild.members.cache.get(client.user.id).voice.channel !== message.member.voice.channel) return await client.util.replyOops(message, `${client.emoji.cross} You are not connected to ${message.guild.members.cache.get(client.user.id).voice.channel} to use this \`${command.name}\` command.`, color);
                };
            }
            if (command.player.active) {
                const playerInstance = client.dispatcher.players.get(message.guildId)
                if (!playerInstance || !playerInstance.queue || !playerInstance.queue.current) return client.util.replyOops(message, `${client.emoji.cross} Currently, No music is playing on this server.`, color)
            }
            if (command.player.dj) {
                let data = await DjSchema.findOne({ _id: message.guildId });
                let perm = PermissionsBitField.Flags.MuteMembers || PermissionsBitField.Flags.ManageGuild || PermissionsBitField.Flags.Administrator;
                if (data && data.mode) {
                    let pass = false;
                    if (data.roles.length > 0) {
                        message.member.roles.cache.forEach((x) => {
                            let role = data.roles.find((r) => r === x.id);
                            if (role) pass = true;
                        });
                    };
                    if (!pass) return await client.util.replyOops(message, `${client.emoji.cross} You don't have ${perm} or the dj role to use this command.`, color);
                };
            };
        }

        if (command.args) {
            if (!args.length) return await client.util.invalidArgs(command.name, message, `Please furnish the demanded arguments.`, client);
        };
        if (!client.Cooldown.has(command.name)) {
            client.Cooldown.set(command.name, new Collection());
        };
        const cooldown = client.Cooldown.get(command.name);
        let cooldownAmount = command.cooldown && command.cooldown > 0 ? (command.cooldown) * 1000 : 3000;
        if (cooldown.has(message.author.id) && !client.owners.includes(message.member.id)) {
            let expiretime = cooldown.get(message.author.id);
            let timeleft = cooldownAmount - (Date.now() - expiretime);

            if (timeleft > 0) return await client.util.replyOops(message, `${client.emoji.cross} Please wait for \`[ ${client.util.msToTime(timeleft)} ]\` before reusing the \`${command.name}\` command!`, color);
        } else { cooldown.set(message.author.id, Date.now()); };

        setTimeout(() => { if (cooldown.has(message.author.id)) return cooldown.delete(message.author.id); }, cooldownAmount);
        try {
            await command.execute(client, message, args, prefix, color, dispatcher);
        } catch (error) {
            await message.reply({ content: `${client.emoji.cross} An unexpected error occured, the developers have been notified!` }).catch(() => { });
            console.error(error);
        };
    },
});