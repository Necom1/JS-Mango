const Discord = require('discord.js');
const Command = require('../../structures/command.js');
const getAvgC = require('fast-average-color-node');

module.exports = new Command({
    name: 'avatar',
    description: 'returns avatar of the specified user in embed',
    permission: 'SEND_MESSAGES',
    minArgs: 0,
    maxArgs: 1,

    async run(msg, args, bot) {
        let target = args.length === 1 ? String(args[0]) : String(msg.author.id);

        if (msg.mentions.users.size < 1) {
            target = bot.getMember(msg.guild, target);

            if (!target) {
                return msg.reply("Can not find the specified user");
            }

            target = target.user;
        } else {
            target = msg.mentions.users.first();
        }

        const url = target.displayAvatarURL({ dynamic: true, size: 2048, format: 'png' });
        const c = (await getAvgC.getAverageColor(url)).hex;
        const embed = new Discord.MessageEmbed()
            .setTimestamp(msg.createdTimestamp)
            .setColor(c)
            .setAuthor(`${target.username}'s Profile Picture`, null, url)
            .setImage(url)
            .setFooter(target.id);

        msg.reply({ embeds: [embed] });
    }
});