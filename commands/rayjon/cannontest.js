const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cannontest')
		.setDescription('Tracks cannons missed.'),
	async execute(interaction) {
		console.log('waiting here');
		// interaction.guild is the object representing the Guild in which the command was run
		await interaction.reply({ content: `Cannons missed: ${interaction.guild}`, ephemeral: true});
	},
};