const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const winston = require('winston');

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs.log' }),
    ],
    format: winston.format.combine(
        winston.format.printf(log => `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} - [${log.level.toUpperCase()}] - ${log.message}`),
    )
});

module.exports = class JoinCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'seek',
            memberName: 'seek',
            group: 'music',
            description: 'seeks to a timestamp in the track',
            guildOnly: true,
            args: [
                {
                    key: 'query',
                    prompt: 'to what time do you want to seek? (HH:MM:SS)',
                    type: 'string',
                    validate: query => query.length > 0 && query.match(/\d+:\d{2}:\d{2}/)
                }
            ],
            throttling: {
                usages: 1,
                duration: 3
            }
        });
    }

    run = async(message, { query }) => {
        try {
            if (!message.member.voice.channel) {
                const embed = new MessageEmbed().setColor('#ff0000').setTitle(':x: You need to join a voice channel first');
                return await message.say({ embed });
            }
            else if (!message.guild.music.isPlaying) {
                const embed = new MessageEmbed().setColor('#ff0000').setTitle(':x: Play something first');
                return await message.say({ embed });
            }
            else {
                const seekSeconds = message.guild.formatDurationSeconds(query);
                const nowplayingSeconds = message.guild.formatDurationSeconds(message.guild.music.nowPlaying.duration);
                if (seekSeconds > nowplayingSeconds) {
                    const embed = new MessageEmbed().setColor('#ff0000').setTitle(':x: Seek time is greater than track time');
                    return await message.say({ embed });
                }
                message.guild.music.seek = seekSeconds;
                await message.guild.play(message.guild.music.queue, message);
                const embed = new MessageEmbed().setColor('#000099').setTitle(`:musical_note: Sought to ${query}`);
                return await message.say({ embed });
            }
        } catch(err) {
            logger.log('error', err);
            const embed = new MessageEmbed().setColor('#ff0000').setTitle(`:x: Error occured: ${err.message}`);
            return message.say({ embed });
        }
    }
}