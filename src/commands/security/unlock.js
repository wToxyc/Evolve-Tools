const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('Dévérouille un salon')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addChannelOption(option =>
            option
                .setName('channel')
                .setDescription('Le salon à dévérouiller')
        ),
    async run(interaction) {
        const channel = interaction.options.getChannel('channel') || interaction.channel;

        try {
            await channel.permissionOverwrites.edit(interaction.guild.id, {
                SendMessages: null
            });
            interaction.reply('Salon dévérouillé.');
        } catch (err) {
            interaction.reply({
                ephemeral: true,
                content: 'Impossible de dévérouiller ce salon. Vérifiez mes permissions ou contacter un administrateur.'
            });
        }
    }
}