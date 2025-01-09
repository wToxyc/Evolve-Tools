const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Affiche la latence du bot'),
    run(interaction) {
        interaction.reply({ content: '🏓 Pong !', withResponse: true }).then(async (i) => {
            const ping = await i.resource.message.createdTimestamp - interaction.createdTimestamp;
            interaction.editReply(`🏓 Pong !\nLatence du bot : ${ping}ms\nLatence de l'API : ${interaction.client.ws.ping}ms`);
        });
    }
}