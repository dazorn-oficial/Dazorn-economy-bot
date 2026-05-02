const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../../utils/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addmoney')
        .setDescription('Añade dinero a un usuario (Solo Admins)')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option => 
            option.setName('usuario')
            .setDescription('El usuario al que quieres añadir dinero')
            .setRequired(true)
        )
        .addIntegerOption(option => 
            option.setName('cantidad')
            .setDescription('Cantidad de dinero a añadir')
            .setRequired(true)
            .setMinValue(1)
        ),
    async execute(interaction) {
        // Verificación extra de permisos por si acaso
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: '❌ No tienes permisos de Administrador para usar este comando.', ephemeral: true });
        }

        const target = interaction.options.getUser('usuario');
        const amount = interaction.options.getInteger('cantidad');

        if (target.bot) {
            return interaction.reply({ content: '❌ No puedes interactuar con bots.', ephemeral: true });
        }

        const userData = db.getUser(target.id);
        userData.balance += amount;
        db.updateUser(target.id, userData);

        const embed = new EmbedBuilder()
            .setTitle('🛠️ Dinero Añadido')
            .setColor('Green')
            .setDescription(`Se han añadido **$${amount}** a la cuenta de ${target}.\nNuevo balance: **$${userData.balance}**`);

        await interaction.reply({ embeds: [embed] });
    }
};
