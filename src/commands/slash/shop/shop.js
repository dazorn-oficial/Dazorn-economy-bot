const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../../utils/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shop')
        .setDescription('Muestra los objetos disponibles en la tienda'),
    async execute(interaction) {
        const shop = db.getShop();

        if (shop.length === 0) {
            return interaction.reply({ content: '❌ La tienda está vacía en este momento.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle('🛒 Tienda')
            .setColor('Purple')
            .setDescription('Usa `/buy <nombre_objeto>` para comprar.');

        shop.forEach(item => {
            embed.addFields({
                name: `${item.name} - $${item.price}`,
                value: item.description || 'Sin descripción'
            });
        });

        await interaction.reply({ embeds: [embed] });
    }
};
