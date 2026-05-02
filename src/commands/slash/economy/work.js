const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../../utils/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('work')
        .setDescription('Trabaja para ganar dinero extra'),
    async execute(interaction) {
        const userId = interaction.user.id;
        const userData = db.getUser(userId);

        const now = Date.now();
        const cooldownAmount = 60 * 60 * 1000; // 1 hora en milisegundos

        if (userData.cooldowns && userData.cooldowns.work) {
            const expirationTime = userData.cooldowns.work + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000 / 60;
                return interaction.reply({ 
                    content: `⏳ Estás cansado. Tienes que esperar **${timeLeft.toFixed(1)} minutos** para volver a trabajar.`, 
                    ephemeral: true 
                });
            }
        }

        // Cantidad aleatoria entre 50 y 200
        const reward = Math.floor(Math.random() * (200 - 50 + 1)) + 50;
        
        userData.balance += reward;
        if (!userData.cooldowns) userData.cooldowns = {};
        userData.cooldowns.work = now;

        db.updateUser(userId, userData);

        const embed = new EmbedBuilder()
            .setTitle('👷 ¡Buen trabajo!')
            .setColor('Blue')
            .setDescription(`Has trabajado duro y ganaste **$${reward}**.`);

        await interaction.reply({ embeds: [embed] });
    }
};
