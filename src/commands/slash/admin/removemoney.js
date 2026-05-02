const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../../utils/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removemoney')
        .setDescription('Quita dinero a un usuario (Solo Admins)')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addUserOption(option => 
            option.setName('usuario')
            .setDescription('El usuario al que quieres quitar dinero')
            .setRequired(true)
        )
        .addIntegerOption(option => 
            option.setName('cantidad')
            .setDescription('Cantidad de dinero a quitar')
            .setRequired(true)
            .setMinValue(1)
        ),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: '❌ No tienes permisos de Administrador para usar este comando.', ephemeral: true });
        }

        const target = interaction.options.getUser('usuario');
        const amount = interaction.options.getInteger('cantidad');

        if (target.bot) return interaction.reply({ content: '❌ No puedes interactuar con bots.', ephemeral: true });

        const userData = db.getUser(target.id);
        
        userData.balance -= amount;
        if (userData.balance < 0) userData.balance = 0; // Evitar balances negativos

        db.updateUser(target.id, userData);

        const embed = new EmbedBuilder()
            .setTitle('🛠️ Dinero Removido')
            .setColor('Red')
            .setDescription(`Se han quitado **$${amount}** de la cuenta de ${target}.\nNuevo balance: **$${userData.balance}**`);

        await interaction.reply({ embeds: [embed] });
    }
};
