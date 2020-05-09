const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class Play extends Command {
    constructor(client) {
        super(client, {
            name: 'pause',
            memberName: 'pause',
            group: 'music',
            description: 'pauses the player',
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 3
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
                return message.say({ embed });
            }
            else if (message.guild.music.paused) {
                const embed = new MessageEmbed().setColor('#ff0000').setTitle(':x: Already paused');
                return message.say({ embed });
            }
            else {
                message.guild.music.paused = true;
                message.guild.music.dispatcher.pause(true);
                const embed = new MessageEmbed().setColor('#000099').setTitle(':pause_button: paused player');
                return await message.say({ embed });
            }
        } catch (err) {
            console.error(err);
            const embed = new MessageEmbed().setColor('#ff0000').setTitle(`:x: Error occured: ${err.message}`);
            return message.say({ embed });
        }
    }
}