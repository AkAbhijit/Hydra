const { EmbedBuilder } = require("discord.js");
const prefixSchema = require("../Models/Prefix");
const setupSchema = require('../Models/Setup');

module.exports = class Utils {
    constructor(client) {
        this.client = client;
    }
    /**
     * @param {String} id 
     * @param {import("./Index")} client
     * @returns {String}
     */

    async getPrefix(id, client) {
        let prefix = client.prefix;
        let data = await prefixSchema.findOne({ _id: id });
        if (data && data.prefix) prefix = data.prefix;
        return prefix;
    };

    /**
     * @param {TextChannel} channel 
     * @param {String} args 
     * @param {String} color
     */

    async oops(channel, args, color) {
        try {
            let embed = new EmbedBuilder().setColor(color ? color : "BLURPLE").setDescription(`${args}`);
            const m = await channel.send({ embeds: [embed] });
            setTimeout(async () => await m.delete().catch(() => { }), 3000);
        } catch (e) {
            return console.error(e)
        }
    };

    /**
     * @param {String} id
     * @param {String} commandName 
     * @param {import('discord.js').Message} message 
     * @param {String} args
     * @param {import("../Saavan")} client 
     */

    async invalidArgs(commandName, message, args, client) {
        try {
            let color = client.color ? client.color : "BLURPLE";
            let prefix = client.prefix;
            let data = await prefixSchema.findOne({ _id: message.guildId });
            if (data && data.prefix) prefix = data.prefix;
            let command = client.Commands.get(commandName) || client.Commands.get(client.Aliases.get(commandName));
            if (!command) return await message.reply({ embeds: [new EmbedBuilder().setColor(color).setDescription(args)] }).catch(() => { });
            let embed = new EmbedBuilder()
                .setColor(color)
                .setAuthor({ name: message.author.tag.toString(), iconURL: message.author.displayAvatarURL({ dynamic: true }).toString(), url: client.config.links.support })
                .setDescription(`**${args}**`)
                .setTitle(`**${command.name}**`)
                .addFields([
                    {
                        name: "Usage",
                        value: `\`${command.usage ? `${prefix}${command.name} ${command.usage}` : `${prefix}${command.name}`}\``,
                        inline: false
                    },
                    {
                        name: "Example(s)",
                        value: `${command.examples ? `\`${prefix}${command.examples.join(`\`\n\`${prefix}`)}\`` : "`" + prefix + command.name + "`"}`
                    }
                ]);
            return await message.reply({
                embeds: [embed],
            });
        } catch (e) {
            console.error(e);
        };
    };
    /**
     * 
     * @param {Message} msg 
     * @param {String} args 
     * @param {String} color 
     * @returns {Promise<Message | void>}
     */

    async replyOops(msg, args, color) {
        const config = require("../Config")
        if (!msg) return;
        if (!args) return;
        if (!color) color = config.EmbedColor;
        let embed = new EmbedBuilder().setColor(color).setDescription(`${args}`);
        let m = await msg.reply({ embeds: [embed] });
        setTimeout(async () => {
            if (m && m.deletable) await m.delete().catch(() => { });
        }, 7000);
    };

    /**
     * 
     * @param {import("discord.js").CommandInteraction | import("discord.js").ButtonInteraction | import("discord.js").SelectMenuInteraction} interaction 
     * @param {String} args 
     * @param {String} color
     */

    async intReply(interaction, args, color) {
        const config = require("../Config")
        if (typeof color !== "string") color = config.EmbedColor;
        if (!interaction) return;
        if (interaction.replied) {
            return await interaction.editReply({
                embeds: [new EmbedBuilder().setColor(color).setDescription(`${args}`)]
            }).catch(() => { });
        } else {
            return await interaction.followUp({
                ephemeral: true,
                embeds: [new EmbedBuilder().setColor(color).setDescription(`${args}`)]
            }).catch(() => { });
        };
    };

    /**
     * @param {import("discord.js").CommandInteraction | import("discord.js").ButtonInteraction | import("discord.js").SelectMenuInteraction} interaction 
     * @param {String} args 
     * @param {String} color
     */

    async intOops(interaction, args, color) {
        const config = require("../Config")
        if (typeof color !== "string") color = config.EmbedColor;
        if (!interaction) return;
        if (interaction.replied) {
            return await interaction.editReply({
                embeds: [new EmbedBuilder().setColor(color).setDescription(`${args}`)]
            }).then((msg) => { setTimeout(() => { msg.delete(); }, 10000) }).catch(() => { });
        } else {
            return await interaction.followUp({
                ephemeral: true,
                embeds: [new EmbedBuilder().setColor(color).setDescription(`${args}`)]
            }).then((msg) => { setTimeout(() => { msg.delete(); }, 10000) }).catch(() => { });
        };
    };

    duration(milliseconds) {
        const
            hours = milliseconds / (1000 * 60 * 60),
            absoluteHours = Math.floor(hours),
            h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours,
            minutes = (hours - absoluteHours) * 60,
            absoluteMinutes = Math.floor(minutes),
            m = absoluteMinutes > 9 ? absoluteMinutes : '0' + absoluteMinutes,
            seconds = (minutes - absoluteMinutes) * 60,
            absoluteSeconds = Math.floor(seconds),
            s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;
        return (h == 0 && m == 0) ? ('00:' + s) : (h == 0) ? (m + ':' + s) : (h + ':' + m + ':' + s);
    }
    /**
     * @param {*} arr 
     * @param {*} size 
     * @returns 
     */
    chunk(arr, size) {
        const temp = [];
        for (let i = 0; i < arr.length; i += size) {
            temp.push(arr.slice(i, i + size));
        }
        return temp;
    }

    //create function ms to hms
    msToTime(duration) {
        let milliseconds = parseInt((duration % 1000) / 100),
            seconds = Math.floor((duration / 1000) % 60),
            minutes = Math.floor((duration / (1000 * 60)) % 60),
            hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? hours : hours;
        minutes = (minutes < 10) ? minutes : minutes;
        seconds = (seconds < 10) ? seconds : seconds;
        milliseconds = (milliseconds < 10) ? milliseconds : milliseconds;

        if (duration >= 3600000) {
            return hours + "h " + minutes + "m " + seconds + "s";
        } else if (duration >= 60000) {
            return minutes + "m " + seconds + "s";
        } else if (duration >= 1000) {
            return seconds + "s";
        } else {
            return milliseconds + "ms";
        }
    }

    /**
     * 
     * @param {TextChannel} channel 
     * @param {String} args 
     * @param {String} color 
     * @returns {Promise<void | Message}
     */

    async good(channel, args, color) {
        color = color ? color : "BLURPLE";
        return await channel.send({
            embeds: [new EmbedBuilder().setColor(color).setDescription(`${args}`)]
        }).catch(() => { });
    };

    trimArray(array, maxLen = 5) {
        if (array.length > maxLen) {
            array = array.slice(0, maxLen);
        }
        return array.reverse().join("\n");
    }

    /**
     * @param {import("kazagumo").KazagumoPlayer} dispatcher
     * @param {import("../Saavan")} client
     */
    async update(dispatcher, client) {
        const guildData = await setupSchema.findOne({ _id: dispatcher.guildId });
        if (guildData && guildData.channel && guildData.message) {
            const guild = client.guilds.cache.get(guildData._id);
            const channel = guild.channels.cache.get(guildData.channel);
            if (channel) {
                channel.messages.fetch(guildData.message, { cache: true }).then(async (message) => {
                    if (message) {
                        try {
                            const icon = client.config.links.bg;
                            const embed = client.embed()
                                .setTitle(`[ ${client.util.duration(dispatcher.queue.current?.length)} ] - ${dispatcher.queue.current?.author} - ${dispatcher.queue.current?.title}`)
                                .setColor(client.color)
                                .setImage(icon)
                                .setFooter({ text: `${dispatcher.queue.length} songs in queue  |  Volume: ${dispatcher.volume * 100}%${dispatcher.loop !== 'none' ? `  |  Loop: ${dispatcher.loop === "track" ? "Track" : "Queue"}` : ""}${dispatcher.paused ? "  |  Song Paused" : ""}`, })

                            const pausebut = client.button().setCustomId('pause_but').setEmoji(dispatcher && !dispatcher.paused ? "1053771643312414770" : "1053771645631856680").setStyle(client.config.button.grey).setDisabled(false);
                            const skipbut = client.button().setCustomId('skipbut_but').setEmoji('1053771641110405163').setStyle(client.config.button.grey).setDisabled(false);
                            const shuffle = client.button().setCustomId('shuffle_but').setEmoji('1053771639004860456').setStyle(client.config.button.grey).setDisabled(false);
                            const Loop = client.button().setCustomId('loopmodesbut_but').setEmoji('1053771636547010580').setStyle(client.config.button.grey).setDisabled(false);
                            const stopbut = client.button().setCustomId('stop_but').setEmoji('1053880333793247352').setStyle(client.config.button.grey).setDisabled(false);
                            const row = client.row().addComponents([pausebut, skipbut, stopbut, Loop, shuffle]);

                            await message.edit({
                                content: dispatcher.queue?.length
                                    ? `**__Queue List:__**\n\n${client.util.trimArray(dispatcher.queue.map((track, i) => `${++i}. ${track.title.length > 64 ? track.title.substring(0, 64) + "..." : track.title} [ ${client.util.duration(track.length)} ] `))}`
                                    : "Join a voice channel and queue songs by name or url in here.",
                                embeds: [embed],
                                components: [row]
                            });
                        } catch (error) {
                            console.log(error)
                        }
                    } else {
                        guildData.channel = null;
                        guildData.save();
                    }
                });
            } else {
                guildData.channel = null;
                guildData.message = null;
                guildData.save();
            }
            return true;
        } else {
            return false;
        }
    }
    /**
     *
     * @param {import('discord.js').ButtonInteraction} int
     * @param {String} args
     * @param {String} color
     */

    async buttonReply(int, args, color) {
        const { EmbedColor } = require('../Config');
        if (!color) color = EmbedColor;
        try {
            if (int.replied) {
                await int.editReply({ embeds: [new EmbedBuilder().setColor(color).setDescription(args)] });
            } else {
                await int.followUp({ embeds: [new EmbedBuilder().setColor(color).setDescription(args)] });
            }
        } catch (error) {
            int.reply({ embeds: [new EmbedBuilder().setColor(color).setDescription(args)] });
        }

        setTimeout(async () => { if (int && !int.ephemeral) { await int.deleteReply().catch(() => { }); } }, 3000);
    }

    /**
     * 
     * 
     * @param {import('discord.js').Message} message Message
     * @param {String} args Arguments
     * @param {String} color Color
     * @returns {Promise<Message>}
     * 
     * returns a message
     */

    async msgReply(message, args, color) {
        const { EmbedColor } = require('../Config')
        if (!color) color = EmbedColor;
        return await message.reply({ embeds: [new EmbedBuilder().setColor(color).setDescription(args)] });
    };

    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const sizes = ['B', 'KB', 'MB', 'GB'];
        return `${(bytes / Math.pow(1024, Math.floor(Math.log(bytes) / Math.log(1024)))).toFixed(2)} ${sizes[Math.floor(Math.log(bytes) / Math.log(1024))]}`;
    }

    /**
     *
     * @param {Array} array
     * @param {Number} trackNumber
     * @param {Number} to
     */

    moveArray(array, trackNumber, to) {
        array = [...array];
        const s = trackNumber < 0 ? array.length + trackNumber : trackNumber;
        if (s >= 0 && s < array.length) {
            const e = to < 0 ? array.length + to : to;
            const [i] = array.splice(trackNumber, 1);
            array.splice(e, 0, i);
        }
        return array;
    }

    /**
     * 
     * @param {import('../Saavan')} client 
     * @param {import('kazagumo').KazagumoPlayer} dispatcher 
     * @param {String} type 
     */
    async autoplay(client, dispatcher, type) {
        try {
            const track = dispatcher.data.get('autoplayfunction');
            const client = require('../Saavan');
            const songData = await client.spotify.getTrack(track.uri.split('track/')[1]);
            const rawData = await client.spotify.getRecommendations(songData.artists[0].id, songData.id, 10);
            const { tracks } = await dispatcher.search(rawData.tracks[0].external_urls.spotify, { requester: client.user, engine: 'spotify' });
            dispatcher.queue.add(tracks[0]);
            if (!dispatcher.playing && !dispatcher.paused) dispatcher.play();
            if (type === "skip") {
                dispatcher.skip()
            } else {
                dispatcher.play()
            }
        } catch (error) {
            console.log(error)
        }
    }
}