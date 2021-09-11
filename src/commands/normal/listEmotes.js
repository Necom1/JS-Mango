const { MessageEmbed, Message } = require('discord.js');
const Command = require('../../structures/command.js');

module.exports = new Command({
    name: 'le',
    description: 'List emotes in the server in embed format',
    aliases: ['listemotes'],
    permission: 'SEND_MESSAGES',
    noDM: true,
    checks: true,

    async run(bot, ctx, args) {
        const emojis = ctx.guild.emojis.cache
        const isMsg = ctx instanceof Message

        if (emojis.size < 1) {
            return (isMsg ? ctx.reply('This server don\'t have any emotes.') :
                ctx.followUp({ content: 'This server don\'t have any emotes.' }));
        }

        const normal = [];
        const animated = [];

        const send = [];

        emojis.each(i => { i.animated ? animated.push(i) : normal.push(i) });

        const original = new MessageEmbed()
            .setTimestamp(ctx.createdTimestamp)
            .setColor('#1abc9c')
            .setAuthor(`${ctx.guild.name} | Emote List`,
                ctx.guild.iconURL({ size: 128, dynamic: true, format: 'png' }));

        for(const [k, v] of Object.entries({ 'Normal': normal, 'Animated': animated })) {
            let cur = new MessageEmbed(original);
            if (v.length > 0) {
                let i = 1;
                let temp = '';

                for (const e of v) {
                    temp += e.toString();
                    if (cur.length > 5900) {
                        send.push(new MessageEmbed(cur));
                        cur = new MessageEmbed(original);
                    }

                    if (temp.length > 960) {
                        temp += ' ';
                        cur.addField(`${k} Emotes ${i}`, temp);
                        temp = '';
                        i += 1;
                    }
                }

                if (temp !== '') cur.addField(`${k} Emotes ${i}`, temp);
                send.push(new MessageEmbed(cur));
            }
        }

        for (const i of send) {
            const data = {embeds: [i]};
            isMsg ? ctx.reply(data) : await ctx.followUp(data);
        }

    }
});