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
            name: 'earrape',
            memberName: 'earrape',
            group: 'music',
            description: 'toggles the earrape sfx',
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
            } else {
                message.guild.music.volume = message.guild.music.sfx.earrape ? 1 : 10000;
                message.guild.music.dispatcher.setVolume(message.guild.music.sfx.earrape ? 1 : 10000);
                message.guild.music.sfx.earrape = !message.guild.music.sfx.earrape;
                const embed = new MessageEmbed().setColor('#000099').setTitle(`:loud_sound: Earrape ${message.guild.music.sfx.earrape ? 'on' : 'off'}`);
                return await message.say({ embed });
            }
        } catch(err) {
            logger.log('error', err);
            const embed = new MessageEmbed().setColor('#ff0000').setTitle(`:x: Error occured: ${err.message}`);
            return message.say({ embed });
        }
    }
}