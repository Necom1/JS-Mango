const Command = require('../../structures/command.js');
const { Message, MessageEmbed } = require("discord.js");
const getAvgC = require('fast-average-color-node');

module.exports = new Command({
    name: 'sbanner',
    description: 'show server banner if any',
    aliases: ['banner'],
    permission: 'SEND_MESSAGES',
    checks: true,
    noDM: true,

    async run(bot, ctx, args) {
        const isMsg = ctx instanceof Message;

        if (!ctx.guild.banner) {
            const temp = {content: 'This server don\'t have any banner'};
            return isMsg ? ctx.reply(temp) : ctx.followUp(temp);
        }

        const img = ctx.guild.bannerURL({ size: 2048, format: 'png' });
        const c = (await getAvgC.getAverageColor(img)).hex;

        const embed = new MessageEmbed();
        embed.setTimestamp(ctx.createdTimestamp)
            .setColor(c)
            .setTitle(`Banner of ${ctx.guild.name}`)
            .setImage(img);

        if (isMsg) {
            ctx.reply({ embeds: embed });
        } else {
            await ctx.followUp({ embeds: [embed] });
        }

    }
});