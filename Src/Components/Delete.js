module.exports = {
    name: 'delete',
    id: 'delete',
    permissions: {
        client: [],
        user: [],
        dev: true,
         
    },
    player: { voice: false, active: false, dj: false,  },
    cooldown: 5,
    /**
     * @param {import("../Saavan")} client
     * @param {import("discord.js").ButtonInteraction} interaction
     */
    execute: async (client, interaction, color, dispatcher) => {
        interaction.message.delete();
    },
};
