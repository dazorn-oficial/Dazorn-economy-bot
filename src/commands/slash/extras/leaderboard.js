const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../../utils/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Muestra los usuarios con más dinero'),
    async execute(interaction) {
        const usersData = db.getUsers();
        
        // Convertir el objeto a array y ordenar por balance de mayor a menor
        const sortedUsers = Object.values(usersData)
            .sort((a, b) => b.balance - a.balance)
            .slice(0, 10); // Top 10

        if (sortedUsers.length === 0) {
            return interaction.reply({ content: 'No hay usuarios registrados en la economía todavía.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle('🏆 Leaderboard Global')
            .setColor('Gold');

        let description = '';
        for (let i = 0; i < sortedUsers.length; i++) {
            const user = sortedUsers[i];
            let userObj;
            try {
                // Intentar obtener el usuario de la caché del bot para mostrar su nombre real
                userObj = await interaction.client.users.fetch(user.id);
            } catch {
                userObj = { username: `Usuario Desconocido (${user.id})` };
            }
            
            description += `**${i + 1}.** ${userObj.username} - **$${user.balance}**\n`;
        }

        embed.setDescription(description);

        await interaction.reply({ embeds: [embed] });
    }
};
