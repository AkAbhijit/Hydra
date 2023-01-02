module.exports = {
    name: 'pause',
    id: 'pause_but',
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
        if (dispatcher.paused) {
            dispatcher.pause(false);
            await client.util.update(dispatcher, client);
            return await client.util.buttonReply(interaction, `${client.emoji.tick} ${interaction.member} has resumed the music.`, color);
        } else {
            dispatcher.pause(true);
            await client.util.update(dispatcher, client);
            return await client.util.buttonReply(interaction, `${client.emoji.tick} ${interaction.member} has paused the music.`, color);
        }
    },
};
