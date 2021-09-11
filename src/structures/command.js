const Discord = require('discord.js');

// code from: https://youtu.be/yIbmmBGOAO4

/**
 *
 * @param {Discord.Message | Discord.Interaction} ctx
 * @param {string[] | null} args
 * @param {Mango} bot
 * @constructor
 */
function RunFunction(bot, ctx, args) {}

class Command {
    /**
     * @typedef {{ name: string,
     * description: string,
     * options: Object[],
     * permission: Discord.PermissionString,
     * aliases: String[],
     * minArgs: Number,
     * maxArgs: Number,
     * noDM: boolean,
     * noSlash: boolean,
     * private: boolean,
     * checks: boolean,
     * admins: boolean,
     * run: RunFunction }} CommandOptions
     * @param {CommandOptions} options
     * @constructor
     */
    constructor(options) {
        this.name = options.name;
        this.description = options.description;
        this.options = options.options;
        this.permission = options.permission;
        this.aliases = options.aliases;

        this.minArgs = options.minArgs;
        this.maxArgs = options.maxArgs;

        this.noDM = options.noDM;
        this.noSlash = options.noSlash;
        this.private = options.private;
        this.checks = options.checks;
        this.admins = options.admins;
        this.run = options.run;
        this.slashData = (!this.name || !this.description || this.noSlash) ? null : {
            name: this.name, description: this.description, options: this.options
        };
    }
}

module.exports = Command;