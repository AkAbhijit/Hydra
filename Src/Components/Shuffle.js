module.exports = {
    name: 'Shuffle',
    id: 'shuffle_but',
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
        if (dispatcher.queue.size < 3) return await client.util.buttonReply(interaction, `${client.emoji.cross} Not enough songs in the queue to shuffle.`, color);
        if (dispatcher.shuffle) {
            dispatcher.setUnshuffle();
            client.util.update(dispatcher, client);
            return await client.util.buttonReply(interaction, `${client.emoji.tick} Unshuffled the queue.`, color);
        } else {
            dispatcher.setShuffle();
            client.util.update(dispatcher, client);
            return await client.util.buttonReply(interaction, `${client.emoji.tick} Shuffled the queue.`, color);
        }
    },
};
