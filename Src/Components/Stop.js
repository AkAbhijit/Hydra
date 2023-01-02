module.exports = {
    name: 'stop',
    id: 'stop_but',
    permissions: {
        client: [],
        user: [],
        dev: false,
         
    },
    player: { voice: true, active: true, dj: true, },
    cooldown: 5,
    /**
     * @param {import("../Saavan")} client
     * @param {import("discord.js").CommandInteraction} interaction
     * @param {import('kazagumo').KazagumoPlayer} dispatcher
     */
     execute: async (client, interaction, color, dispatcher) => {
        const autoplay = dispatcher.data.get('autoplay');
        if (autoplay) dispatcher.data.set('autoplay', false);
        if (dispatcher.paused) dispatcher.pause(false)
        dispatcher.queue.clear();
        dispatcher.destroy();
        return await client.util.buttonReply(interaction, `${client.emoji.tick} Player has been stopped/destroyed.`, color);
    },
};
