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

        const config = require('../../data/config.json');

        super({ intents });
        this.defaultPrefix = config.prefix;

        /**
         * @type {Collection<string, Command>}
         */
        this.commands = new Discord.Collection();
        this.commandAliases = new Discord.Collection();
        console.log('*********************************************************');
        this.loader('./src/commands', 'commands');

        console.log('*********************************************************');
        this.loader('./src/events', 'events');

        this.login(config.token);
    }

    loadCommand(dirPath) {
        /**
         * @type{Command}
         */
        const command = require(`.${dirPath.replace('/src', '')}`);
        if (Array(this.commands.keys()).includes(command.name)) {
            throw new Error(`${command.name}: Failed to load as command of similar name already exist`);
        }
        this.commands.set(command.name, command);
        command.aliases.forEach(i => {
            if(Array(this.commandAliases.keys()).includes(i)) {
                throw new Error(`${command.name}: Failed to load due to the alias ${i} 
                is already assigned to ${this.commandAliases[i]} command`);
            }
            this.commandAliases.set(i, command.name);
        });
        console.log(`Loaded Command: ${command.name} | ${dirPath}`);
    }

    loadEvent(dirPath) {
        /**
         * @type{Event}
         */
        const event = require(`.${dirPath.replace('/src', '')}`);
        console.log(`Loaded Event: ${event.event} | ${dirPath}`);
        this.on(event.event, event.run.bind(null, this));
    }

    loader(dir, type) {
        const directories = [dir];

        type = type.toLowerCase();

        while(directories.length > 0) {
            const temp = directories.shift();
            fs.readdirSync(temp).forEach(file => {
                const dirPath = `${temp}/${file}`;
                if (fs.statSync(dirPath).isDirectory()) {
                    directories.push(dirPath);
                } else {
                    if (!file.startsWith('!') && file.endsWith('.js')) {
                        if (['commands', 'command'].includes(type)) {
                            this.loadCommand(dirPath);
                        } else if (['event', 'events'].includes(type)) {
                            this.loadEvent(dirPath);
                        } else {
                            throw new Error(`${type} is not supported`);
                        }
                    }
                }
            });
        }

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