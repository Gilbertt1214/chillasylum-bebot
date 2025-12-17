const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { AudioPlayerStatus } = require("@discordjs/voice");
const { getQueue } = require("../utils/musicQueue");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pause")
        .setDescription("Pause lagu yang sedang diputar"),

    async execute(interaction) {
        const queue = getQueue(interaction.guild.id);

        if (!queue.player || !queue.playing) {
            const embed = new EmbedBuilder()
                .setColor("#ed4245")
                .setDescription("Tidak ada lagu yang sedang diputar.");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (queue.player.state.status === AudioPlayerStatus.Paused) {
            const embed = new EmbedBuilder()
                .setColor("#fee75c")
                .setDescription("Lagu sudah di-pause.");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        queue.player.pause();

        const embed = new EmbedBuilder()
            .setColor("#fee75c")
            .setDescription("⏸️ Lagu di-pause.");
        return interaction.reply({ embeds: [embed] });
    },
};
