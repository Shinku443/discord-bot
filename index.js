const fs = require('node:fs');
const path = require('node:path');
// Require the necessary discord.js classes
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
// Require Sequelize
const Sequelize = require('sequelize');
// Require the necessary discord.js classes


// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		}
		else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);
	console.log(`command: ${interaction.commandName} executed`);
	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.log('lol');
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		}
		else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}

});
client.on('error', (err) => {
	console.log(`lol: ${err}`);
	console.log(err.message);
});

// Log in to Discord with your client's token
client.login(token);

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});
const defaultVal = 1;
const Tags = sequelize.define('tags', {
	name: {
		type: Sequelize.STRING,
		defaultValue: 'rayjon',
		unique: true,
	},
	cannon_count: {
		type: Sequelize.INTEGER,
		defaultValue: defaultVal,
		allowNull: false,
	},
});

client.once(Events.ClientReady, () => {
	Tags.sync();
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'cannon') {
		const tagName = 'rayjon' // interaction.options.getString('name');
		// equivalent to: SELECT * FROM tags WHERE name = 'tagName' LIMIT 1;
		const tag = await Tags.findOne({ where: { name: tagName } });
		if (tag) {
			// equivalent to: UPDATE tags SET usage_count = usage_count + 1 WHERE name = 'tagName';
			tag.increment('cannon_count');

			return interaction.reply(`Rayjon has missed **${tag.cannon_count} cannons** since inception of bot (5/20/2023). Holy shit that's alot`);
		//
		}
		else {
			try {
				// equivalent to: INSERT INTO tags (name, description, username) values (?, ?, ?);
				const tag2 = await Tags.create({
					name: tagName,
					cannon_count: defaultVal,
				});
				return interaction.reply(`Tag ${tag2.name} added:: ${tag2.cannon_count}.`);
			}
			catch (error) {
				console.log('lo3');
				if (error.name === 'SequelizeUniqueConstraintError') {
					return interaction.reply('That tag already exists.');
				}
				return interaction.reply('Something went wrong with adding a tag.');
			}
		}
	}
});
