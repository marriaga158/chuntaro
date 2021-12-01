const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('remind')
		.setDescription('Creates a reminder for people to get on.')
        .addStringOption(option =>
            option.setName('time')
                .setDescription('The time (in 24h format) that the reminder will be set for')
                .setRequired(true)),
	async execute(interaction) {
        const timeStr = interaction.options.getString('time');
		await interaction.reply('remind command called ' + timeStr);
	},
};
