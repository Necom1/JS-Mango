const Event = require('../../structures/event');

module.exports = new Event('messageCreate', async (bot, msg) => {
    if(!msg.content.startsWith(bot.defaultPrefix)) return;

    const args = msg.content.substring(bot.defaultPrefix.length).split(/ /);
    const temp = args.shift()
    const command = bot.commands.find(cmd => cmd.name === temp);

    if (!command || msg.author.bot) return;

    if(!msg.member.permissions.has(command.permission, true)) return;

    if(command.minArgs > args.length) return msg.reply(
        `Too little argument for this command. 
        Minimum of **${command.minArgs}** argument(s) is needed for this command.`
    ).then(m => {
        setTimeout(() => m.delete(), 10000);
    });

    if(command.maxArgs < args.length) return msg.reply(
        `Too many arguments for this command. Maximum amount of argument(s) for this command is **${command.maxArgs}**.`
    ).then(m => {
        setTimeout(() => m.delete(), 10000);
    });

    command.run(msg, args, bot);
});