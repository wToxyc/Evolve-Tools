const { Client, GatewayIntentBits } = require('discord.js');
const { readdirSync } = require('fs');
const { join } = require('path');
require('dotenv').config();
const TOKEN = process.env.TOKEN;
require('colors');

const client = new Client({
    intents: Object.values(GatewayIntentBits)
});

const handlersPath = join(__dirname, '/handlers/');
const handlerFiles = readdirSync(handlersPath).filter((file) => file.endsWith('.js'));

for (const file of handlerFiles) {

    const handlerPath = join(__dirname, `/handlers/${file}`);
    const handler = require(handlerPath);

    try {
        handler(client);
    } catch (err) {
        console.log(`[FATAL] Failed to run handler at ${handlerPath}!`.red, err);
    }
    
}

client.login(TOKEN);