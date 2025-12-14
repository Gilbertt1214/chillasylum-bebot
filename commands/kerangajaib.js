const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("kerangajaib")
        .setDescription("Tanya kerang ajaib untuk mendapat jawaban!")
        .addStringOption((option) =>
            option
                .setName("pertanyaan")
                .setDescription("Pertanyaan yang ingin kamu tanyakan")
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply();

        const pertanyaan = interaction.options.getString("pertanyaan");

        const answers = [
            "Ya",
            "Tidak",
            "Mungkin",
            "Tentu saja",
            "Tidak mungkin",
            "Coba lagi nanti",
            "Pasti",
            "Jangan harap",
            "Bisa jadi",
            "Sangat yakin",
        ];

        const randomAnswer =
            answers[Math.floor(Math.random() * answers.length)];

        const embed = new EmbedBuilder()
            .setColor("#FF69B4")
            .setTitle("Puja Kerang Ajaib 🐚")
            .setThumbnail(
                "https://s.kaskus.id/images/2019/01/26/10116215_20190126084453.png"
            )
            .addFields(
                { name: "Pertanyaan ❓", value: pertanyaan },
                { name: "Jawaban", value: `**${randomAnswer}**` }
            )
            .setFooter({
                text: `🐚 by ${interaction.guild.name}`,
                iconURL: interaction.guild.iconURL({ dynamic: true }),
            });

        await interaction.editReply({ embeds: [embed] });
    },
};
