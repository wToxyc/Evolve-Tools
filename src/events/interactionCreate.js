module.exports = {
    name: 'interactionCreate',
    run(interaction, client) {
        if (interaction.isChatInputCommand()) {

            const command = client.commands.get(interaction.commandName);

            if (!command) return interaction.reply({ ephemeral: true, content: 'Commande introuvable.'});

            try {
                command.run(interaction, client);
            } catch (err) {
                interaction.reply({ ephemeral: true, content: 'Une erreur est survenue lors de l\'exécution de la commande.' });
                console.error(err);
            }

        }
    }
}