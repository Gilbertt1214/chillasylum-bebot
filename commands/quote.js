const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("quote")
        .setDescription("Random quote inspiratif"),

    async execute(interaction) {
        await interaction.deferReply();

        try {
            const res = await fetch(
                "https://quotes.liupurnomo.com/api/quotes/random"
            );
            const data = await res.json();

            if (!data || !data.quote) {
                const embed = new EmbedBuilder()
                    .setColor("#ed4245")
                    .setDescription("Gagal mendapatkan quote.");
                return interaction.editReply({ embeds: [embed] });
            }

            const embed = new EmbedBuilder()
                .setColor("#5865F2")
                .setDescription(`*"${data.quote}"*`)
                .setFooter({ text: `— ${data.author || "Unknown"}` });

            return interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error("Quote error:", error);
            const embed = new EmbedBuilder()
                .setColor("#ed4245")
                .setDescription("Gagal mendapatkan quote. Coba lagi nanti.");
            return interaction.editReply({ embeds: [embed] });
        }
    },
};
