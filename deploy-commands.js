// clientId: Your client's id
// guildId: Your development server's id
// commands: An array of commands to register. The slash command builder from @discordjs/builders is used to build the data for your commands

const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { clientId, guildId, token } = require('./config.json');
const fs = require('fs');

// const commands = [
// 	new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
// 	new SlashCommandBuilder().setName('server').setDescription('Replies with server info!'),
// 	new SlashCommandBuilder().setName('user').setDescription('Replies with user info!'),
// ]
// 	.map(command => command.toJSON());
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

// THIS ONLY DEPLOYS TO VALORANT BOYS AND MY TESTING SERVER CURRENTLY
rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

valGuildId = "730962084862361722";
rest.put(Routes.applicationGuildCommands(clientId, valGuildId), { body: commands })
	.then(() => console.log('Successfully registered application commands for val boys.'))
	.catch(console.error);