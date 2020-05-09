const { CommandoClient } = require('discord.js-commando');
const { Structures } = require('discord.js');
const { MessageEmbed } = require('discord.js');
const path = require('path');
const ytdl = require('ytdl-core-discord');

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

        play = async (queue, message) => {
            try {
                if (queue.length === 0) {
                    const embed = new MessageEmbed().setColor('#ff0000').setTitle(`:x: Error occured: ${err.message}`);
                    return await message.say({ embed });
                }

                const voiceChannel = queue[0].voiceChannel;
                const connection = await voiceChannel.join();
                let dispatcher;

                switch (queue[0].type) {
                    case 'youtube': { dispatcher = connection.play(await ytdl(queue[0].link, { quality: 'highestaudio' }), { type: 'opus' }); break; }
                    case 'facebook': { dispatcher = connection.play(queue[0].link); break; }
                    case 'search': { dispatcher = connection.play(await ytdl(queue[0].link), { type: 'opus' }); break; }
                    case 'other': { dispatcher = connection.play(queue[0].link); break; }
                }

                dispatcher.on('start', async () => {
                    message.guild.music.nowPlaying = queue[0];
                    message.guild.startCounter(message);
                    message.guild.music.dispatcher = dispatcher;
                    dispatcher.setVolume(message.guild.music.volume);
                    const embed = new MessageEmbed().setColor('#000099').setTitle(`:arrow_forward: Play`).addField('Now playing', queue[0].title);
                    if (queue[0].type === 'youtube' || queue[0].type === 'search') embed.setThumbnail(queue[0].thumbnail);
                    if (queue[0].type === 'youtube' || queue[0].type === 'search' || queue[0].type === 'facebook') embed.addField('By', queue[0].by);
                    embed.addField('Duration', queue[0].duration.string);
                    await message.say({ embed });
                    return queue.shift();
                });

                dispatcher.on('finish', async () => {
                    if (queue.length >= 1) return this.play(queue, message);
                    else {
                        message.guild.music.isPlaying = false;
                        message.guild.music.nowPlaying = null;
                        message.guild.music.dispatcher = null;
                        voiceChannel.leave();
                        const embed = new MessageEmbed().setColor('#000099').setTitle(':musical_note: Queue ended');
                        return await message.say({ embed });
                    }
                });

                dispatcher.on('error', err => {
                    message.guild.music.queue = [];
                    message.guild.music.isPlaying = false;
                    message.guild.music.nowPlaying = false;
                    message.guild.music.dispatcher = null;
                    voiceChannel.leave();
                    throw err;
                });
            } catch (err) {
                console.error(err);
                const embed = new MessageEmbed().setColor('#ff0000').setTitle(`:x: Error occured: ${err.message}`);
                return message.say({ embed });
            }
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