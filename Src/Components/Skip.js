module.exports = {
    name: 'skip',
    id: 'skipbut_but',
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
        const { title, uri } = dispatcher.queue.current;
        if (dispatcher.data.get('autoplay')) {
            if (dispatcher.paused) dispatcher.pause(false)
            await client.util.autoplay(client, dispatcher, "skip")
            await client.util.update(dispatcher, client);
            return await client.util.buttonReply(interaction, `${interaction.member} has skipped [${title}](${uri})`, color);
        } else if (dispatcher.queue.size === 0) return await client.util.buttonReply(interaction, 'No more songs left in the queue to skip.', color);
        if (dispatcher.paused) dispatcher.pause(false)
        dispatcher.skip();
        await client.util.update(dispatcher, client);
        return await client.util.buttonReply(interaction, `${client.emoji.tick} ${interaction.member} has skipped [${title}](${uri})`, color);
    },
};
