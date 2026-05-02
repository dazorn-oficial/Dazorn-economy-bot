const { EmbedBuilder } = require('discord.js');
const db = require('../../../utils/db');

module.exports = {
    name: 'profile',
    description: 'Muestra tu perfil básico',
    async execute(message, args) {
        const userId = message.author.id;
        const userData = db.getUser(userId);

        const inventoryCount = userData.inventory ? userData.inventory.length : 0;

        const embed = new EmbedBuilder()
            .setTitle(`👤 Perfil de ${message.author.username}`)
            .setColor('Random')
            .setThumbnail(message.author.displayAvatarURL())
            .addFields(
                { name: '💰 Balance', value: `$${userData.balance}`, inline: true },
                { name: '🎒 Objetos en Inventario', value: `${inventoryCount}`, inline: true }
            );

        await message.reply({ embeds: [embed] });
    }
};
