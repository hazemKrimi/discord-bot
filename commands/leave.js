module.exports = {
    name: 'leave',
    description: 'leaves a voice channel',
    execute: async(message, args) => {
        if (!message.member.voice.channel) return message.reply('you need to join a channel!');

        const voiceChannel = message.member.voice.channel;

        voiceChannel.leave();

        return message.channel.send('left!');
    }
};