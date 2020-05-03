const { Command } = require('discord.js-commando');
const puppeteer = require('puppeteer');
const ytdl = require('ytdl-core-discord');
const Youtube = require('simple-youtube-api');
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
        try {
            const voiceChannel = message.member.voice.channel;

            if (!voiceChannel) return message.reply('you need to join a channel!');

            const connection = await voiceChannel.join();

            if (query.match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/\S+/)) {
                const link = query.match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/\S+/)[0];

                const dispatcher = connection.play(await ytdl(link), { type: 'opus' });

                dispatcher.on('start', () => {
                    return message.reply('youtube video is playing!');
                });
            } else if (query.match(/^(http(s)?:\/\/)?((w){3}.)?facebook?(\.com)?\/\S+\/videos\/\S+/)) {
                const link = query.match(/^(http(s)?:\/\/)?((w){3}.)?facebook?(\.com)?\/\S+\/videos\/\S+/)[0];

                (async () => {
                    try {
                        const browser = await puppeteer.launch({
                            timeout: 0
                        });
                        const page = await browser.newPage();
                        page.setDefaultNavigationTimeout(0);
                        page.setDefaultTimeout(0);
                        await page.goto(link, { waitUntil: 'networkidle2' });
                        const metaHandle = await page.$('meta[property="og:video:url"]');
                        const videoLink = await page.evaluate(meta => meta.getAttribute('content'), metaHandle);

                        const dispatcher = connection.play(videoLink);

                        dispatcher.on('start', () => {
                            return message.reply('facebook video is playing!');
                        });
                    } catch (err) {
                        message.reply('cannot play what you requested!');
                        throw err;
                    }
                })();
            } else if (query.match(/^(http(s)?:\/\/)?((w){3}\S)?\S+(\.)\S+\/\S+\.(\S){3}/)) {
                const link = query.match(/^(http(s)?:\/\/)?((w){3}\S)?\S+(\.)\S+\/\S+\.(\S){3}/)[0];

                const dispatcher = connection.play(link);

                dispatcher.on('start', () => {
                    return message.reply('playing!');
                });
            } else {
                const videos = await youtube.searchVideos(query, 1);
                if (!videos.length === 1) return message.reply('nothing found!');
                const dispatcher = connection.play(await ytdl(`https://www.youtube.com/watch?v=${videos[0].raw.id.videoId}`), { type: 'opus' });

                dispatcher.on('start', () => {
                    return message.reply('youtube video is playing!');
                });
            }
        } catch(err) {
            console.log(err);
            return message.reply('cannot play what you requested!');
        }
    }
}