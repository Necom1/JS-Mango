const Command = require('../../structures/command.js');
const { Message, MessageEmbed } = require("discord.js");
const getAvgC = require('fast-average-color-node');

module.exports = new Command({
    name: 'splash',
    description: 'show server splash image if any',
    aliases: ['serversplash'],
    permission: 'SEND_MESSAGES',
    checks: true,
    noDM: true,

    async run(bot, ctx, args) {
        const isMsg = ctx instanceof Message;

        if (!ctx.guild.banner) {
            const temp = {content: 'This server don\'t have splash image set up'};
            return isMsg ? ctx.reply(temp) : ctx.followUp(temp);
        }

        const img = ctx.guild.splashURL({ size: 4096, format: 'png' });
        const c = (await getAvgC.getAverageColor(img)).hex;

        const embed = new MessageEmbed();
        embed.setTimestamp(ctx.createdTimestamp)
            .setColor(c)
            .setTitle(`Splash Image of ${ctx.guild.name}`)
            .setImage(img);

        if (isMsg) {
            ctx.reply({ embeds: [embed] });
        } else {
            await ctx.followUp({ embeds: [embed] });
        }

    }
});