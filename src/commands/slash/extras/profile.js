const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../../utils/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Muestra tu perfil básico'),
    async execute(interaction) {
        const userId = interaction.user.id;
        const userData = db.getUser(userId);

        const inventoryCount = userData.inventory ? userData.inventory.length : 0;

        const embed = new EmbedBuilder()
            .setTitle(`👤 Perfil de ${interaction.user.username}`)
            .setColor('Random')
            .setThumbnail(interaction.user.displayAvatarURL())
            .addFields(
                { name: '💰 Balance', value: `$${userData.balance}`, inline: true },
                { name: '🎒 Objetos en Inventario', value: `${inventoryCount}`, inline: true }
            );

        await interaction.reply({ embeds: [embed] });
    }
};
