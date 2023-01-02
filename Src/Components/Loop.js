module.exports = {
    name: 'loop',
    id: 'loopmodesbut_but',
    permissions: {
        client: [],
        user: [],
        dev: false,
         
    },
    player: { voice: true, active: true, dj: true,  },
    cooldown: 5,
    /**
      * @param {import("../Saavan")} client
      * @param {import("discord.js").CommandInteraction} interaction
      * @param {import('kazagumo').KazagumoPlayer} dispatcher
      */
    execute: async (client, interaction, color, dispatcher) => {
        if (dispatcher.loop == 'none') {
            dispatcher.setLoop('track');
            await client.util.update(dispatcher, client);
            return await client.util.buttonReply(interaction, `${client.emoji.tick} ${interaction.member} has enabled **track** loop`, color);
        } else if (dispatcher.loop == 'track') {
            dispatcher.setLoop('queue');
            await client.util.update(dispatcher, client);
            return await client.util.buttonReply(interaction, `${client.emoji.tick} ${interaction.member} has enabled **queue** loop`, color);
        } else {
            dispatcher.setLoop('none');
            await client.util.update(dispatcher, client);
            return await client.util.buttonReply(interaction, `${client.emoji.tick} ${interaction.member} has **disabled** looping`, color);
        }
    },
};
