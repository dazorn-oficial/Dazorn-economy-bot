const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../../utils/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('inventory')
        .setDescription('Muestra tu inventario de objetos'),
    async execute(interaction) {
        const userId = interaction.user.id;
        const userData = db.getUser(userId);

        const inventory = userData.inventory || [];

        if (inventory.length === 0) {
            return interaction.reply({ content: '🎒 Tu inventario está vacío.', ephemeral: true });
        }

        // Contar los objetos repetidos
        const counts = {};
        inventory.forEach(item => {
            counts[item] = (counts[item] || 0) + 1;
        });

        const itemsString = Object.keys(counts).map(key => `* **${key}** (x${counts[key]})`).join('\n');

        const embed = new EmbedBuilder()
            .setTitle('🎒 Inventario')
            .setColor('Blue')
            .setDescription(itemsString)
            .setThumbnail(interaction.user.displayAvatarURL());

        await interaction.reply({ embeds: [embed] });
    }
};
