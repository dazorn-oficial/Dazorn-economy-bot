const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../../utils/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setmoney')
        .setDescription('Establece el dinero exacto de un usuario (Solo Admins)')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option => 
            option.setName('usuario')
            .setDescription('El usuario a modificar')
            .setRequired(true)
        )
        .addIntegerOption(option => 
            option.setName('cantidad')
            .setDescription('Cantidad exacta de dinero')
            .setRequired(true)
            .setMinValue(0)
        ),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: '❌ No tienes permisos de Administrador para usar este comando.', ephemeral: true });
        }

        const target = interaction.options.getUser('usuario');
        const amount = interaction.options.getInteger('cantidad');

        if (target.bot) return interaction.reply({ content: '❌ No puedes interactuar con bots.', ephemeral: true });

        const userData = db.getUser(target.id);
        userData.balance = amount;
        db.updateUser(target.id, userData);

        const embed = new EmbedBuilder()
            .setTitle('🛠️ Dinero Establecido')
            .setColor('Blue')
            .setDescription(`El dinero de ${target} ha sido establecido a **$${amount}**.`);

        await interaction.reply({ embeds: [embed] });
    }
};
