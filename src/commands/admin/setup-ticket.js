const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-ticket')
        .setDescription('Met en place le système de ticket')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option =>
            option
                .setName('channel')
                .setDescription('Le salon dans lequel vous souhaitez mettre en place le système de ticket')
        ),
    async run(interaction) {
        const channel = interaction.options.getChannel('channel') || interaction.channel;
        try {
            await channel.send({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Tickets')
                        .setDescription('Cliquez sur le bouton ci-dessous 👇 pour contacter l\'équipe de modération.')
                ],
                components: [
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('open-ticket')
                                .setEmoji('📩')
                                .setLabel('Ouvrir un ticket')
                                .setStyle(ButtonStyle.Primary)
                        )
                ]
            });

            interaction.reply({
                content: 'Le système de ticket a étés mis en place.',
                flags: MessageFlags.Ephemeral
            });
        } catch (err) {
            console.log(err);
            interaction.reply({
                content: 'Impossible de mettre en place le système de ticket dans ce salon ! Vérifiez mes permissions ou contacter un administrateur.',
                flags: MessageFlags.Ephemeral
            });
        }
    }
}