const { MessageEmbed, GuildMember, Message } = require('discord.js');
const Command = require('../../structures/command.js');
const getAvgC = require('fast-average-color-node');

module.exports = new Command({
    name: 'userinfo',
    description: 'returns Discord data associated with the target',
    options: [
        {
            name: 'target',
            description: 'select a user',
            type: 'USER',
            required: false
        }
    ],
    aliases: ['uinfo'],
    permission: 'SEND_MESSAGES',
    maxArgs: 1,

    async run(bot, ctx, args) {
        const isMsg = ctx instanceof Message;
        let data = null;

        if(isMsg) {
            data = bot.getMember(ctx.guild, args.length > 0 ? args[0] : ctx.author.id);
        } else {
            data = ctx.options.getUser('target');
            data = bot.getMember(ctx.guild, data ? data.id : ctx.user.id);
        }

        if(!data) return isMsg ? ctx.reply({content: 'Can not find the specified user'}) :
            await ctx.followUp({content: 'Can not find the specified user'});

        const embed = new MessageEmbed();
        const author = isMsg ? ctx.author : ctx.user;

        if(data instanceof GuildMember) {
            embed.setTimestamp(ctx.createdTimestamp)
                .setThumbnail(data.user.displayAvatarURL({dynamic: true, size: 512, format: 'png'}))
                .setFooter(`Requested by ${author.username}`,
                    author.displayAvatarURL({dynamic: true, format: 'png', size: 64}))
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

        // TODO: incorporate fetch user for bot admins

        isMsg ? ctx.reply({embeds: [embed]}) : await ctx.followUp({embeds: [embed], content: null});
    }
});