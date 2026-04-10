const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

// Helper: Get status emoji based on ping
function getStatusEmoji(ping) {
    if (ping < 100) return "gacor gelo mantap"; // Excellent
    if (ping < 200) return "okelah"; // Good
    if (ping < 400) return "lumayan"; // Fair
    return "lag parah cuy"; // Poor
}

// Helper: Format uptime
function formatUptime(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));

    const parts = [];
    if (days > 0) parts.push(`${days}d`);
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (seconds > 0) parts.push(`${seconds}s`);

    return parts.join(" ") || "0s";
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Cek latency bot dan status koneksi"),

    async execute(interaction) {
        // Timestamp awal
        const startTime = Date.now();

        // Kirim reply awal
        await interaction.deferReply();

        // Hitung roundtrip latency (lebih akurat)
        const roundtripLatency = Date.now() - startTime;

        // WebSocket ping (Discord API)
        const wsPing = interaction.client.ws.ping;

        // Shard info (jika bot menggunakan sharding)
        const shardId = interaction.guild?.shardId ?? 0;
        const totalShards = interaction.client.shard?.count ?? 1;

        // Uptime
        const uptime = formatUptime(interaction.client.uptime);

        // Memory usage
        const memUsage = process.memoryUsage();
        const memUsed = (memUsage.heapUsed / 1024 / 1024).toFixed(2);
        const memTotal = (memUsage.heapTotal / 1024 / 1024).toFixed(2);

        // Status emojis
        const roundtripStatus = getStatusEmoji(roundtripLatency);
        const wsStatus = getStatusEmoji(wsPing);

        // Build embed
        const embed = new EmbedBuilder()
            .setColor(
                wsPing < 100
                    ? "#57F287"
                    : wsPing < 200
                      ? "#FEE75C"
                      : wsPing < 400
                        ? "#F26522"
                        : "#ED4245",
            )
            .setTitle("🏓 Pong!")
            .setDescription("Status koneksi dan performa bot")
            .addFields(
                {
                    name: `${roundtripStatus} Roundtrip Latency`,
                    value: `\`${roundtripLatency}ms\``,
                    inline: true,
                },
                {
                    name: `${wsStatus} WebSocket Ping`,
                    value: `\`${wsPing}ms\``,
                    inline: true,
                },
                {
                    name: " Uptime",
                    value: `\`${uptime}\``,
                    inline: true,
                },
                {
                    name: " Memory Usage",
                    value: `\`${memUsed}MB / ${memTotal}MB\``,
                    inline: true,
                },
                {
                    name: " Shard",
                    value: `\`${shardId + 1} / ${totalShards}\``,
                    inline: true,
                },
                {
                    name: "Servers",
                    value: `\`${interaction.client.guilds.cache.size}\``,
                    inline: true,
                },
            )
            .setFooter({
                text: `Requested by ${interaction.user.username}`,
                iconURL: interaction.user.displayAvatarURL(),
            })
            .setTimestamp();

        // Edit reply dengan embed
        await interaction.editReply({ embeds: [embed] });
    },
};
