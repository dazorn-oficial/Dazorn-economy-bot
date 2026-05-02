const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../../utils/db');

module.exports = {
    name: 'additem',
    description: 'Añade un nuevo objeto a la tienda (Solo Admins)',
    async execute(message, args) {
        if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return message.reply('❌ No tienes permisos de Administrador para usar este comando.');
        }

        // Parseo de argumentos manual ya que el formato sería: !additem "Nombre" precio "Descripción" o similar.
        // Para simplificar: !additem nombre | precio | descripción
        const input = args.join(' ').split('|').map(s => s.trim());
        
        if (input.length < 3) {
            return message.reply('❌ Formato incorrecto. Usa: `!additem Nombre | Precio | Descripción`\nEjemplo: `!additem Espada de Madera | 500 | Una espada básica.`');
        }

        const name = input[0];
        const price = parseInt(input[1]);
        const description = input[2];

        if (isNaN(price) || price <= 0) {
            return message.reply('❌ El precio debe ser un número válido mayor a 0.');
        }

        const shop = db.getShop();
        
        const existingItem = shop.find(i => i.name.toLowerCase() === name.toLowerCase());
        if (existingItem) {
            return message.reply(`❌ Ya existe un objeto llamado **${name}** en la tienda.`);
        }

        shop.push({
            name: name,
            price: price,
            description: description
        });

        db.saveShop(shop);

        const embed = new EmbedBuilder()
            .setTitle('🛠️ Objeto Añadido')
            .setColor('Green')
            .addFields(
                { name: 'Nombre', value: name, inline: true },
                { name: 'Precio', value: `$${price}`, inline: true },
                { name: 'Descripción', value: description, inline: false }
            );

        await message.reply({ embeds: [embed] });
    }
};
