const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getQueue } = require("../utils/musicQueue");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skip lagu yang sedang diputar"),

    async execute(interaction) {
        const queue = getQueue(interaction.guild.id);

        if (!queue.player || queue.songs.length === 0) {
            const embed = new EmbedBuilder()
                .setColor("#ed4245")
                .setDescription("Tidak ada lagu yang sedang diputar.");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const skipped = queue.songs[0];
        queue.player.stop();

        const embed = new EmbedBuilder()
            .setColor("#5865f2")
            .setDescription(`⏭️ Skipped **${skipped.title}**`);
        return interaction.reply({ embeds: [embed] });
    },
};
