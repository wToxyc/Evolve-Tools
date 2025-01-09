const { readdirSync } = require('fs');
const { join } = require('path');

module.exports = (client) => {

    const eventsPath = join(__dirname, '../events');
    const eventFiles = readdirSync(eventsPath).filter((file) => file.endsWith('.js'));

    for (const file of eventFiles) {

        const filePath = join(__dirname, `../events/${file}`);
        const event = require(filePath);

        if (event.once) {
            client.once(event.name, (...args) => event.run(...args, client));
        } else {
            client.on(event.name, (...args) => event.run(...args, client));
        }

    }

}