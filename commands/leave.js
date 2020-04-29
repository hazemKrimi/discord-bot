module.exports = {
    name: 'leave',
    description: 'leaves a voice channel',
    execute: async = (message, voiceChannel, args) => {
        voiceChannel.leave();
    }
};