const { Command } = require('discord.js-commando');
const puppeteer = require('puppeteer');
// const Youtube = require('simple-youtube-api');
const ytdl = require('ytdl-core-discord');
const { URL } = require('url');
// const youtube = new Youtube(process.env.YOUTUBE_API_KEY);

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

            const link = new URL(query);

            if (['youtube.com', 'www.youtube.com'].includes(link.host)) {
                const dispatcher = connection.play(await ytdl(query), { type: 'opus' });

                dispatcher.on('start', () => {
                    return message.reply('youtube video is playing!');
                });
            } else if (['facebook.com', 'www.facebook.com'].includes(link.host)) {
                (async () => {
                    try {
                        const browser = await puppeteer.launch({
                            timeout: 0
                        });
                        const page = await browser.newPage();
                        page.setDefaultNavigationTimeout(0);
                        page.setDefaultTimeout(0);
                        await page.goto(query, { waitUntil: 'networkidle2' });
                        const metaHandle = await page.$('meta[property="og:video:secure_url"]');
                        const videoLink = await page.evaluate(meta => meta.getAttribute('content'), metaHandle);

                        const dispatcher = connection.play(videoLink);

                        dispatcher.on('start', () => {
                            return message.reply('facebook video is playing!');
                        });
                    } catch (err) {
                        throw err;
                    }
                })();
            } else {
                const dispatcher = connection.play(query);

                dispatcher.on('start', () => {
                    return message.reply('video is playing!');
                });
            }
        } catch(err) {
            console.log(err);
            return message.reply('error occured playing video from link!');
        }
    }
}