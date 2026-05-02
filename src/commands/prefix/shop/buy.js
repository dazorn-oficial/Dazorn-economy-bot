const { EmbedBuilder } = require('discord.js');
const db = require('../../../utils/db');

module.exports = {
    name: 'buy',
    description: 'Compra un objeto de la tienda',
    async execute(message, args) {
        if (!args.length) {
            return message.reply('❌ Debes especificar el nombre del objeto a comprar. Ejemplo: `!buy manzana`');
        }

        const itemName = args.join(' ').toLowerCase();
        const shop = db.getShop();
        const userId = message.author.id;
        
        const item = shop.find(i => i.name.toLowerCase() === itemName);

        if (!item) {
            return message.reply('❌ No se encontró ese objeto en la tienda.');
        }

        const userData = db.getUser(userId);

        if (userData.balance < item.price) {
            return message.reply(`❌ No tienes suficiente dinero. Necesitas **$${item.price}** y tienes **$${userData.balance}**.`);
        }

        userData.balance -= item.price;
        if (!userData.inventory) userData.inventory = [];
        userData.inventory.push(item.name);

        db.updateUser(userId, userData);

        const embed = new EmbedBuilder()
            .setTitle('🛍️ Compra Exitosa')
            .setColor('Green')
            .setDescription(`Has comprado **${item.name}** por **$${item.price}**.\nSe ha añadido a tu inventario.`);

        await message.reply({ embeds: [embed] });
    }
};
