const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Cek latency bot secara akurat"),

    async execute(interaction) {
        // Mulai timer (high resolution)
        const start = process.hrtime();

        // Kirim reply awal
        const msg = await interaction.reply({
            content: "Menghitung ping...",
            fetchReply: true,
        });

        // Ambil selisih waktu
        const diff = process.hrtime(start);

        // Convert ke milisecond
        const latency = diff[0] * 1000 + diff[1] / 1e6;

        // API ping (WebSocket Discord)
        const apiPing = interaction.client.ws.ping;

        // Edit pesan dengan hasil
        await interaction.editReply({
            content: `🏓 Pong!
        Latency Bot: ${latency.toFixed(2)} ms
        API Ping: ${apiPing} ms`,
        });
    },
};
