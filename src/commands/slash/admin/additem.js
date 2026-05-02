const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../../utils/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('additem')
        .setDescription('Añade un nuevo objeto a la tienda (Solo Admins)')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option => 
            option.setName('nombre')
            .setDescription('Nombre del objeto')
            .setRequired(true)
        )
        .addIntegerOption(option => 
            option.setName('precio')
            .setDescription('Precio del objeto')
            .setRequired(true)
            .setMinValue(1)
        )
        .addStringOption(option => 
            option.setName('descripcion')
            .setDescription('Descripción del objeto')
            .setRequired(true)
        ),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return interaction.reply({ content: '❌ No tienes permisos de Administrador para usar este comando.', ephemeral: true });
        }

        const name = interaction.options.getString('nombre');
        const price = interaction.options.getInteger('precio');
        const description = interaction.options.getString('descripcion');

        const shop = db.getShop();
        
        // Verificar si ya existe
        const existingItem = shop.find(i => i.name.toLowerCase() === name.toLowerCase());
        if (existingItem) {
            return interaction.reply({ content: `❌ Ya existe un objeto llamado **${name}** en la tienda.`, ephemeral: true });
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

        await interaction.reply({ embeds: [embed] });
    }
};
