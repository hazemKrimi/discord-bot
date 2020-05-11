const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const Youtube = require('simple-youtube-api');
const youtube = new Youtube(process.env.YOUTUBE_API_KEY);

module.exports = class JoinCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'search',
            memberName: 'search',
            group: 'music',
            description: 'search and play a track in youtube',
            guildOnly: true,
            args: [
                {
                    key: 'query',
                    prompt: 'what do you want to listen to?',
                    type: 'string',
                    validate: query => query.length > 0
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
            const voiceChannel = message.member.voice.channel;

            if (!voiceChannel) {
                const embed = new MessageEmbed().setColor('#ff0000').setTitle(':x: You need to join a voice channel first');
                return await message.say({ embed });
            }
            else {
                const videos = await youtube.searchVideos(query, 5);
                if (videos.length < 5) {
                    const embed = new MessageEmbed().setColor('#ff0000').setTitle(':x: Nothing found, get more specific');
                    return await message.say({ embed });
                }

                const embed = new MessageEmbed().setColor('#000099').setTitle(`:mag: Search`);
                
                videos.forEach((video, index) => {
                    embed.addField(index + 1, `${video.title} By ${video.channel.title}`);
                });
                embed.addField(0, 'exit');

                await message.say({ embed });

                let choice;
                let index;

                try {
                    choice = await message.channel.awaitMessages(msg => (msg.content >= 0 && msg.content < 6), { max: 1, maxProcessed: 1, time: 60000, errors: ['time'] });
                    index = parseInt(choice.first().content);
                } catch(err) {
                    const embed = new MessageEmbed().setColor('#ff0000').setTitle(`:x: Invalid choice or time\' up`);
                    return await message.say({ embed });
                }

                if (parseInt(choice.first().content) === 0) {
                    const embed = new MessageEmbed().setColor('#000099').setTitle(`:mag: Search canceled`);
                    return await message.say({ embed });
                }
                
                const video = await youtube.getVideoByID(videos[index - 1].raw.id.videoId);
                const title = video.title;
                const by = video.channel.title;
                const durationString = message.guild.formatDuration(video.duration);
                const thumbnail = video.thumbnails.high.url;
                const data = {
                    type: 'search',
                    link: `https://www.youtube.com/watch?v=${video.id}`,
                    title,
                    by,
                    duration: durationString !== '00:00:00' ? { hours: video.duration.hours, minutes: video.duration.minutes, seconds: video.duration.seconds, string: durationString } : 'Live Stream',
                    thumbnail,
                    voiceChannel
                };

                message.guild.music.queue.push(data);

                if (message.guild.music.isPlaying === false || message.guild.music.isPlaying === undefined) {
                    message.guild.music.isPlaying = true;
                    return message.guild.play(message.guild.music.queue, message);
                } else {
                    const embed = new MessageEmbed().setColor('#000099').setTitle(`:arrow_forward: Added "${data.title}" to queue`);
                    return await message.say({ embed });
                }
            }
        } catch (err) {
            console.error(err);
            const embed = new MessageEmbed().setColor('#ff0000').setTitle(`:x: Error occured: ${err.message}`);
            return message.say({ embed });
        }
    }
}