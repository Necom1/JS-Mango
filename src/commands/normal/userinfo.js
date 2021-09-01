const Discord = require('discord.js');
const Command = require('../../structures/command.js');
const getAvgC = require('fast-average-color-node');

module.exports = new Command({
    name: 'userinfo',
    description: 'returns Discord data associated with the target',
    aliases: ['uinfo'],
    permission: 'SEND_MESSAGES',
    minArgs: 0,
    maxArgs: 1,

    async run(msg, args, bot) {
        const data = bot.getMember(msg.guild, args.length > 0 ? args[0] : msg.author.id);

        if(!data) return msg.reply('Can not find the specified user');

        const embed = new Discord.MessageEmbed();
        if(data instanceof Discord.GuildMember) {
            embed.setTimestamp(msg.createdTimestamp)
                .setThumbnail(data.user.displayAvatarURL({dynamic: true, size: 512, format: 'png'}))
                .setFooter(`Requested by ${msg.author.username}`,
                    msg.author.displayAvatarURL({dynamic: true, format: 'png', size: 64}))
                .setColor(data.displayHexColor);
            embed.addFields([{
                name: 'Mention', value: `<@${data.id}>`, inline: true
            }, {
                name: 'ID:', value: data.id, inline: true
            }, {
                name: 'Username', value: data.user.username
            }]);

            if(data.nickname) {
                embed.addField('Nickname', data.nickname);
            }

            embed.addFields([{
                name: 'Joined Discord on', value: data.user.createdAt.toUTCString()
            }, {
                name: 'Joined Server on', value: data.joinedAt.toUTCString()
            }]);

            let temp = `**__Roles (${data.roles.cache.size})__**\n`;
            data.roles.cache.forEach(i => temp += `<@&${i.id}>`);

            if(temp.length > 4096) temp = `**__Roles (${data.roles.cache.size})__**\nJust Too Many to List...`;

            embed.setDescription(temp);
        }

        msg.reply({embeds: [embed]});
    }
});