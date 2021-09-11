const Command = require('../../structures/command.js');
const { MessageEmbed, Message } = require('discord.js');
const getAvgC = require('fast-average-color-node');

module.exports = new Command({
    name: 'sicon',
    description: 'returns server icon',
    aliases: ['spfp, server_icon'],
    permission: 'SEND_MESSAGES',
    noDM: true,
    checks: true,

    async run(bot, ctx) {
        const embed = new MessageEmbed();
        const url = ctx.guild.iconURL({ dynamic: true, size: 2048, format: 'png' });
        const c = (await getAvgC.getAverageColor(url)).hex;
        embed.setColor(c)
            .setTitle(`${ctx.guild.name} Server Icon`)
            .setTimestamp(ctx.createdTimestamp)
            .setImage(url);

        if (ctx instanceof Message) {
            await ctx.reply({embeds: [embed]});
        } else {
            await ctx.followUp({embeds: [embed]});
        }
    }
});