const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class Play extends Command {
    constructor(client) {
        super(client, {
            name: 'skip',
            memberName: 'skip',
            group: 'music',
            description: 'skips the current track',
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 5
            }
        });
    }

    run = async message => {
        try {
            if (!message.member.voice.channel) {
                const embed = new MessageEmbed().setColor('#ff0000').setTitle(':x: You need to join a voice channel first');
                return await message.say({ embed });
            }
            else if (!message.guild.music.isPlaying) {
                const embed = new MessageEmbed().setColor('#ff0000').setTitle(':x: Play something first');
                return await message.say({ embed });
            }
            else {
                message.guild.music.dispatcher.emit('finish');
                const embed = new MessageEmbed().setColor('#000099').setTitle(':stop_button: Skipped current track');
                return await message.say({ embed });
            }
        } catch (err) {
            console.error(err);
            const embed = new MessageEmbed().setColor('#ff0000').setTitle(':x: Error occured, if you are my creator please fix me soon');
            return message.say({ embed });
        }
    }
}