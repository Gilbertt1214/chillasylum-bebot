const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { hasVoted } = require("../utils/topgg");
const { addCoins, getBalance } = require("../utils/economy");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("vote")
        .setDescription("Vote bot di Top.gg dan dapatkan reward!"),

    async execute(interaction) {
        await interaction.deferReply();

        const userId = interaction.user.id;

        try {
            // Check if user has voted
            const voted = await hasVoted(userId);

            if (voted) {
                // Give reward
                const reward = 500; // 500 coins per vote
                await addCoins(userId, reward);
                const newBalance = await getBalance(userId);

                const embed = new EmbedBuilder()
                    .setColor("#FFD700")
                    .setTitle("🎉 Terima kasih sudah vote!")
                    .setDescription(
                        `Kamu mendapat **${reward} coins** sebagai reward!\n\n` +
                            `💰 Balance sekarang: **${newBalance} coins**`,
                    )
                    .setFooter({
                        text: "Vote lagi dalam 12 jam untuk reward lagi!",
                    })
                    .setTimestamp();

                return interaction.editReply({ embeds: [embed] });
            } else {
                // User hasn't voted
                const botId = interaction.client.user.id;
                const voteUrl = `https://top.gg/bot/${botId}/vote`;

                const embed = new EmbedBuilder()
                    .setColor("#5865F2")
                    .setTitle("📊 Vote untuk Bot!")
                    .setDescription(
                        `Vote bot di Top.gg dan dapatkan **500 coins** sebagai reward!\n\n` +
                            `Kamu bisa vote setiap 12 jam.`,
                    )
                    .addFields({
                        name: "🔗 Link Vote",
                        value: `[Klik disini untuk vote](${voteUrl})`,
                    })
                    .setFooter({
                        text: "Setelah vote, gunakan /vote lagi untuk claim reward",
                    })
                    .setTimestamp();

                return interaction.editReply({ embeds: [embed] });
            }
        } catch (error) {
            console.error("Vote command error:", error);

            // Fallback if Top.gg API not configured
            const botId = interaction.client.user.id;
            const voteUrl = `https://top.gg/bot/${botId}/vote`;

            const embed = new EmbedBuilder()
                .setColor("#5865F2")
                .setTitle("📊 Vote untuk Bot!")
                .setDescription(
                    `Vote bot di Top.gg untuk support development!\n\n` +
                        `Vote setiap 12 jam untuk membantu bot grow.`,
                )
                .addFields({
                    name: "🔗 Link Vote",
                    value: `[Klik disini untuk vote](${voteUrl})`,
                })
                .setFooter({ text: "Terima kasih atas supportnya!" })
                .setTimestamp();

            return interaction.editReply({ embeds: [embed] });
        }
    },
};
