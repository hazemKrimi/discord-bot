require('dotenv').config();

const { CommandoClient } = require('discord.js-commando');
const path = require('path');

const client = new CommandoClient({
    commandPrefix: 'b.'
});

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['music', 'Music Commands']
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.once('ready', () => {
    client.user.setActivity('amsa7 lak7el');
});

client.login(process.env.BOT_TOKEN);

client.on('error', console.error);