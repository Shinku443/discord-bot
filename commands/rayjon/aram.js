const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('aram')
		.setDescription('Queue for ARAM'),
	async execute(interaction) {
		// interaction.guild is the object representing the Guild in which the command was run
		await interaction.reply(`This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`);

		if(command == "create"){
			//c
		}else if(command == "join"){ //also use emojis in future
	
		}else if(command == "close") {
			createMessageComponentCollector()
		}
	},
};