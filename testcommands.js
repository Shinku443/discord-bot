// This file is for registering slash commands to every guild.
// You can run this file with `node deploy-commands.js` in your terminal.

const { REST, Routes } = require("discord.js");
const { clientId, token } = require("./config.json");
const fs = require("node:fs");
const { dir, error } = require("node:console");

// subfolder handler
const commandFolders = fs.readdirSync("./commands");
const commands = [];
try {
  for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter((file) => file.endsWith(".js"));
    for (const file of commandFiles) {
      const command = require(`./commands/${folder}/${file}`);
      if ('data' in command && 'execute' in command) 
      {
        commands.push(command.data.toJSON());
      }else{
        console.log(`Command ${file} does not have data or execute property.`);
      }
    }
  }
}catch(error)
{
  console.log(`Error deploying commands: \n ${error}`)
}

const rest = new REST({ version: "10" }).setToken(token || process.env.BOT_Token);
(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);
	
    const data = await rest.put(Routes.applicationCommands(clientId), {
      body: commands,
    });

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    console.error(error);
    //globals.sendWebhookError(error);
  }
})();