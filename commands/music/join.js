const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class JoinCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'join',
            memberName: 'join',
            group: 'music',
            description: 'joins a voice channel',
            aliases: ['summon'],
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

            await voiceChannel.join();
            const embed = new MessageEmbed().setColor('#000099').setTitle('Joined');
            return await message.say({ embed });
        } catch(err) {
            console.error(err);
            const embed = new MessageEmbed().setColor('#ff0000').setTitle(':x: Error occured, if you are my creator please fix me soon');
            return message.say({ embed });
        }
    }
}