const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const economy = require("../utils/economy");

const jobs = [
    { name: "Programmer", min: 100, max: 300 },
    { name: "Designer", min: 80, max: 250 },
    { name: "Driver Ojol", min: 50, max: 150 },
    { name: "Barista", min: 60, max: 180 },
    { name: "Content Creator", min: 100, max: 400 },
    { name: "Guru Les", min: 70, max: 200 },
    { name: "Freelancer", min: 90, max: 350 },
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName("work")
        .setDescription("Kerja untuk mendapatkan coins"),

    async execute(interaction) {
        const userId = interaction.user.id;
        const user = economy.getUser(userId);

        const now = Date.now();
        const cooldown = 30 * 60 * 1000; // 30 menit
        const timeLeft = user.lastWork + cooldown - now;

        if (timeLeft > 0) {
            const minutes = Math.floor(timeLeft / (60 * 1000));
            const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);

            const embed = new EmbedBuilder()
                .setColor("#ed4245")
                .setDescription(
                    `Kamu masih capek.\nIstirahat dulu **${minutes}m ${seconds}s**`
                );

            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const job = jobs[Math.floor(Math.random() * jobs.length)];
        const reward =
            Math.floor(Math.random() * (job.max - job.min + 1)) + job.min;

        economy.updateUser(userId, { lastWork: now });
        const newUser = economy.addBalance(userId, reward);

        const embed = new EmbedBuilder()
            .setColor("#57f287")
            .setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.displayAvatarURL(),
            })
            .setDescription(
                `Kamu bekerja sebagai **${
                    job.name
                }** dan mendapat **${reward.toLocaleString()}** coins!`
            )
            .addFields({
                name: "Balance",
                value: `\`${newUser.balance.toLocaleString()}\` coins`,
                inline: true,
            })
            .setFooter({ text: "Work reward" })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
