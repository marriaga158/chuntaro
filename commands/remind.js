const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');
// import Reminder from '..reminder';
let reminderMod = require('../reminder');
let Reminder = reminderMod.Reminder;

module.exports = {
	data: new SlashCommandBuilder()
		.setName('createreminder')
		.setDescription('Creates a reminder for people to get on.')
        .addStringOption(option =>
            option.setName('time')
                .setDescription('The time (in 24h format) that the reminder will be set for')
                .setRequired(true)),
	async execute(interaction) {
        var timeStr = interaction.options.getString('time');
        const buttonRow = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('beReminded')
                    .setLabel('Remind Me')
                    .setStyle('PRIMARY'),
            );
        // First thing: screen the input to make sure it's a valid time
       
        var regExTime = /([0-2]?[0-9]):([0-9][0-9])/;
        if(timeStr.length == 4){
            timeStr = "0" + timeStr;
        }

        if(!regExTime.test(timeStr)){
            // The given time string isn't correct
            await interaction.reply({content: 'Specified time is in incorrect format.\nFormat the time like (24-hour format) [HH]:[MM].', ephemeral: true});
            return;
        }
        
        // passes, so convert the time string into its components
        var regExTimeArr = regExTime.exec(timeStr);
        var timeHr = regExTimeArr[1];
        var timeMin = regExTimeArr[2];
        console.log(timeHr + ":" + timeMin);

        console.log(interaction.user.id);

        let remindRole = interaction.guild.roles.cache.find(role => role.name === "remind");
        console.log(remindRole); // holy shit this works!

        if(!remindRole){
            // undefined 
            await interaction.reply({content: 'You don\'t have a specified "remind" role. Please either create a role titled "remind" or ask the server admin to do so.', ephemeral: true});
            return;
        }

		await interaction.reply({ content: 'Reminder created for ' + timeStr + ". Click the button to be reminded.", components: [buttonRow] });

        // I'm actually such an idiot I can just make a reminder class and that's how i'm going to do it
        let reminder = new Reminder(timeHr, timeMin, Math.random, interaction.user.id);

        

	},
};
