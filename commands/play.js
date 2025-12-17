const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const play = require("play-dl");
const { getSpotifyTrack, isSpotifyUrl } = require("../utils/spotify");
const { getQueue } = require("../utils/musicQueue");
const { playSong, connectToChannel } = require("../utils/musicPlayer");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Putar lagu dari Spotify atau YouTube")
        .addStringOption((option) =>
            option
                .setName("query")
                .setDescription("Link Spotify/YouTube atau judul lagu")
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

        const query = interaction.options.getString("query");
        let songInfo = null;
        let searchQuery = query;

        // Check if Spotify URL
        if (isSpotifyUrl(query)) {
            const spotifyData = await getSpotifyTrack(query);
            if (!spotifyData) {
                const embed = new EmbedBuilder()
                    .setColor("#ed4245")
                    .setDescription("Gagal mengambil data dari Spotify.");
                return interaction.editReply({ embeds: [embed] });
            }
            searchQuery = spotifyData.query;
            songInfo = spotifyData;
        }

        try {
            // Search on YouTube
            const searched = await play.search(searchQuery, { limit: 1 });
            if (searched.length === 0) {
                const embed = new EmbedBuilder()
                    .setColor("#ed4245")
                    .setDescription("Lagu tidak ditemukan.");
                return interaction.editReply({ embeds: [embed] });
            }

            const video = searched[0];
            const song = {
                title: songInfo?.title || video.title,
                artist: songInfo?.artist || video.channel?.name || "Unknown",
                duration: songInfo?.duration || video.durationRaw,
                thumbnail: songInfo?.thumbnail || video.thumbnails[0]?.url,
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
