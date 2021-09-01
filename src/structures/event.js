const Discord = require('discord.js');
const { DiscordAPIError } = require('discord.js');

// code from: https://youtu.be/uE5gEKd2se4

/**
 * @template {keyof Discord.ClientEvents} K
 * @param {Mango} bot
 * @param {Discord.ClientEvents[K]} args
 */
function runFunction(bot, ...args) {}

/**
 * @template {keyof Discord.ClientEvents} K
 */
class Event {
    /**
     *
     * @param {string} event
     * @param {runFunction<K>} runFunction
     */
    constructor(event, runFunction) {
        this.event = event;
        this.run = runFunction;
    }
}

module.exports = Event;