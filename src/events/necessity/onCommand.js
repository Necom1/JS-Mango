const Event = require('../../structures/event');

module.exports = new Event('messageCreate', async (bot, msg) => {
    if (msg.partial) {
        msg.fetch().then(m => {
            msg = m;
        }).catch(err => {
            console.error(err);
        });
    }

    const mention = `<@!${bot.user.id}>`;
    if(!msg.content.startsWith(bot.defaultPrefix) && !msg.content.startsWith(mention)) return;

    const args = msg.content.substring(
        !msg.content.startsWith(mention) ? bot.defaultPrefix.length : mention.length + 1
    ).split(/ /);

    const temp = args.shift().toLowerCase();
    const command = bot.commands.get(temp) || bot.commands.get(bot.commandAliases.get(temp));

    if (!command || msg.author.bot) return;

    if (msg.guild) {
        if(!msg.member.permissions.has(command.permission, true)) return;
    } else {
        if (command.noDM) return msg.reply('This command can not be used in DMs');
    }

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

    command.run(bot, msg, args);
});