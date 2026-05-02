const { EmbedBuilder } = require('discord.js');
const db = require('../../../utils/db');

module.exports = {
    name: 'leaderboard',
    description: 'Muestra los usuarios con más dinero',
    async execute(message, args) {
        const usersData = db.getUsers();
        
        const sortedUsers = Object.values(usersData)
            .sort((a, b) => b.balance - a.balance)
            .slice(0, 10);

        if (sortedUsers.length === 0) {
            return message.reply('No hay usuarios registrados en la economía todavía.');
        }

        const embed = new EmbedBuilder()
            .setTitle('🏆 Leaderboard Global')
            .setColor('Gold');

        let description = '';
        for (let i = 0; i < sortedUsers.length; i++) {
            const user = sortedUsers[i];
            let userObj;
            try {
                userObj = await message.client.users.fetch(user.id);
            } catch {
                userObj = { username: `Usuario Desconocido (${user.id})` };
            }
            
            description += `**${i + 1}.** ${userObj.username} - **$${user.balance}**\n`;
        }

        embed.setDescription(description);

        await message.reply({ embeds: [embed] });
    }
};
