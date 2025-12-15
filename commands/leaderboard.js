const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const economy = require("../utils/economy");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("Lihat ranking user terkaya di server"),

    async execute(interaction) {
        await interaction.deferReply();

        const allUsers = economy.getAllUsers();
        const members = await interaction.guild.members.fetch();

        // Filter hanya member yang ada di server dan sort by balance
        const leaderboard = Object.entries(allUsers)
            .filter(([id]) => members.has(id))
            .sort((a, b) => b[1].balance - a[1].balance)
            .slice(0, 10);

        if (leaderboard.length === 0) {
            const embed = new EmbedBuilder()
                .setColor("#2b2d31")
                .setDescription("Belum ada data economy di server ini.");

            return interaction.editReply({ embeds: [embed] });
        }

        const medals = ["🥇", "🥈", "🥉"];
        const description = leaderboard
            .map(([id, data], index) => {
                const member = members.get(id);
                const medal = medals[index] || `\`${index + 1}.\``;
                return `${medal} ${
                    member?.user.tag || "Unknown"
                } — **${data.balance.toLocaleString()}** coins`;
            })
            .join("\n");

        const embed = new EmbedBuilder()
            .setColor("#f1c40f")
            .setTitle("Leaderboard")
            .setDescription(description)
            .setFooter({
                text: interaction.guild.name,
                iconURL: interaction.guild.iconURL(),
            })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },
};
