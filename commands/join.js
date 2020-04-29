module.exports = {
    name: 'join',
    description: 'joins a voice channel',
    execute: async (message, voiceChannel, args) => {
        if (!voiceChannel) return message.reply('you need to join a channel!');
        connection = await voiceChannel.join();
    }
};