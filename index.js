// because I am a masochist I write a discord bot in a new language every fucking time
// const { REST } = require('@discordjs/rest');
// const { Routes } = require('discord-api-types/v9');
// const { SlashCommandBuilder } = require('@discordjs/builders');
const { Client, Collection, Intents } = require('discord.js');
const { token } = require('./config.json');
const fs = require('fs');
let reminderMod = require('./reminder');
let Reminder = reminderMod.Reminder;

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

var testString = "this is a test of global variables in js";

// This block is reponsible for grabbing all the commands from their files
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

// Grabs all the events
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Login to Discord with your client's token
client.login(token);

setInterval(function() {
	console.log("index checking for reminders\n");
	Reminder.checkAndSendReminders(client); }, 60 * 1000);