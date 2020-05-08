const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class Play extends Command {
    constructor(client) {
        super(client, {
            name: 'resume',
            memberName: 'resume',
            group: 'music',
            description: 'resumes the player',
            guildOnly: true,
            throttling: {
                usages: 1,
                duration: 5
            }
        });
    }

    run = async message => {
        try {
            if (!message.member.voice.channel) return message.reply('you need to join a channel!');
            else if (!message.guild.music.isPlaying) {
                const embed = new MessageEmbed().setColor('#ff0000').setTitle(':x: Play something first');
                return message.say({ embed });
            }
            else if (!message.guild.music.paused) {
                const embed = new MessageEmbed().setColor('#ff0000').setTitle(':x: Playing already');
                return message.say({ embed });
            }
            else {
                message.guild.music.paused = false;
                message.guild.music.dispatcher.resume();
                const embed = new MessageEmbed().setColor('#000099').setTitle(':arrow_forward: resumed player');
                return await message.say({ embed });
            }
        } catch (err) {
            console.error(err);
            const embed = new MessageEmbed().setColor('#ff0000').setTitle(':x: Error occured, if you are my creator please fix me soon');
            return message.say({ embed });
        }
    }
}