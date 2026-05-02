const { EmbedBuilder } = require('discord.js');
const db = require('../../../utils/db');

module.exports = {
    name: 'daily',
    description: 'Reclama tu recompensa diaria',
    async execute(message, args) {
        const userId = message.author.id;
        const userData = db.getUser(userId);

        const now = Date.now();
        const cooldownAmount = 24 * 60 * 60 * 1000; // 24 horas

        if (userData.cooldowns && userData.cooldowns.daily) {
            const expirationTime = userData.cooldowns.daily + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000 / 60 / 60;
                return message.reply(`⏳ Tienes que esperar **${timeLeft.toFixed(1)} horas** para volver a reclamar tu recompensa.`);
            }
        }

        const reward = 500;
        userData.balance += reward;
        
        if (!userData.cooldowns) userData.cooldowns = {};
        userData.cooldowns.daily = now;

        db.updateUser(userId, userData);

        const embed = new EmbedBuilder()
            .setTitle('🎁 Recompensa Diaria')
            .setColor('Gold')
            .setDescription(`Has reclamado tu recompensa de **$${reward}**.\nVuelve en 24 horas para más.`);

        await message.reply({ embeds: [embed] });
    }
};
