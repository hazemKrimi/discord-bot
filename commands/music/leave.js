const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class Leave extends Command {
    constructor(client) {
        super(client, {
            name: 'leave',
            memberName: 'leave',
            group: 'music',
            description: 'leaves a voice channel',
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 5
            }
        });
    }

    run = async message => {
        try {
            const voiceChannel = message.member.voice.channel;

            if (!voiceChannel) {
                const embed = new MessageEmbed().setColor('#ff0000').setTitle(':x: You need to join a voice channel first');
                return await message.say({ embed });
            }

            message.guild.music.queue = [];
            message.guild.music.isPlaying = false;
            message.guild.music.nowPlaying = null;
            message.guild.music.dispatcher = null;
            const embed = new MessageEmbed().setColor('#000099').setTitle('Left');
            voiceChannel.leave();
            return await message.say({ embed });
        } catch (err) {
            console.error(err);
            const embed = new MessageEmbed().setColor('#ff0000').setTitle(':x: Error occured, if you are my creator please fix me soon');
            return message.say({ embed });
        }
    }
}