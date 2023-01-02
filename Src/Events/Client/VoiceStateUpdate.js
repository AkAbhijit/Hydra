module.exports = new Object({
    name: "voiceStateUpdate",
    /**
     * @param {import("../../Saavan")} client 
     * @param {import("discord.js").VoiceState} oldState 
     * @param {import("discord.js").VoiceState} newState 
     * @returns {Promise<void>}
     */
    async execute(client, oldState, newState) {
        const dispatcher = client.dispatcher.players.get(oldState.guild.id);
        if (newState.id === client.user.id &&newState.serverMute == true && oldState.serverMute == false) {
            dispatcher.pause(true)
            await client.util.update(dispatcher, client)
        }
        if (newState.id === client.user.id && newState.serverMute == false && oldState.serverMute == true) {
            dispatcher.pause(false)
            await client.util.update(dispatcher, client)
        }
    }
})