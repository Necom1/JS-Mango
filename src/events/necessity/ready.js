const Event = require('../../structures/event');

module.exports = new Event('ready', async (bot) => {
    await bot.application.fetch();
    console.log('---------------------------------------------------------');
    console.log('Successfully Logged into Discord');
    console.log('*********************************************************');
    console.log(`Bot:\t${bot.user.username} | ${bot.user.id}`);
    console.log(`Owner:\t${bot.application.owner.username} | ${bot.application.owner.id}`);
    console.log('*********************************************************');

    if (bot.slashUpdate) {
        console.log('Attempt to push slash commands to servers...');
        const slashCommands = bot.slashCommandsData();
        bot.guilds.cache.forEach(i => {
            try {
                i.commands.set(slashCommands);
                console.log(`    Successfully pushed slash commands to server: ${i.id} -> ${i.name}`);
            } catch (e) {
                console.log(`Failed to add slash commands to server: ${i.id} with error:`);
                console.error(e);
            }
        });
        console.log('*********************************************************');
    }

    console.log('Initialization Complete, Ready to Go!');
    console.log('=========================================================');
});