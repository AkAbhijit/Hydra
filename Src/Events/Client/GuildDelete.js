const { WebhookClient } = require('discord.js');

module.exports = new Object({
    name: 'guildDelete',
    /**
     * @param {import("../../Saavan")} client
     * @param {import("discord.js").Guild} guild
     */
    async execute(client, guild) {
        const hook = new WebhookClient({ url: client.config.hooks.guildRemove });
        const embed = client.embed()
            .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }))
            .setTitle(`📤 Left a Guild !!`)
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
            ])
            .setColor(client.color)
        if (hook) await hook.send({ embeds: [embed] })
        else return;
    },
});
