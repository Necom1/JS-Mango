const Discord = require('discord.js');
const Command = require('../../structures/command.js');

module.exports = new Command({
    name: 'ping',
    description: 'Measures Ping between the bot and Discord',
    permission: 'SEND_MESSAGES',

    async run(msg, args, bot) {
        const ping = bot.ws.ping;
        const m = await msg.reply(`Ping: ${ping} ms`);

        const embed = new Discord.MessageEmbed()
            .setTitle('Bot Current Latency')
            .setTimestamp(m.createdTimestamp)
            .setFooter(bot.user.username, bot.user.avatarURL({ dynamic: true }))
            .addField('Discord Ping', `${ping}`, true)
            .addField('Message Ping', `${m.createdTimestamp - msg.createdTimestamp} ms`, true);

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

        m.edit({ embeds: [embed], content: null });
    }
});