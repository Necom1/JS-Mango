const MangoJS = require('./structures/mango.js')

const bot = new MangoJS({ slashUpdate: process.argv[2] === 'sUpdate' });
