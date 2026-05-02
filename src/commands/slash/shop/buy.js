const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../../utils/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('buy')
        .setDescription('Compra un objeto de la tienda')
        .addStringOption(option => 
            option.setName('objeto')
            .setDescription('El nombre del objeto que quieres comprar')
            .setRequired(true)
        ),
    async execute(interaction) {
        const itemName = interaction.options.getString('objeto').toLowerCase();
        const shop = db.getShop();
        const userId = interaction.user.id;
        
        const item = shop.find(i => i.name.toLowerCase() === itemName);

        if (!item) {
            return interaction.reply({ content: '❌ No se encontró ese objeto en la tienda.', ephemeral: true });
        }

        const userData = db.getUser(userId);

        if (userData.balance < item.price) {
            return interaction.reply({ content: `❌ No tienes suficiente dinero. Necesitas **$${item.price}** y tienes **$${userData.balance}**.`, ephemeral: true });
        }

        // Realizar la compra
        userData.balance -= item.price;
        if (!userData.inventory) userData.inventory = [];
        userData.inventory.push(item.name);

        db.updateUser(userId, userData);

        const embed = new EmbedBuilder()
            .setTitle('🛍️ Compra Exitosa')
            .setColor('Green')
            .setDescription(`Has comprado **${item.name}** por **$${item.price}**.\nSe ha añadido a tu inventario.`);

        await interaction.reply({ embeds: [embed] });
    }
};
