const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../../utils/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pay')
        .setDescription('Transfiere dinero a otro usuario')
        .addUserOption(option => 
            option.setName('usuario')
            .setDescription('El usuario al que quieres pagar')
            .setRequired(true)
        )
        .addIntegerOption(option => 
            option.setName('cantidad')
            .setDescription('Cantidad de dinero a transferir')
            .setRequired(true)
            .setMinValue(1)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('usuario');
        const amount = interaction.options.getInteger('cantidad');
        const senderId = interaction.user.id;

        if (target.bot) {
            return interaction.reply({ content: '❌ No puedes pagar a los bots.', ephemeral: true });
        }
        if (target.id === senderId) {
            return interaction.reply({ content: '❌ No puedes pagarte a ti mismo.', ephemeral: true });
        }

        const senderData = db.getUser(senderId);
        
        if (senderData.balance < amount) {
            return interaction.reply({ content: `❌ No tienes suficiente dinero. Tu balance es de **$${senderData.balance}**.`, ephemeral: true });
        }

        const targetData = db.getUser(target.id);

        // Realizar la transferencia
        senderData.balance -= amount;
        targetData.balance += amount;

        db.updateUser(senderId, senderData);
        db.updateUser(target.id, targetData);

        const embed = new EmbedBuilder()
            .setTitle('💸 Transferencia Exitosa')
            .setColor('Green')
            .setDescription(`Has pagado **$${amount}** a ${target}.`);

        await interaction.reply({ embeds: [embed] });
    }
};
