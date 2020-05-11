const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

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
                    prompt: 'where do you want to seek?',
                    type: 'string',
                    validate: query => query.length > 0 && query.match(/(\d+:)?\d{2}:\d{2}/)
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
                const seekDuration = message.guild.formatDurationObject(query);
                const seekSeconds = seekDuration.hours * 3600 + seekDuration.minutes * 60 + seekDuration.seconds; 
                const nowplayingSeconds = message.guild.music.nowPlaying.duration.hours * 3600 + message.guild.music.nowPlaying.duration.minutes * 60 + message.guild.music.nowPlaying.duration.seconds;
                if (seekSeconds > nowplayingSeconds) {
                    const embed = new MessageEmbed().setColor('#ff0000').setTitle(':x: Seek time is greater than track time');
                    return await message.say({ embed });
                }
                message.guild.music.seek = seekSeconds;
                message.guild.music.nowPlaying.playingFor = { hours: seekDuration.hours, minutes: seekDuration.minutes, seconds: seekDuration.seconds, string: message.guild.formatDurationString(seekDuration) };
                await message.guild.play(message.guild.music.queue, message);
                const embed = new MessageEmbed().setColor('#000099').setTitle(`:musical_note: Sought to ${query}`);
                return await message.say({ embed });
            }
        } catch (err) {
            console.error(err);
            const embed = new MessageEmbed().setColor('#ff0000').setTitle(`:x: Error occured: ${err.message}`);
            return message.say({ embed });
        }
    }
}