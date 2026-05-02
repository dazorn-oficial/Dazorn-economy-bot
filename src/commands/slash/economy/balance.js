const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const db = require('../../../utils/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('balance')
        .setDescription('Muestra el dinero tuyo o de otro usuario')
        .addUserOption(option => 
            option.setName('usuario')
            .setDescription('Usuario del que quieres ver el dinero')
            .setRequired(false)
        ),
    async execute(interaction) {
        const target = interaction.options.getUser('usuario') || interaction.user;
        const userData = db.getUser(target.id);

        const embed = new EmbedBuilder()
            .setTitle(`💰 Balance de ${target.username}`)
            .setColor('Green')
            .setDescription(`**Dinero actual:** $${userData.balance}`)
            .setThumbnail(target.displayAvatarURL());

        await interaction.reply({ embeds: [embed] });
    }
};
