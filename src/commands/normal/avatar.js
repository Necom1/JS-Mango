const Discord = require('discord.js');
const Command = require('../../structures/command.js');
const getAvgC = require('fast-average-color-node');

module.exports = new Command({
    name: 'avatar',
    description: 'returns avatar of the specified user in embed',
    options: [
        {
            name: 'target',
            description: 'select a user',
            type: 'USER',
            required: false
        }
    ],
    aliases: ['pfp'],
    permission: 'SEND_MESSAGES',
    maxArgs: 1,
    private: true,
    checks: true,

    async run(bot, ctx, args) {
        let target = '';
        const isMsg = ctx instanceof Discord.Message;

        if (isMsg) {
            target = String(args.length === 1 ? args[0] : ctx.author.id);
            if (!isNaN(target)) {
                target = bot.getMember(ctx.guild, target);

                if (!target) {
                    if (isMsg) return ctx.reply('Can not find the specified user');
                    return await ctx.followUp({ content: 'Can not find the specified user' });
                }

                target = target.user;
            } else {
                target = ctx.mentions.users.first();
            }
        } else {
            target = ctx.options.getUser('target');
            if (!target) target = ctx.user.id;
        }

        const url = target.displayAvatarURL({ dynamic: true, size: 2048, format: 'png' });
        const c = (await getAvgC.getAverageColor(url)).hex;
        const embed = new Discord.MessageEmbed()
            .setTimestamp(ctx.createdTimestamp)
            .setColor(c)
            .setAuthor(`${target.username}'s Profile Picture`, null, url)
            .setImage(url)
            .setFooter(target.id);

        if (isMsg) {
            ctx.reply({ embeds: [embed] });
        } else {
            await ctx.followUp({ embeds: [embed], content: null });
        }
    }
});