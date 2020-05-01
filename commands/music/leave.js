const { Command } = require('discord.js-commando');

module.exports = class Leave extends Command {
    constructor(client) {
        super(client, {
            name: 'leave',
            memberName: 'leave',
            group: 'music',
            description: 'leaves a voice channel',
            guildOnly: true
        });
    }

    async run(message) {
        if (!message.member.voice.channel) return message.reply('you need to join a channel!');

        const voiceChannel = message.member.voice.channel;

        voiceChannel.leave();

        return message.say('left!');
    }
}