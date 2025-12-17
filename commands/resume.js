const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getKazagumo } = require("../utils/lavalink");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resume")
        .setDescription("Lanjutkan lagu yang di-pause"),

    async execute(interaction) {
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            const embed = new EmbedBuilder()
                .setColor("#ed4245")
                .setDescription("Kamu harus join voice channel dulu!");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const kazagumo = getKazagumo();
        const player = kazagumo?.players.get(interaction.guild.id);

        if (!player || !player.queue.current) {
            const embed = new EmbedBuilder()
                .setColor("#ed4245")
                .setDescription("Tidak ada lagu yang sedang diputar.");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        // Check if user is in the same voice channel as bot
        if (player.voiceId !== voiceChannel.id) {
            const embed = new EmbedBuilder()
                .setColor("#ed4245")
                .setDescription(
                    `Kamu harus join <#${player.voiceId}> untuk control musik.`
                );
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (!player.paused) {
            const embed = new EmbedBuilder()
                .setColor("#fee75c")
                .setDescription("Lagu tidak sedang di-pause.");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        try {
            player.pause(false);
        } catch (e) {
            console.error("Resume error:", e);
            const embed = new EmbedBuilder()
                .setColor("#ed4245")
                .setDescription("Gagal resume lagu.");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor("#1DB954")
            .setDescription("▶️ Lagu dilanjutkan.");
        return interaction.reply({ embeds: [embed] });
    },
};
