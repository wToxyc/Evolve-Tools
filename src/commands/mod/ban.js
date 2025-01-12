const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const User = require('../../models/User.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Banni un membre du serveur')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('L\'utilisateur à bannir')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('La raison du bannissement')
        ),
    async run(interaction) {
        const user = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'Aucune raison spéfiée';

        const member = interaction.guild.members.cache.get(user.id);

        if (member.id === interaction.user.id || member.id === '1318266861003210822' || member.roles.highest.comparePositionTo(interaction.member.roles.highest) >= 0) {
            return interaction.reply({
                content: 'Vous ne pouvez pas bannir cet utilisateur !',
                flags: MessageFlags.Ephemeral
            });
        }

        try {
            await member.ban({ reason: reason });
            interaction.reply(`**${user.username}** a été banni pour **${reason}**`);

            let userData = await User.findOne({ id: user.id });
            if (!userData) {
                userData = new User({ id: user.id });
            }

            userData.sanctions.push({
                mod: interaction.user.id,
                date: Date.now(),
                reason: reason,
                type: 'ban'
            });

            await userData.save();

            member.send(`Vous avez banni de **${interaction.guild.name}** pour **${reason}**.`).catch(() => {});
        } catch (err) {
            interaction.reply({
                content: 'Impossible de bannir cet utilisateur. Vérifiez mes permissions ou contacter un administrateur.',
                flags: MessageFlags.Ephemeral
            });
        }
    }
}