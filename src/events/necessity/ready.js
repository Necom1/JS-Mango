const Event = require('../../structures/event');

module.exports = new Event('ready', async (bot) => {
    await bot.application.fetch();
    console.log('---------------------------------------------------------');
    console.log('Successfully Logged into Discord');
    console.log('*********************************************************');
    console.log(`Bot:\t${bot.user.username} | ${bot.user.id}`);
    console.log(`Owner:\t${bot.application.owner.username} | ${bot.application.owner.id}`);
    console.log('*********************************************************');
    console.log('Initialization Complete, Ready to Go!');
    console.log('=========================================================');
});