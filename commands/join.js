module.exports = {
    name: 'join',
    description: 'joins a voice channel',
    execute: async (message, voiceChannel, args) => {
        connection = await voiceChannel.join();
        connection.play('https://www.youtube.com/watch?v=Hl1s4BT9Fc4');
    }
};