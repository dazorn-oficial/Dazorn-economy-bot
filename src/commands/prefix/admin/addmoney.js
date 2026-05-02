const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../../utils/db');

module.exports = {
    name: 'addmoney',
    description: 'Añade dinero a un usuario (Solo Admins)',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply('❌ No tienes permisos de Administrador para usar este comando.');
        }

        const target = message.mentions.users.first();
        const amount = parseInt(args[1]);

        if (!target) return message.reply('❌ Debes mencionar a un usuario.');
        if (!amount || isNaN(amount) || amount <= 0) return message.reply('❌ Debes especificar una cantidad válida para añadir.');
        if (target.bot) return message.reply('❌ No puedes interactuar con bots.');

        const userData = db.getUser(target.id);
        userData.balance += amount;
        db.updateUser(target.id, userData);

        const embed = new EmbedBuilder()
            .setTitle('🛠️ Dinero Añadido')
            .setColor('Green')
            .setDescription(`Se han añadido **$${amount}** a la cuenta de ${target}.\nNuevo balance: **$${userData.balance}**`);

        await message.reply({ embeds: [embed] });
    }
};
