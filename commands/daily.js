const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const economy = require("../utils/economy");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("daily")
        .setDescription("Klaim bonus harian kamu"),

    async execute(interaction) {
        const userId = interaction.user.id;
        const user = economy.getUser(userId);

        const now = Date.now();
        const cooldown = 24 * 60 * 60 * 1000; // 24 jam
        const timeLeft = user.lastDaily + cooldown - now;

        if (timeLeft > 0) {
            const hours = Math.floor(timeLeft / (60 * 60 * 1000));
            const minutes = Math.floor(
                (timeLeft % (60 * 60 * 1000)) / (60 * 1000)
            );

            const embed = new EmbedBuilder()
                .setColor("#ed4245")
                .setDescription(
                    `Kamu sudah klaim daily hari ini.\nCoba lagi dalam **${hours}h ${minutes}m**`
                );

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const reward = Math.floor(Math.random() * 500) + 500; // 500-1000
        economy.updateUser(userId, { lastDaily: now });
        const newUser = economy.addBalance(userId, reward);

        const embed = new EmbedBuilder()
            .setColor("#57f287")
            .setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL(),
            })
            .setDescription(
                `Kamu mendapat **${reward.toLocaleString()}** coins!`
            )
            .addFields({
                name: "Balance",
                value: `\`${newUser.balance.toLocaleString()}\` coins`,
                inline: true,
            })
            .setFooter({ text: "Daily reward" })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
