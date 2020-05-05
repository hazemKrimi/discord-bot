const { Command } = require('discord.js-commando');

module.exports = class Play extends Command {
    constructor(client) {
        super(client, {
            name: 'stop',
            memberName: 'stop',
            group: 'music',
            description: 'stops the player and leaves the channel',
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 5
            }
        });
    }

    run = message => {
        if (!message.member.voice.channel) return message.reply('you need to join a channel!');

        const voiceChannel = message.member.voice.channel;

        voiceChannel.leave();

        return message.say('stopped!');
    }
}