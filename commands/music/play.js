const { Command } = require('discord.js-commando');
const Youtube = require('simple-youtube-api');
const ytdl = require('ytdl-core-discord');
const youtube = new Youtube(process.env.YOUTUBE_API_KEY);

module.exports = class Play extends Command {
    constructor(client) {
        super(client, {
            name: 'play',
            memberName: 'play',
            group: 'music',
            description: 'plays audio from youtube or facebook',
            guildOnly: true,
            clientPermissions: ['SPEAK', 'CONNECT'],
            args: [
                {
                    key: 'query',
                    prompt: 'what do you want to listen to?',
                    type: 'string',
                    validate: query => query.length > 0
                }
            ]
        });
    }

    async run(message, { query }) {
        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel) return message.reply('you need to join a channel!');

        const connection = await voiceChannel.join();

        if (query.match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/)) {
            const dispatcher = connection.play(await ytdl(query), { type: 'opus' });

            dispatcher.on('start', () => {
                return message.reply('youtube video is playing!');
            });
        } else {
            return message.reply('currently, i only support youtube video links!');
        }
    }
}