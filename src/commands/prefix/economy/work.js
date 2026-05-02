const { EmbedBuilder } = require('discord.js');
const db = require('../../../utils/db');

module.exports = {
    name: 'work',
    description: 'Trabaja para ganar dinero extra',
    async execute(message, args) {
        const userId = message.author.id;
        const userData = db.getUser(userId);

        const now = Date.now();
        const cooldownAmount = 60 * 60 * 1000; // 1 hora

        if (userData.cooldowns && userData.cooldowns.work) {
            const expirationTime = userData.cooldowns.work + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000 / 60;
                return message.reply(`⏳ Estás cansado. Tienes que esperar **${timeLeft.toFixed(1)} minutos** para volver a trabajar.`);
            }
        }

        const reward = Math.floor(Math.random() * (200 - 50 + 1)) + 50;
        
        userData.balance += reward;
        if (!userData.cooldowns) userData.cooldowns = {};
        userData.cooldowns.work = now;

        db.updateUser(userId, userData);

        const embed = new EmbedBuilder()
            .setTitle('👷 ¡Buen trabajo!')
            .setColor('Blue')
            .setDescription(`Has trabajado duro y ganaste **$${reward}**.`);

        await message.reply({ embeds: [embed] });
    }
};
