const Discord = require('discord.js');
const client = new Discord.Client();

require('dotenv').config();

client.once('ready', () => {
    console.log('ready');
});

client.login(process.env.BOT_TOKEN);