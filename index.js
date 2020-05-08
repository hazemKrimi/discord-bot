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
                dispatcher: null,
                sfx: {
                    earrape: false
                }
            };
        }

        startCounter = message => {
            if (!message.guild.music.nowPlaying.playingFor) message.guild.music.nowPlaying.playingFor = { hours: 0, minutes: 0, seconds: 0, string: '00:00:00' };
            
            const interval = setInterval(() => {
                if (!message.guild.music.nowPlaying || message.guild.music.paused) clearInterval(interval);
                else if (message.guild.music.nowPlaying.playingFor.seconds === 60) {
                    message.guild.music.nowPlaying.playingFor = { 
                        hours: message.guild.music.nowPlaying.playingFor.hours,
                        minutes: message.guild.music.nowPlaying.playingFor.minutes + 1,
                        seconds: 0,
                        string: this.formatDuration({ 
                            hours: message.guild.music.nowPlaying.playingFor.hours,
                            minutes: message.guild.music.nowPlaying.playingFor.minutes + 1,
                            seconds: 0 
                        }) 
                    };
                }
                else if (message.guild.music.nowPlaying.playingFor.minutes === 60) {
                    message.guild.music.nowPlaying.playingFor = { 
                        hours: message.guild.music.nowPlaying.playingFor.hours + 1,
                        minutes: 0,
                        seconds: 0,
                        string: this.formatDuration({ 
                            hours: message.guild.music.nowPlaying.playingFor.hours + 1,
                            minutes: 0,
                            seconds: 0 
                        }) 
                    };
                }
                else {
                    message.guild.music.nowPlaying.playingFor = { 
                        hours: message.guild.music.nowPlaying.playingFor.hours,
                        minutes: message.guild.music.nowPlaying.playingFor.minutes,
                        seconds: message.guild.music.nowPlaying.playingFor.seconds + 1,
                        string: this.formatDuration({ 
                            hours: message.guild.music.nowPlaying.playingFor.hours,
                            minutes: message.guild.music.nowPlaying.playingFor.minutes,
                            seconds: message.guild.music.nowPlaying.playingFor.seconds + 1
                        }) 
                    };
                }
            }, 1000);
        }

        formatDuration = durationObject => {
            return `${durationObject.hours < 10 ? '0' + durationObject.hours : durationObject.hours ? durationObject.hours : '00'}:${durationObject.minutes < 10 ? '0' + durationObject.minutes : durationObject.minutes ? durationObject.minutes : '00'}:${durationObject.seconds < 10 ? '0' + durationObject.seconds : durationObject.seconds ? durationObject.seconds : '00'}`;
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