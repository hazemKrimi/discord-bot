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
            name: 'skip',
            memberName: 'skip',
            group: 'music',
            description: 'skips the current track',
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 3
            }
        });
    }

    run = async message => {
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
                await message.guild.music.dispatcher.emit('finish');
                const embed = new MessageEmbed().setColor('#000099').setTitle(':track_next: Skipped current track');
                return await message.say({ embed });
            }
        } catch(err) {
            logger.log('error', err);
            const embed = new MessageEmbed().setColor('#ff0000').setTitle(`:x: Error occured: ${err.message}`);
            return message.say({ embed });
        }
    }
}