const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName(`highscore`)
		.setDescription('Who has the most cannons missed.'),

	async execute(interaction) {
		// interaction.guild is the object representing the Guild in which the command was run
		await interaction.reply({ content: `Highest amount of cannons missed: ${interaction.guild}`, ephemeral: true});
	},
};