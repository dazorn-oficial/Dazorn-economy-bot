const { EmbedBuilder } = require('discord.js');
const db = require('../../../utils/db');

module.exports = {
    name: 'inventory',
    description: 'Muestra tu inventario de objetos',
    async execute(message, args) {
        const userId = message.author.id;
        const userData = db.getUser(userId);

        const inventory = userData.inventory || [];

        if (inventory.length === 0) {
            return message.reply('🎒 Tu inventario está vacío.');
        }

        const counts = {};
        inventory.forEach(item => {
            counts[item] = (counts[item] || 0) + 1;
        });

        const itemsString = Object.keys(counts).map(key => `* **${key}** (x${counts[key]})`).join('\n');

        const embed = new EmbedBuilder()
            .setTitle('🎒 Inventario')
            .setColor('Blue')
            .setDescription(itemsString)
            .setThumbnail(message.author.displayAvatarURL());

        await message.reply({ embeds: [embed] });
    }
};
