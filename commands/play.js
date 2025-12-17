const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const play = require("play-dl");
const { isSpotifyUrl } = require("../utils/spotify");
const { getQueue } = require("../utils/musicQueue");
const { playSong, connectToChannel } = require("../utils/musicPlayer");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Putar lagu dari YouTube atau judul lagu")
        .addStringOption((option) =>
            option
                .setName("query")
                .setDescription("Link YouTube atau judul lagu")
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply();

        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            const embed = new EmbedBuilder()
                .setColor("#ed4245")
                .setDescription("Kamu harus join voice channel dulu!");
            return interaction.editReply({ embeds: [embed] });
        }

        let query = interaction.options.getString("query");

        // Kalau Spotify URL, kasih tau user untuk pakai judul
        if (isSpotifyUrl(query)) {
            const embed = new EmbedBuilder()
                .setColor("#fee75c")
                .setDescription(
                    "Spotify link tidak didukung. Coba ketik judul lagunya langsung.\n\nContoh: `/play APT Bruno Mars`"
                );
            return interaction.editReply({ embeds: [embed] });
        }

        try {
            // Search on YouTube
            const searched = await play.search(query, { limit: 1 });
            if (searched.length === 0) {
                const embed = new EmbedBuilder()
                    .setColor("#ed4245")
                    .setDescription("Lagu tidak ditemukan.");
                return interaction.editReply({ embeds: [embed] });
            }

            const video = searched[0];
            const song = {
                title: video.title,
                artist: video.channel?.name || "Unknown",
                duration: video.durationRaw,
                thumbnail: video.thumbnails[0]?.url,
                url: video.url,
                requestedBy: interaction.user.id,
            };

            const queue = getQueue(interaction.guild.id);

            if (!queue.connection) {
                await connectToChannel(
                    voiceChannel,
                    interaction.channel,
                    interaction.guild.id
                );
            }

            queue.songs.push(song);

            if (!queue.playing) {
                playSong(interaction.guild.id, song);
                const embed = new EmbedBuilder()
                    .setColor("#1DB954")
                    .setDescription(`Playing **${song.title}**`);
                return interaction.editReply({ embeds: [embed] });
            } else {
                const embed = new EmbedBuilder()
                    .setColor("#5865f2")
                    .setTitle("Added to Queue")
                    .setDescription(`**${song.title}**`)
                    .setThumbnail(song.thumbnail)
                    .addFields(
                        { name: "Artist", value: song.artist, inline: true },
                        {
                            name: "Duration",
                            value: song.duration,
                            inline: true,
                        },
                        {
                            name: "Position",
                            value: `#${queue.songs.length}`,
                            inline: true,
                        }
                    );
                return interaction.editReply({ embeds: [embed] });
            }
        } catch (error) {
            console.error("Play error:", error);
            const embed = new EmbedBuilder()
                .setColor("#ed4245")
                .setDescription("Terjadi error saat memutar lagu.");
            return interaction.editReply({ embeds: [embed] });
        }
    },
};
