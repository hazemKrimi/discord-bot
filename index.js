const { CommandoClient } = require('discord.js-commando');
const { Structures } = require('discord.js');
const { MessageEmbed } = require('discord.js');
const winston = require('winston');
const ytdl = require('ytdl-core');
const path = require('path');

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs.log' }),
    ],
    format: winston.format.combine(
        winston.format.printf(log => `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} - [${log.level.toUpperCase()}] - ${log.message}`),
    )
});

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
                paused: false,
                seek: null,
                sfx: {
                    earrape: false
                }
            };
        }

        play = async (queue, message) => {
            try {
                if (!message.guild.music.seek && queue.length === 0) throw new Error('Unknwon');

                const voiceChannel = !message.guild.music.seek ? queue[0].voiceChannel : message.guild.music.nowPlaying.voiceChannel;
                const connection = await voiceChannel.join();

                let dispatcher;

                if (message.guild.music.seek) {
                    switch (message.guild.music.nowPlaying.type) {
                        case 'youtube': { dispatcher = connection.play(ytdl(message.guild.music.nowPlaying.link, { quality: 'highestaudio' }), { seek: message.guild.music.seek }); break; }
                        case 'facebook': { dispatcher = connection.play(message.guild.music.nowPlaying.link, { seek: message.guild.music.seek }); break; }
                        case 'other': { dispatcher = connection.play(message.guild.music.nowPlaying.link, { seek: message.guild.music.seek }); break; }
                    }
                } else {
                    switch (queue[0].type) {
                        case 'youtube': { dispatcher = connection.play(ytdl(queue[0].link, { quality: 'highestaudio' })); break; }
                        case 'facebook': { dispatcher = connection.play(queue[0].link); break; }
                        case 'other': { dispatcher = connection.play(queue[0].link); break; }
                    }
                }

                dispatcher.on('start', async () => {
                    message.guild.music.nowPlaying = !message.guild.music.seek ? queue[0] : message.guild.music.nowPlaying;
                    message.guild.music.dispatcher = dispatcher;
                    dispatcher.setVolume(message.guild.music.volume);
                    if (!message.guild.music.seek) {
                        const embed = new MessageEmbed().setColor('#000099').setTitle(`:arrow_forward: Play`).addField('Now playing', queue[0].title);
                        if (queue[0].type === 'youtube') embed.setThumbnail(queue[0].thumbnail);
                        if (queue[0].type !== 'other') embed.addField('By', queue[0].by);
                        embed.addField('Duration', queue[0].duration);
                        await message.say({ embed });
                    }
                    return queue.shift();
                });

                dispatcher.on('finish', async () => {
                    if (queue.length >= 1) {
                        message.guild.music.seek = null;
                        return this.play(queue, message);
                    }
                    message.guild.music.isPlaying = false;
                    message.guild.music.nowPlaying = null;
                    message.guild.music.dispatcher = null;
                    message.guild.music.paused = false;
                    message.guild.music.seek = null;
                    voiceChannel.leave();
                    const embed = new MessageEmbed().setColor('#000099').setTitle(':musical_note: Queue ended');
                    return await message.say({ embed });
                });

                dispatcher.on('error', err => {
                    message.guild.music.queue = [];
                    message.guild.music.isPlaying = false;
                    message.guild.music.nowPlaying = false;
                    message.guild.music.dispatcher = null;
                    message.guild.music.paused = false;
                    message.guild.music.seek = null;
                    voiceChannel.leave();
                    throw err;
                });
            } catch(err) {
                logger.log('error', err);
                const embed = new MessageEmbed().setColor('#ff0000').setTitle(`:x: Error occured: ${err.message}`);
                return message.say({ embed });
            }
        }

        formatDurationString = (hours, minutes, seconds) => {
            return `${hours < 10 ? '0' + hours : hours ? hours : '00'}:${minutes < 10 ? '0' + minutes : minutes ? minutes : '00'}:${seconds < 10 ? '0' + seconds : seconds ? seconds : '00'}`;
        }

        formatDurationSeconds = durationString => {
            if (!durationString.match(/(\d+:)?(\d{2}:)?\d{2}/)) return;
            
            const time = durationString.split(':').map(time => parseInt(time));

            switch (time.length) {
                case 3: return time[0] * 3600 + time[1] * 60 + time[2];
                case 2: return time[0] * 60 + time[1];
                case 1: return time[0];
            }
        }
    }

    return MusicGuild;
});

const client = new CommandoClient({
    commandPrefix: process.env.PREFIX,
    owner: process.env.OWNER_ID
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

client.on('debug', msg => logger.log('debug', msg));
client.on('warn', msg => logger.log('warn', msg));
client.on('error', msg => logger.log('error', msg));

process.on('unhandledRejection', err => logger.log('error', err));

client.login(process.env.BOT_TOKEN);