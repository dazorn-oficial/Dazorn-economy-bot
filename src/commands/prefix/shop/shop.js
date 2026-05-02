const { EmbedBuilder } = require('discord.js');
const db = require('../../../utils/db');

module.exports = {
    name: 'shop',
    description: 'Muestra los objetos disponibles en la tienda',
    async execute(message, args) {
        const shop = db.getShop();

        if (shop.length === 0) {
            return message.reply('❌ La tienda está vacía en este momento.');
        }

        const embed = new EmbedBuilder()
            .setTitle('🛒 Tienda')
            .setColor('Purple')
            .setDescription('Usa `!buy <nombre_objeto>` para comprar.');

        shop.forEach(item => {
            embed.addFields({
                name: `${item.name} - $${item.price}`,
                value: item.description || 'Sin descripción'
            });
        });

        await message.reply({ embeds: [embed] });
    }
};
