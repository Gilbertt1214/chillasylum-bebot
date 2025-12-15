const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

function getCompatibility(member1, member2) {
    const data1 =
        member1.user.username.length + (member1.roles.cache.size || 0);
    const data2 =
        member2.user.username.length + (member2.roles.cache.size || 0);
    const seed = (data1 + data2) * 12345;
    const random = Math.sin(seed) * 10000;
    return Math.floor((random - Math.floor(random)) * 100) + 1;
}

function createProgressBar(percentage) {
    const filled = Math.round(percentage / 10);
    const empty = 10 - filled;
    return "▰".repeat(filled) + "▱".repeat(empty);
}

function getShipMessage(percentage) {
    if (percentage >= 90) return "Bucin tingkat dewa, siap nikah!";
    if (percentage >= 70) return "Udah cocok, tinggal pdkt aja";
    if (percentage >= 50) return "Masih ada harapan nih";
    if (percentage >= 30) return "Butuh usaha lebih bro";
    return "Mending cari yang lain";
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ship")
        .setDescription("Cek compatibility antara 2 member")
        .addUserOption((option) =>
            option
                .setName("user1")
                .setDescription("Member pertama")
                .setRequired(true)
        )
        .addUserOption((option) =>
            option
                .setName("user2")
                .setDescription("Member kedua")
                .setRequired(true)
        ),

    async execute(interaction) {
        await interaction.deferReply();

        try {
            const guild = interaction.guild;
            const user1Id = interaction.options.getUser("user1").id;
            const user2Id = interaction.options.getUser("user2").id;

            const member1 = await guild.members
                .fetch(user1Id)
                .catch(() => null);
            const member2 = await guild.members
                .fetch(user2Id)
                .catch(() => null);

            if (!member1 || !member2) {
                return await interaction.editReply({
                    content: "User tidak ditemukan di server ini.",
                });
            }

            if (user1Id === user2Id) {
                return await interaction.editReply({
                    content: "Pilih 2 user yang berbeda.",
                });
            }

            const compatibility = getCompatibility(member1, member2);
            const progressBar = createProgressBar(compatibility);
            const message = getShipMessage(compatibility);

            let color = "#2b2d31";
            if (compatibility >= 70) color = "#ed4245";
            else if (compatibility >= 50) color = "#fee75c";
            else if (compatibility >= 30) color = "#5865f2";

            const embed = new EmbedBuilder()
                .setColor(color)
                .setTitle("Love Meter 💕")
                .addFields(
                    {
                        name: "Match",
                        value: `${member1.displayName} 💖 ${member2.displayName}`,
                        inline: false,
                    },
                    {
                        name: "Compatibility",
                        value: `${progressBar} **${compatibility}%**`,
                        inline: false,
                    },
                    {
                        name: "Result",
                        value: message,
                        inline: false,
                    }
                )
                .setFooter({
                    text: `Requested by ${interaction.user.username}`,
                })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.editReply({
                content: "Terjadi error saat memproses command.",
            });
        }
    },
};
