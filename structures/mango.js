const Discord = require('discord.js');
const { Intents } = require('discord.js');

const fs = require('fs');

class Mango extends Discord.Client {
    constructor(options) {
        console.log('=========================================================');
        console.log(`Now Starting Bot\t|\tOS: ${process.platform}`);

        const intents = [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MEMBERS,
            Intents.FLAGS.GUILD_BANS,
            Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
            // Intents.FLAGS.GUILD_INTEGRATIONS,
            // Intents.FLAGS.GUILD_WEBHOOKS,
            // Intents.FLAGS.GUILD_INVITES,
            Intents.FLAGS.GUILD_VOICE_STATES,
            Intents.FLAGS.GUILD_PRESENCES,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
            // Intents.FLAGS.GUILD_MESSAGE_TYPING,
            Intents.FLAGS.DIRECT_MESSAGES,
            Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
            // Intents.FLAGS.DIRECT_MESSAGE_TYPING,
        ]

        const config = require('../data/config.json');

        super({ intents });
        this.defaultPrefix = config.prefix;

        /**
         * @type {Collection<string, Command>}
         */
        this.commands = new Discord.Collection();
        console.log('*********************************************************');
        this.loadCommands('./commands');

        console.log('*********************************************************');
        this.loadEvents('./events');

        this.login(config.token);
    }

    loadCommands(dir) {
        fs.readdirSync(dir).forEach(file => {
            const dirPath = `${dir}/${file}`;
            if (fs.statSync(dirPath).isDirectory()) {
                this.loadCommands(dirPath);
            } else {
                if (!file.startsWith('!') && file.endsWith('.js')) {
                    /**
                     * @type{Command}
                     */
                    const command = require(`.${dirPath}`);
                    console.log(`Loaded Command: ${command.name}`);
                    this.commands.set(command.name, command);
                }
            }
        });
    }

    loadEvents(dir) {
        fs.readdirSync(dir).forEach(file => {
            const dirPath = `${dir}/${file}`;
            if (fs.statSync(dirPath).isDirectory()) {
                this.loadEvents(dirPath);
            } else {
                if (!file.startsWith('!') && file.endsWith('.js')) {
                    /**
                     * @type{Event}
                     */
                    const event = require(`.${dirPath}`);
                    console.log(`Loaded Event: ${event.event} | ${dirPath}`);
                    this.on(event.event, event.run.bind(null, this));
                }
            }
        });
    }

    /**
     *
     * @param {String | Number | Discord.Guild} guild
     * @param {String | Number} target
     * @return {void | Discord.GuildMember}
     */
    getMember(guild, target) {
        if (!guild instanceof Discord.Guild) {
            guild = this.guilds.cache.find(i => i.id === guild);
            if (!guild) return;
        }

        return isNaN(target) ? guild.members.cache.find(i => i.user.username === target) :
            guild.members.resolve(`${target}`);
    }

    /**
     *
     * @param {String | Number} target
     * @return {Discord.User | void}
     */
    getUser(target) {
        return this.users.cache.find(i => {
            if (isNaN(target)) {
                return i.username === target;
            }
            return i.id === target;
        });
    }
}

module.exports = Mango;