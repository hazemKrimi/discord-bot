require('dotenv').config();

const fs = require('fs');
const Discord = require('discord.js');

const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on('message', async message => {
    if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) return;

    const args = message.content.slice(process.env.PREFIX.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    const voiceChannel = message.member.voice.channel;

    if (!client.commands.has(commandName)) return message.reply('this command does not exist!');

    const command = client.commands.get(commandName);

    try {
        command.execute(message, voiceChannel, args);
    } catch (error) {
        console.error(error);
        message.reply('there was an error trying to execute that command!');
    }
});

client.once('ready', () => {
    console.log('ready');
});

client.login(process.env.BOT_TOKEN);