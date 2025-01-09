const { Collection } = require('discord.js');
const { readdirSync } = require('fs');
const { join } = require('path');
require('colors');

module.exports = (client) => {

    client.commands = new Collection();

    const commandDirsPath = join(__dirname, '../commands/');
    const commandDirs = readdirSync(commandDirsPath);

    for (const dir of commandDirs) {

        const commandDirPath = join(__dirname, `../commands/${dir}`);
        const commandDir = readdirSync(commandDirPath);

        for (const file of commandDir) {

            const commandPath = join(__dirname, `../commands/${dir}/${file}`);
            const command = require(commandPath);

            if ('data' in command && 'run' in command) {
                client.commands.set(command.data.name, command);
            } else {
                console.log(`[WARNING] The command at ${filePath} is missing required properties "data" or "run" and couldn't be loaded!`);
            }

        }

    }

}