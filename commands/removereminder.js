const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, Message } = require('discord.js');

let reminderMod = require('../reminder');
let Reminder = reminderMod.Reminder;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('removereminder')
		.setDescription('Removes you from the current active reminder'),
	async execute(interaction) { // triggered on execution
		//console.log(interaction.member._roles); // back at it again
        let roleName = "remind";
        let remindRole = interaction.guild.roles.cache.find(role => role.name === roleName);
        if(!remindRole){
            await interaction.reply({content: 'You don\'t have a specified "'+roleName+'" role. Please either create a role titled "'+roleName+'" or ask the server admin to do so.', ephemeral: true});
            return;
        }
        else {
            interaction.member.roles.remove(remindRole);
            await interaction.reply({content: 'Removed from reminder.', ephemeral: true});
            return;
        }
	},
};