const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getBotStats } = require("../utils/topgg");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("botstats")
        .setDescription("Lihat statistik bot dari Top.gg"),

    async execute(interaction) {
        await interaction.deferReply();

        const botId = interaction.client.user.id;

        try {
            const stats = await getBotStats(botId);

            if (!stats) {
                const embed = new EmbedBuilder()
                    .setColor("#ed4245")
                    .setDescription(
                        "❌ Tidak bisa mengambil stats dari Top.gg.\n" +
                            "Bot mungkin belum terdaftar di Top.gg.",
                    );
                return interaction.editReply({ embeds: [embed] });
            }

            const embed = new EmbedBuilder()
                .setColor("#FF3366")
                .setTitle(`📊 ${stats.username} Stats`)
                .setThumbnail(
                    `https://cdn.discordapp.com/avatars/${botId}/${interaction.client.user.avatar}.png`,
                )
                .setDescription(stats.shortdesc || "No description")
                .addFields(
                    {
                        name: "👥 Servers",
                        value: `${stats.server_count?.toLocaleString() || "N/A"}`,
                        inline: true,
                    },
                    {
                        name: "⬆️ Monthly Votes",
                        value: `${stats.monthlyPoints?.toLocaleString() || "0"}`,
                        inline: true,
                    },
                    {
                        name: "⭐ Total Votes",
                        value: `${stats.points?.toLocaleString() || "0"}`,
                        inline: true,
                    },
                )
                .addFields({
                    name: "🔗 Links",
                    value:
                        `[Top.gg Page](https://top.gg/bot/${botId}) • ` +
                        `[Vote](https://top.gg/bot/${botId}/vote)` +
                        (stats.invite ? ` • [Invite](${stats.invite})` : "") +
                        (stats.support
                            ? ` • [Support Server](${stats.support})`
                            : ""),
                })
                .setFooter({
                    text: `Bot ID: ${botId}`,
                })
                .setTimestamp();

            if (stats.tags && stats.tags.length > 0) {
                embed.addFields({
                    name: "🏷️ Tags",
                    value: stats.tags.join(", "),
                });
            }

            return interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error("Botstats command error:", error);

            const embed = new EmbedBuilder()
                .setColor("#ed4245")
                .setDescription(
                    "❌ Terjadi error saat mengambil stats.\n" +
                        `Error: ${error.message}`,
                );
            return interaction.editReply({ embeds: [embed] });
        }
    },
};
