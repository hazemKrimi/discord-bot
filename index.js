require('dotenv').config();

const { CommandoClient } = require('discord.js-commando');
const { Structures } = require('discord.js');
const path = require('path');

Structures.extend('Guild', Guild => {
    class MusicGuild extends Guild {
        constructor(client, data) {
            super(client, data);
            this.music = {
                queue: [],
                isPlaying: false,
                nowPlaying: null,
                volume: 1,
                dispatcher: null
            };
        }
    }

    return MusicGuild;
});

const client = new CommandoClient({
    commandPrefix: 'b.',
    owner: '321673699436527617'
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