const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('Vérouille un salon')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addChannelOption(option =>
            option
                .setName('channel')
                .setDescription('Le salon à vérouiller')
        ),
    async run(interaction) {
        const channel = interaction.options.getChannel('channel') || interaction.channel;

        try {
            await channel.permissionOverwrites.edit(interaction.guild.id, {
                SendMessages: false
            });
            interaction.reply('Salon vérouillé.');
        } catch (err) {
            interaction.reply({
                ephemeral: true,
                content: 'Impossible de vérouiller ce salon. Vérifiez mes permissions ou contacter un administrateur.'
            });
        }
    }
}