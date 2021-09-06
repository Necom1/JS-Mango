const Command = require('../../structures/command.js');
const {Message} = require("discord.js");

module.exports = new Command({
    name: 'utc',
    description: 'the current UTC / GMT time',
    aliases: ['gmt'],
    permission: 'SEND_MESSAGES',

    async run(bot, ctx, args) {
        const data = new Date().toUTCString();
        (ctx instanceof Message) ? await ctx.reply(data) : await ctx.followUp({content: data});
    }
});