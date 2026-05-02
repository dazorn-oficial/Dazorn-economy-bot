const { EmbedBuilder } = require('discord.js');
const db = require('../../../utils/db');

module.exports = {
    name: 'balance',
    description: 'Muestra el dinero tuyo o de otro usuario',
    async execute(message, args) {
        let target = message.mentions.users.first() || message.author;
        const userData = db.getUser(target.id);

        const embed = new EmbedBuilder()
            .setTitle(`💰 Balance de ${target.username}`)
            .setColor('Green')
            .setDescription(`**Dinero actual:** $${userData.balance}`)
            .setThumbnail(target.displayAvatarURL());

        await message.reply({ embeds: [embed] });
    }
};
