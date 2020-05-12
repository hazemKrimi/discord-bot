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

module.exports = class Play extends Command {
    constructor(client) {
        super(client, {
            name: 'volume',
            memberName: 'volume',
            group: 'music',
            description: 'sets the volume of the player',
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 3
            },
            args: [
                {
                    key: 'query',
                    prompt: 'specify the volume (more than 0)',
                    type: 'string',
                    validate: query => query.length > 0 && parseInt(query) >= 0 && parseInt(query) <= 200
                }
            ],
        });
    }

    run = async (message, { query }) => {
        try {
            if (!message.member.voice.channel) {
                const embed = new MessageEmbed().setColor('#ff0000').setTitle(':x: You need to join a voice channel first');
                return await message.say({ embed });
            }
            else if (!message.guild.music.isPlaying) {
                const embed = new MessageEmbed().setColor('#ff0000').setTitle(':x: Play something first');
                return message.say({ embed });
            }
            else {
                message.guild.music.dispatcher.setVolume(parseInt(query) / 100);
                const embed = new MessageEmbed().setColor('#000099').setTitle(`:sound: Volume set to ${query}%`);
                return await message.say({ embed });
            }
        } catch(err) {
            logger.log('error', err);
            const embed = new MessageEmbed().setColor('#ff0000').setTitle(`:x: Error occured: ${err.message}`);
            return message.say({ embed });
        }
    }
}