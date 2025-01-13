const { MessageFlags, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits } = require('discord.js');
const Ticket = require('../models/Ticket.js');
require('dotenv').config();

module.exports = {
    name: 'interactionCreate',
    async run(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const command = client.commands.get(interaction.commandName);

            if (!command)
                return interaction.reply({
                    ephemeral: true,
                    content: 'Commande introuvable.',
                });

            try {
                command.run(interaction, client);
            } catch (err) {
                interaction.reply({
                    ephemeral: true,
                    content:
                        'Une erreur est survenue lors de l\'exécution de la commande.',
                });
                console.error(err);
            }
        } else if (interaction.isButton()) {
            switch (interaction.customId) {
                case 'open-ticket':
                    const ticket = await Ticket.findOne({
                        user: interaction.user.id,
                    });

                    if (ticket)
                        return interaction.reply({
                            content: 'Vous ne pouvez créer qu\'un seul ticket à la fois !',
                            flags: MessageFlags.Ephemeral
                        });

                    const ticketCount = (await Ticket.countDocuments()) + 1;

                    try {
                        interaction.guild.channels.create({
                            name: `ticket-${ticketCount}`,
                            parent: process.env.TICKETS_CATEGORY,
                            type: ChannelType.GuildText
                        }).then(async (channel) => {
                            channel.permissionOverwrites.set(
                                [
                                    {
                                        id: interaction.guild.id,
                                        deny: [PermissionFlagsBits.ViewChannel]
                                    }, {
                                        id: interaction.user.id,
                                        allow: [PermissionFlagsBits.ViewChannel]
                                    }, {
                                        id: process.env.MOD_ROLE,
                                        allow: [PermissionFlagsBits.ViewChannel]
                                    }, {
                                        id: client.user.id,
                                        allow: [PermissionFlagsBits.ViewChannel]
                                    }
                                ]
                            );

                            channel.send({
                                embeds: [
                                    new EmbedBuilder()
                                        .setTitle(`ticket-${ticketCount}`)
                                        .setTimestamp()
                                        .setAuthor({
                                            name: interaction.user.username,
                                            iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                                        })
                                        .setDescription(`Bienvenue dans votre ticket ${interaction.user}.\nL'équipe de modération vous répondra dans les plus brefs délais.\nEn attendant, merci de nous décrire votre problème le plus en détails possible, afin que nous puissons vous aider au mieux.`)
                                        .setFooter({ text: 'Merci de ne pas mentionner le staff.' })
                                ],
                                components: [
                                    new ActionRowBuilder()
                                        .addComponents(
                                            new ButtonBuilder()
                                                .setCustomId('close-ticket')
                                                .setEmoji('🔒')
                                                .setLabel('Fermer le ticket')
                                                .setStyle(ButtonStyle.Danger)
                                        )
                                ]
                            });

                            await new Ticket({ channel: channel.id, user: interaction.user.id }).save();

                            interaction.reply({
                                content: `Votre ticket a été crée ${channel}`,
                                flags: MessageFlags.Ephemeral
                            });
                        });
                    } catch (err) {
                        interaction.reply({
                            content: 'Impossible d\'ouvrir votre ticket ! Veuillez contacter un administrateur.',
                            flags: MessageFlags.Ephemeral,
                        });
                    }

                    break;
                case 'close-ticket':
                    if (!interaction.member.permissions.has(PermissionFlagsBits.ManageMessages)) return interaction.reply({
                        content: 'Cette action est réservé aux modérateurs !',
                        flags: MessageFlags.ManageMessages
                    });

                    try {
                        await Ticket.deleteOne({ channel: interaction.channel.id });
                        await interaction.channel.delete();
                    } catch (err) {
                        console.log(err);
                        interaction.reply({
                            content: 'Impossible de supprimer le ticket ! Vérifiez mes permissions ou contacter un administrateur !',
                            flags: MessageFlags.Ephemeral
                        }).catch(() => {});
                    }

                    break;
            }
        }
    },
};
