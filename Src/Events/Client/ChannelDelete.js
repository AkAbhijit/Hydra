const db = require('../../Models/Setup')
module.exports = new Object({
    name: "channelDelete",
    /**
     * @param {import("discord.js").TextChannel} channel
     */
    async execute(_, channel) {
        const data = await db.findOne({ _id: channel.guild.id })
        if (data && channel.id === data.channel) await data.delete()
    }
})