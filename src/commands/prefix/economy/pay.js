const { EmbedBuilder } = require('discord.js');
const db = require('../../../utils/db');

module.exports = {
    name: 'pay',
    description: 'Transfiere dinero a otro usuario',
    async execute(message, args) {
        const target = message.mentions.users.first();
        const amount = parseInt(args[1]);
        const senderId = message.author.id;

        if (!target) return message.reply('❌ Debes mencionar a un usuario.');
        if (!amount || isNaN(amount) || amount <= 0) return message.reply('❌ Debes especificar una cantidad válida.');
        
        if (target.bot) return message.reply('❌ No puedes pagar a los bots.');
        if (target.id === senderId) return message.reply('❌ No puedes pagarte a ti mismo.');

        const senderData = db.getUser(senderId);
        
        if (senderData.balance < amount) {
            return message.reply(`❌ No tienes suficiente dinero. Tu balance es de **$${senderData.balance}**.`);
        }

        const targetData = db.getUser(target.id);

        senderData.balance -= amount;
        targetData.balance += amount;

        db.updateUser(senderId, senderData);
        db.updateUser(target.id, targetData);

        const embed = new EmbedBuilder()
            .setTitle('💸 Transferencia Exitosa')
            .setColor('Green')
            .setDescription(`Has pagado **$${amount}** a ${target}.`);

        await message.reply({ embeds: [embed] });
    }
};
