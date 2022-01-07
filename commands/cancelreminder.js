const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, Message } = require('discord.js');

let reminderMod = require('../reminder');
let Reminder = reminderMod.Reminder;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cancelreminder')
		.setDescription('Cancels the current reminder'),
	async execute(interaction) { // triggered on execution
		//console.log(interaction.member._roles); // back at it again
		if(!Reminder.checkReminderExists(interaction.guild.id)){
			await interaction.reply({content: 'There isn\'t a reminder active for this server.', ephemeral: true});
			return;
		} else {
			// probably don't need the else block but whatever
			// don't need to take care of removing the role because creating a new reminder does that for us
			// check if the person should be able to remove
			let adminRoleName = 'chuntaro admin';
			//let adminRole = interaction.guild.roles.cache.find(role => role.name == adminRoleName);
			if(interaction.member._roles.find(r => r.name === adminRoleName)){ // check if they're an admin
				// allowed to remove it
				// TODO: this is untested
				Reminder.removeReminder(interaction.guild.id);
				await interaction.reply({content: 'Reminder successfully removed.'});
				return;
			} else {
				// not an admin so check if they created the reminder
				if(Reminder.checkOwner(interaction.user.id,interaction.guild.id)){
					Reminder.removeReminder(interaction.guild.id); // let them remove it
					await interaction.reply({content: 'Reminder successfully removed.'});
					return;
				} else {
					// don't let them remove it
					await interaction.reply({content: 'You aren\'t the owner of the current active reminder or an admin of the bot.'});
					return;
				}
			}
		}
	},
};
