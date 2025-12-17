const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getQueue } = require("../utils/musicQueue");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("queue")
        .setDescription("Lihat daftar antrian lagu"),

    async execute(interaction) {
        const queue = getQueue(interaction.guild.id);

        if (queue.songs.length === 0) {
            const embed = new EmbedBuilder()
                .setColor("#2b2d31")
                .setDescription("Queue kosong.");
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const current = queue.songs[0];
        const upcoming = queue.songs.slice(1, 11);

        let description = `**Now Playing:**\n[${current.title}](${current.url}) - ${current.duration}\n\n`;

        if (upcoming.length > 0) {
            description += "**Up Next:**\n";
            upcoming.forEach((song, index) => {
                description += `\`${index + 1}.\` ${song.title} - ${
                    song.duration
                }\n`;
            });
        }

        if (queue.songs.length > 11) {
            description += `\n...dan ${queue.songs.length - 11} lagu lainnya`;
        }

        const embed = new EmbedBuilder()
            .setColor("#1DB954")
            .setTitle("Music Queue")
            .setDescription(description)
            .setThumbnail(current.thumbnail)
            .setFooter({ text: `Total: ${queue.songs.length} lagu` });

        return interaction.reply({ embeds: [embed] });
    },
};
