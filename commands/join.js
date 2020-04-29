module.exports = {
    name: 'join',
    description: 'joins a voice channel',
    execute: async(message, args) => {
        const voiceChannel = message.member.voice.channel;

        if (!voiceChannel) return message.reply('you need to join a channel!');

        connection = await voiceChannel.join();

        return message.channel.send('joined!');
    }
};