// this handles interactions running the commands; basic event listener

module.exports = {
	name: 'interactionCreate',
	execute(interaction) {
        //console.log(interaction);

        if (interaction.isButton()){
            console.log(`Button ${interaction.customId} was pressed from cmd ${interaction.interaction.commandName}`);
            return;
        }

        // TODO: build out a button execute based on the command execute below! that's a project for tomorrow

		if (!interaction.isCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) return; // if it's undef

        try {
            command.execute(interaction);
        } catch (error) {
            console.error(error);
            interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
	},
};