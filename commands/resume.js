const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { AudioPlayerStatus } = require("@discordjs/voice");
const { getQueue } = require("../utils/musicQueue");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Lanjutkan lagu yang di-pause"),

    async execute(interaction) {
        const queue = getQueue(interaction.guild.id);

        if (!queue.player || !queue.playing) {
            const embed = new EmbedBuilder()
                .setColor("#ed4245")
                .setDescription("Tidak ada lagu yang sedang diputar.");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (queue.player.state.status !== AudioPlayerStatus.Paused) {
            const embed = new EmbedBuilder()
                .setColor("#fee75c")
                .setDescription("Lagu tidak sedang di-pause.");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        queue.player.unpause();

        const embed = new EmbedBuilder()
            .setColor("#1DB954")
            .setDescription("▶️ Lagu dilanjutkan.");
        return interaction.reply({ embeds: [embed] });
    },
};
