const Discord = require('discord.js');

// code from: https://youtu.be/yIbmmBGOAO4

/**
 *
 * @param {Discord.Message | Discord.Interaction} msg
 * @param {string[]} args
 * @param {Mango} bot
 * @constructor
 */
function RunFunction(msg, args, bot) {}

class Command {
    /**
     * @typedef {{name: string, description: string, run: RunFunction, minArgs: Number, maxArgs: Number,
     * permission: Discord.PermissionString}} CommandOptions
     * @param {CommandOptions} options
     * @constructor
     */
    constructor(options) {
        this.name = options.name;
        this.description = options.description;
        this.permission = options.permission;
        this.minArgs = options.minArgs;
        this.maxArgs = options.maxArgs;
        this.run = options.run;
    }
}

module.exports = Command;