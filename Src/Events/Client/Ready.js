const db = require('../../Models/247');
module.exports = new Object({
    name: "ready",
    /**
     * @param {import("../../Saavan")} client 
     */
    async execute(client) {
        client.console.log(`Logged in as ${client.user.tag}`, "api");
        await client.guilds.fetch({ cache: true });
        const maindata = await db.find();
        client.console.log(`Auto Reconnect found ${maindata.length ? `${maindata.length} queue${maindata.length > 1 ? 's' : ''}. Resuming all auto reconnect queue` : '0 queue'}`, 'player');
        for (const data of maindata) {
            const index = maindata.indexOf(data);
            setTimeout(async () => {
                const text = client.channels.cache.get(data.textChannel);
                const guild = client.guilds.cache.get(data._id);
                const voice = client.channels.cache.get(data.voiceChannel);
                if (!guild || !text || !voice) return data.delete();
                const player = client.dispatcher.createPlayer({
                    guildId: guild.id,
                    textId: text.id,
                    voiceId: voice.id,
                    deaf: true,
                    shardId: guild.shardId,
                });
            },
            ), index * 5000;
        }
    }
})