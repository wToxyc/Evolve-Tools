const { REST, Routes } = require('discord.js');
const { readdirSync } = require('fs');
const { join } = require('path');
require('dotenv').config();
const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const GUILD_ID = process.env.GUILD_ID;
require('colors');

const commands = [];

const commandDirsPath = join(__dirname, '../commands/');
const commandDirs = readdirSync(commandDirsPath);

for (const dir of commandDirs) {

    const dirPath = join(__dirname, `../commands/${dir}`);
    const commandFiles = readdirSync(dirPath).filter((file) => file.endsWith('.js'));

    for (const file of commandFiles) {

        const commandPath = join(__dirname, `../commands/${dir}/${file}`);
        const command = require(commandPath);

        if ('data' in command && 'run' in command) {
            commands.push(command.data.toJSON());
        } else {
            console.log(`[WARNING] Command at ${commandPath} is missing required properties "data" or "run" and couldn't be loaded!`.yellow);
        }

    }

}

const rest = new REST().setToken(TOKEN);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands`);

        const data = await rest.put(
            Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
            { body: commands }
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands`.green);
    } catch (err) {
        console.log('Couldn\'t reload application (/) commands!'.red, err);
    }
});