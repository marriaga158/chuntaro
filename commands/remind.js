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

        // delete and remake the role
        let roleName = "remind";
        let remindRole = interaction.guild.roles.cache.find(role => role.name === roleName);
        //console.log(remindRole); // holy shit this works!
        if(!remindRole){
            await interaction.reply({content: 'You don\'t have a specified "remind" role. Please either create a role titled "remind" or ask the server admin to do so.', ephemeral: true});
            return;
        }
        interaction.guild.roles.create({
            data: {
            name: roleName, // TODO: this isn't working right
            color: remindRole.color,
            hoist: remindRole.hoist,
            position: remindRole.position,
            permissions: remindRole.permissions,
            mentionable: remindRole.mentionable
            }
        })
            .then(function(result) {
                interaction.member.roles.add(result);
            });
        remindRole.delete("yea");

        //console.log(interaction);
        //let newRemRole = interaction.guild.roles.cache.find(role => role.name === "remind");
        // newRemRole.then(console.log);
        // interaction.member.roles.add(newRemRole); // adds the person who called the function to the role.

		await interaction.reply({ content: 'Reminder created for ' + timeStr + ". Click the button to be reminded.", components: [buttonRow] });

        // I'm actually such an idiot I can just make a reminder class and that's how i'm going to do it
        let reminder = new Reminder(timeHr, timeMin, Math.random, interaction.user.id);

        function actuallyRemind() {
            // I can't reply anymore so I"m going to have to just send a new msg
            let remindChannelID = interaction.channelId;
            console.log("reminder sent");
            interaction.client.channels.cache.get(remindChannelID).send('this is a test!');
        }
        
        // I need to get the number of ms betweent he
        let currTime = new Date();
        let waitms = reminder.timeToRemind - currTime;
        console.log("reminder.timeToRemind: " + reminder.timeToRemind + ", waitms: " + waitms); // this is failing. fun!
        setTimeout(actuallyRemind, waitms);
	},
};
