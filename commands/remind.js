const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton } = require('discord.js');

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
        const buttonRow = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('testButton')
                    .setLabel('Primary')
                    .setStyle('PRIMARY'),
            );
		await interaction.reply({ content: 'remind command called ' + timeStr, components: [buttonRow] });
	},
};
