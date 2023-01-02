const { WebhookClient } = require('discord.js');

module.exports = new Object({
    name: 'guildCreate',
    /**
     * @param {import("../../Saavan")} client
     * @param {import("discord.js").Guild} guild
     */
    async execute(client, guild) {
        const hook = new WebhookClient({ url: client.config.hooks.guildAdd });
        if (!hook) return;
        const embed = client.embed()
            .setColor(client.color)
            .setAuthor({ name: `${client.user.username} has been added to a guild.`, iconURL: guild.iconURL({ dynamic: true }), url: client.config.links.support })
            .setTitle(`${guild.name}`)
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .addFields([
                {
                    name: 'Created On',
                    value: `<t:${Math.round(guild.createdTimestamp / 1000)}>`,
                    inline: false,
                },
                {
                    name: 'Added On',
                    value: `<t:${Math.round(Date.now() / 1000)}>`,
                    inline: false,
                },
                {
                    name: 'Guild Id',
                    value: `\`${guild.id}\``,
                    inline: false,
                },
                {
                    name: 'Owner',
                    value: `<@${guild.ownerId}> (\`id: ${guild.ownerId}\`)`,
                    inline: false,
                },
                {
                    name: 'Total Members Count',
                    value: `\`[ ${guild.memberCount} ]\``,
                    inline: false,
                },
            ]);
        await hook.send({ embeds: [embed] }).catch(() => { });
    },
});
