// this handles interactions running the commands; basic event listener

module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
        //console.log(interaction);

		if (!interaction.isCommand() && !interaction.isButton()) return;

        if (interaction.isButton()){
            // This is the button press handler
            //console.log(interaction);
            console.log(`Button ${interaction.customId} was pressed from command ${interaction.message.interaction.commandName} with messageID ${interaction.message.id}`)
            if(interaction.customId="beReminded"){
                // add the user to the remind role
                // console.log(interaction);
                let remindRole = interaction.guild.roles.cache.find(role => role.name === "remind");
                if(!remindRole){
                    console.log("Error: unable to assign role; Could not find role");
                    interaction.reply({ content: 'There was an error while trying to assign the remind role. Make sure there is a role titled "remind" and try again.', ephemeral: true });
                } else {
                    interaction.member.roles.add(remindRole);
                    console.log("button pusher added to role");
                    interaction.reply({ content: 'You have been added to this reminder.', ephemeral: true });
                }
                
            }
            return;
        }

        // TODO: build out a button execute based on the command execute below! that's a project for tomorrow
        else {
            // This is the command handler
            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) return; // if it's undef

            try {
                command.execute(interaction);
            } catch (error) {
                console.error(error);
                interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
	},
};