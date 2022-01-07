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
	async execute(interaction) { // triggered when createreminder is executed
        var timeStr = interaction.options.getString('time');
        const buttonRow = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('beReminded')
                    .setLabel('Remind Me')
                    .setStyle('PRIMARY'),
                new MessageButton()
                    .setCustomId('removeReminder')
                    .setLabel('Don\'t Remind Me')
                    .setStyle('DANGER')
            );

        // REAL first thing, check that this server doesn't already have a reminder associated with it
        if(Reminder.checkReminderExists(interaction.guild.id)){
            await interaction.reply({content: 'There is already a reminder active for this server. Remove it with /deletereminder before creating a new one.', ephemeral: true});
            return;
        }
        
        // second thing: screen the input to make sure it's a valid time
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

        // delete and remake the role
        let roleName = "remind";
        let remindRole = interaction.guild.roles.cache.find(role => role.name === roleName);
        //console.log(remindRole); // holy shit this works!
        if(!remindRole){
            await interaction.reply({content: 'You don\'t have a specified "'+roleName+'" role. Please either create a role titled "'+roleName+'" or ask the server admin to do so.', ephemeral: true});
            return;
        }
        // NOTE: this command might become really slow depending on how many people use this function;
        // I don't think this is going to be that much of a problem considering this is a personal bot
        remindRole.members.forEach((member, i) => { // Looping through the members of Role
            member.roles.remove(remindRole); // Removing the Role.
        });
        interaction.member.roles.add(remindRole); // add member to the role

		await interaction.reply({ content: 'Reminder created for ' + timeStr + ". Click the button to be reminded.", components: [buttonRow] });

                                    //timeHour, timeMinute, ownerID, channelID, remindRoleID, serverID
        let reminder = new Reminder(timeHr, timeMin, interaction.user.id, interaction.channelId, remindRole.id, interaction.guild.id); // why the fuck do I do Math.random LOL
        console.log(interaction.channelId);
        console.log(interaction.guild.id);

        console.log("done creating reminder");
        return;

        // let cancelled = false;

        // function actuallyRemind() {
        //     // I can't reply anymore so I"m going to have to just send a new msg
        //     // The reminder is sent to the channel that it's called in
        //     if(cancelled){
        //         return;
        //     }
        //     let remindChannelID = interaction.channelId;
        //     console.log("reminder sent");
        //     interaction.client.channels.cache.get(remindChannelID).send(`<@&${remindRole.id}> Reminder!`);
        // }
        
        // // I need to get the number of ms betweent he
        // let currTime = new Date();
        // let waitms = reminder.timeToRemind - currTime;
        // console.log("reminder.timeToRemind: " + reminder.timeToRemind + ", waitms: " + waitms); // this is failing. fun!
        // setTimeout(actuallyRemind, waitms);
	},
};
