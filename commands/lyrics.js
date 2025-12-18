const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getKazagumo } = require("../utils/lavalink");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("lyrics")
        .setDescription("Lirik lagu yang sedang diputar"),

    async execute(interaction) {
        await interaction.deferReply();

        const kazagumo = getKazagumo();
        const player = kazagumo?.players.get(interaction.guild.id);

        if (!player || !player.queue.current) {
            const embed = new EmbedBuilder()
                .setColor("#ed4245")
                .setDescription("Tidak ada lagu yang sedang diputar.");
            return interaction.editReply({ embeds: [embed] });
        }

        const current = player.queue.current;
        const searchQuery = `${current.title} ${current.author}`
            .replace(/\(.*?\)|\[.*?\]/g, "")
            .trim();

        try {
            // Use lyrics.ovh API (free, no key needed)
            const searchUrl = `https://api.lyrics.ovh/suggest/${encodeURIComponent(
                searchQuery
            )}`;
            const searchRes = await fetch(searchUrl);
            const searchData = await searchRes.json();

            if (!searchData.data || searchData.data.length === 0) {
                const embed = new EmbedBuilder()
                    .setColor("#ed4245")
                    .setDescription(
                        `Lirik tidak ditemukan untuk: **${searchQuery}**`
                    );
                return interaction.editReply({ embeds: [embed] });
            }

            const song = searchData.data[0];
            const lyricsUrl = `https://api.lyrics.ovh/v1/${encodeURIComponent(
                song.artist.name
            )}/${encodeURIComponent(song.title)}`;
            const lyricsRes = await fetch(lyricsUrl);
            const lyricsData = await lyricsRes.json();

            if (!lyricsData.lyrics) {
                const embed = new EmbedBuilder()
                    .setColor("#ed4245")
                    .setDescription(
                        `Lirik tidak ditemukan untuk: **${song.title}**`
                    );
                return interaction.editReply({ embeds: [embed] });
            }

            let lyrics = lyricsData.lyrics.trim();

            // Truncate if too long (Discord embed limit)
            if (lyrics.length > 4000) {
                lyrics =
                    lyrics.substring(0, 4000) + "\n\n... (lirik terpotong)";
            }

            const embed = new EmbedBuilder()
                .setColor("#5865F2")
                .setAuthor({ name: "🎤 Lyrics" })
                .setTitle(`${song.title} - ${song.artist.name}`)
                .setDescription(lyrics)
                .setThumbnail(song.album?.cover_medium || null)
                .setFooter({
                    text: `Requested by ${interaction.user.username}`,
                });

            return interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error("Lyrics error:", error);
            const embed = new EmbedBuilder()
                .setColor("#ed4245")
                .setDescription("Gagal mencari lirik. Coba lagi nanti.");
            return interaction.editReply({ embeds: [embed] });
        }
    },
};
