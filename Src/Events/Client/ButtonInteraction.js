const { PermissionsBitField, Collection } = require('discord.js');
const DjSchema = require('../../Models/Dj');

module.exports = new Object({
    name: "ButtonInteraction",
    /**
     * @param {import("../../Saavan")} client 
     * @param {import("discord.js").ButtonInteraction} interaction
     */
    async execute(client, interaction) {
        const button = client.ButtonInt.get(interaction.customId);
        if (!button) return;
        const color = client.color;    
        if (button.permissions) {
            if (button.permissions.client) {
                if (!interaction.guild.members.cache.get(client.user.id).permissionsIn(interaction.channel).has(PermissionsBitField.resolve(button.permissions.client) || []))
                    return await interaction.reply({ content: `${client.emoji.cross} I don't have \`${button.permissions.client}\` permission to execute this button.`, ephemeral: true });
            }
            if (button.permissions.user) {
                if (!interaction.guild.members.cache.get(interaction.member.user.id).permissionsIn(interaction.channel).has(PermissionsBitField.resolve(button.permissions.user) || []))
                    return await interaction.reply({ content: `${client.emoji.cross} You don't have \`${button.permissions.user}\` permission to use this button.`, ephemeral: true });
            }
            if (button.permissions.dev) {
                if (client.owners) {
                    const findDev = client.owners.find((x) => x === interaction.member.user.id);
                    if (!findDev) return interaction.reply({ content: `${client.emoji.cross} Sorry! This is a owner based command you cant use it.`, ephemeral: true });
                };
            };
        }
        const dispatcher = client.dispatcher.players.get(interaction.guildId);

        if (button.player) {
            if (button.player.voice) {
                if (!interaction.member.voice.channel) return await interaction.reply({ content: `${client.emoji.cross} You must be connected to a voice channel to use this \`${button.name}\` button.`, ephemeral: true });
                if (!interaction.guild.members.cache.get(client.user.id).permissionsIn(interaction.channel).has(PermissionsBitField.Flags.Connect))
                    return await interaction.reply({ content: `${client.emoji.cross} I don't have \`CONNECT\` permissions to execute this \`${button.name}\` button.`, ephemeral: true, });
                if (!interaction.guild.members.cache.get(client.user.id).permissionsIn(interaction.channel).has(PermissionsBitField.Flags.Speak))
                    return await interaction.reply({ content: `${client.emoji.cross} I don't have \`SPEAK\` permissions to execute this \`${button.name}\` button.`, ephemeral: true });
                if (interaction.guild.members.cache.get(client.user.id).voice.channel) {
                    if (interaction.guild.members.cache.get(client.user.id).voice.channel !== interaction.member.voice.channel)
                        return await interaction.reply({
                            content: `${client.emoji.cross} You are not connected to ${interaction.guild.members.cache.get(client.user.id).voice.channel} to use this \`${button.name}\` button.`,
                            ephemeral: true,
                        });
                }
            }
            if (button.player.active) {
                const playerInstance = client.dispatcher.players.get(interaction.guildId);
                if (!playerInstance || !playerInstance.queue || !playerInstance.queue.current)
                    return await interaction.reply({
                        content: `${client.emoji.cross} Currently, No music is playing on this server.`,
                        ephemeral: true,
                    });
            }
            if (button.player.dj) {
                const data = await DjSchema.findOne({ _id: interaction.guildId });
                let perm = PermissionsBitField.Flags.MuteMembers || PermissionsBitField.Flags.ManageGuild || PermissionsBitField.Flags.Administrator;
                if (data && data.mode) {
                    let pass = false;
                    if (data.roles.length > 0) {
                        interaction.member.roles.cache.forEach(x => {
                            const role = data.roles.find(r => r === x.id);
                            if (role) pass = true;
                        });
                    }
                    if (!pass) return await interaction.reply({ content: `${client.emoji.cross} You don't have \`${perm}\` or the DJ role to use this command.`, ephemeral: true });
                }
            }
        }
        try { await button.execute(client, interaction, color, dispatcher); } catch (error) { console.error(error); }
    }
})