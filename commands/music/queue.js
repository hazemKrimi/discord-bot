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
            name: 'queue',
            memberName: 'queue',
            group: 'music',
            description: 'shows the queue',
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 3
            }
        });
    }

    run = async message => {
        try {
            if (message.guild.music.queue.length === 0 && !message.guild.music.nowPlaying) {
                const embed = new MessageEmbed().setColor('#000099').setTitle(':musical_note: Queue is empty');
                return await message.say({ embed });
            } else {
                const embed = new MessageEmbed().setColor('#000099').setTitle(':musical_note: Queue');

                embed
                    .addField('Now playing', `${message.guild.music.nowPlaying.title} ${message.guild.music.nowPlaying.by && `By ${message.guild.music.nowPlaying.by}`}`)
                    .addField('Duration', `${message.guild.music.nowPlaying.playingFor.string}/${message.guild.music.nowPlaying.duration.string}`);

                if (message.guild.music.queue.length === 0) embed.addField('Queue', 'nothing in the queue');
                else embed.addField('Queue', `${message.guild.music.queue.length} track(s)`);

                message.guild.music.queue.forEach((item, index) => embed.addField(index + 1, `${item.title} ${item.by && `By ${item.by}`}`));

                return await message.say({ embed });
            }
        } catch(err) {
            logger.log('error', err);
            const embed = new MessageEmbed().setColor('#ff0000').setTitle(`:x: Error occured: ${err.message}`);
            return message.say({ embed });
        }
    }
}