const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName(`cannon`)
		.setDescription('Tracks cannons missed.')
		.addUserOption(option =>
			option
			.setName('username')
			.setDescription('The user to add cannon count to')
		),
	async execute(interaction) {
		console.log('waiting here');

		// interaction.guild is the object representing the Guild in which the command was run
		await interaction.reply({ content: `Cannons missed: ${interaction.guild}`, ephemeral: true});
	},
};