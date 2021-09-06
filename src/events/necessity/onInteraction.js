const Event = require('../../structures/event');

module.exports = new Event('interactionCreate', async (bot, interaction) => {
    if (!interaction.isCommand() || interaction.user.bot) return;

    const cmd = bot.commands.get(interaction.commandName);
    if (!cmd) return interaction.reply(`command of the name \`${interaction.commandName}\` can not be found`);
    if (cmd.noDM && !interaction.inGuild()) return interaction.reply('This command can not be used in DMs');
    interaction.deferReply({ephemeral: cmd.private}).catch(() => {});

    cmd.run(bot, interaction);
});