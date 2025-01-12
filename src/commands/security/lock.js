const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');

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

        if (!channel.permissionsFor(interaction.guild.id).has(PermissionFlagsBits.SendMessages)) {
            return interaction.reply({
                content: 'Ce salon est déjà vérouillé !',
                flags: MessageFlags.Ephemeral
            });
        }

        try {
            await channel.permissionOverwrites.edit(interaction.guild.id, {
                SendMessages: false
            });
            interaction.reply('Salon vérouillé.');
        } catch (err) {
            interaction.reply({
                flags: MessageFlags.Ephemeral,
                content: 'Impossible de vérouiller ce salon. Vérifiez mes permissions ou contacter un administrateur.'
            });
        }
    }
}