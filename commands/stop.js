const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getQueue, deleteQueue } = require("../utils/musicQueue");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Stop musik dan clear queue"),

    async execute(interaction) {
        const queue = getQueue(interaction.guild.id);

        if (!queue.connection) {
            const embed = new EmbedBuilder()
                .setColor("#ed4245")
                .setDescription("Bot tidak sedang memutar musik.");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        queue.songs = [];
        if (queue.player) queue.player.stop();
        if (queue.connection) queue.connection.destroy();
        deleteQueue(interaction.guild.id);

        const embed = new EmbedBuilder()
            .setColor("#ed4245")
            .setDescription("⏹️ Musik dihentikan dan queue di-clear.");
        return interaction.reply({ embeds: [embed] });
    },
};
