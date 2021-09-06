const { MessageEmbed, Message } = require('discord.js');
const Command = require('../../structures/command.js');

module.exports = new Command({
    name: 'ping',
    description: 'Measures Ping between the bot and Discord',
    private: true,
    aliases: ['connection'],
    permission: 'SEND_MESSAGES',

    async run(bot, ctx, args) {
        const ping = bot.ws.ping;
        const isMsg = ctx instanceof Message;

        const m = (isMsg) ? await ctx.reply(`Ping: ${ping} ms`) :
            await ctx.followUp({content: `Ping: ${ping} ms`});

        const embed = new MessageEmbed()
            .setTitle('Bot Current Latency')
            .setTimestamp(m.createdTimestamp)
            .setFooter(bot.user.username, bot.user.avatarURL({ dynamic: true }))
            .addField('Discord Ping', `${ping} ms`, true)
            .addField('Message Ping', `${m.createdTimestamp - ctx.createdTimestamp} ms`, true);

        switch (true) {
            case (ping <= 200):
                embed.setColor('#F1C40F');
                break;
            case (ping <= 90):
                embed.setColor('#2ECC71');
                break;
            default:
                embed.setColor('#E74C3C');
                break;
        }

        if (isMsg) {
            m.edit({ embeds: [embed], content: null });
        } else {
            await ctx.editReply({embeds: [embed], content: null});
        }
    }
});