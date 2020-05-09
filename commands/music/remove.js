const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class JoinCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'remove',
            memberName: 'remove',
            group: 'music',
            description: 'removes a track from the queue',
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
                return await message.say({ embed });
            }
            else {
                // TODO remove logic goes here
            }
        } catch (err) {
            console.error(err);
            const embed = new MessageEmbed().setColor('#ff0000').setTitle(`:x: Error occured: ${err.message}`);
            return message.say({ embed });
        }
    }
}