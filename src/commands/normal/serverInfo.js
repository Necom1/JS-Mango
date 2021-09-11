const Command = require('../../structures/command.js');
const { Message, MessageEmbed } = require("discord.js");

module.exports = new Command({
    name: 'sinfo',
    description: 'show server information in embed format',
    aliases: ['serverinfo'],
    permission: 'SEND_MESSAGES',
    checks: true,
    noDM: true,

    async run(bot, ctx, args) {
        const guild = ctx.guild;

        let color = '#535c68';
        let emoteLimit = 50;
        let stickerLimit = 0;
        let level = 0;
        switch (guild.premium_tier) {
            case 'TIER_1':
                level = 1;
                color = '#ff9ff3';
                emoteLimit = 100;
                stickerLimit = 15;
                break;
            case 'TIER_2':
                level = 2;
                color = '#f368e0';
                emoteLimit = 150;
                stickerLimit = 30;
                break;
            case 'TIER_3':
                level = 3;
                color = '#be2edd';
                emoteLimit = 250;
                stickerLimit = 60;
                break;
        }

        let emoteCount = [0, 0];
        guild.emojis.cache.each(i => i.animated ? emoteCount[1]++ : emoteCount[0]++);

        const embed = new MessageEmbed();
        embed.setTimestamp(ctx.createdTimestamp)
            .setThumbnail(guild.iconURL({ size: 256, format: 'png', dynamic: true }))
            .setColor(color)
            .setTitle(`𝕊𝕖𝕣𝕧𝕖𝕣 𝕀𝕟𝕗𝕠 - ${guild.memberCount}`);
        if (guild.banner) embed.setImage(guild.bannerURL({ size: 1024, format: 'png' }));

        embed.addFields([{
            name: 'Server Name (ID)', value: `${guild.name} (${guild.id})`
        }, {
            name: 'Owner', value: `<@!${guild.ownerId}>`
        }, {
            name: 'Boost Info', value: `Lv.${level} ( ${guild.premiumSubscriptionCount} )`
        }, {
            name: 'Filter', value: guild.explicitContentFilter.toLowerCase().replace('_', ' ')
        }, {
            name: 'Verification Level',
            value: guild.verificationLevel.toLowerCase().replace('_', ' ')
        }, {
            name: 'Emote Slots', value: `${emoteCount[0]} / ${emoteLimit}`, inline: true
        }, {
            name: 'Animated Slots', value: `${emoteCount[1]} / ${emoteLimit}`, inline: true
        }, {
            name: 'Sticker Slots', value: `${guild.stickers.cache.size} / ${stickerLimit}`, inline: true
        }, {
            name: 'Server Birthday', value: guild.createdAt.toUTCString()
        }]);

        if (ctx instanceof Message) {
            await ctx.reply({ embeds: [embed] });
        } else {
            await ctx.followUp({ embeds: [embed] });
        }
    }
});