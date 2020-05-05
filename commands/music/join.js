const { Command } = require('discord.js-commando');

module.exports = class JoinCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'join',
            memberName: 'join',
            group: 'music',
            description: 'joins a voice channel',
            aliases: ['summon'],
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 5
            }
        });
    }

    run = async message => {
        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel) return message.reply('you need to join a channel!');

        await voiceChannel.join();

        return message.say('joined!');
    }
}