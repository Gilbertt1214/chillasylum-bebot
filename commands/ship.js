const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

// Fungsi untuk membuat ship name
function createShipName(name1, name2) {
    const firstName1 = name1.slice(0, Math.ceil(name1.length / 2));
    const lastName2 = name2.slice(Math.floor(name2.length / 2));
    return firstName1 + lastName2;
}

// Fungsi untuk generate compatibility percentage based on member data
function getCompatibility(member1, member2) {
    const data1 =
        member1.user.username.length + (member1.roles.cache.size || 0);
    const data2 =
        member2.user.username.length + (member2.roles.cache.size || 0);
    const seed = (data1 + data2) * 12345;
    const random = Math.sin(seed) * 10000;
    const compatibility = Math.floor((random - Math.floor(random)) * 100) + 1;
    return compatibility;
}

// Fungsi untuk membuat progress bar sederhana
function createSimpleProgressBar(percentage) {
    const filled = Math.round(percentage / 10);
    const empty = 10 - filled;
    return "|".repeat(filled) + " ".repeat(empty);
}

// Fungsi untuk membuat hearts visualization
function getHearts(percentage) {
    const hearts = Math.ceil(percentage / 10);
    return "❤️".repeat(hearts);
}

// Fungsi untuk mendapatkan pesan berdasarkan compatibility
function getShipMessage(percentage) {
    if (percentage >= 90) return "INI MAH JODOH DARI LAHIR!🎊";
    if (percentage >= 80) return "Pernikahan dijamin lancar!💒";
    if (percentage >= 70) return "Match yang sangat sempurna!✨";
    if (percentage >= 60) return "Couple goals material!💑";
    if (percentage >= 50) return "Ada kesempatan jadi jodoh!🍀";
    if (percentage >= 40) return "Masih bisa dicoba sih...🤔";
    if (percentage >= 30) return "Hmm... agak susah deh 😅";
    if (percentage >= 20) return "Kayaknya enggak cocok deh 😢";
    return "Maaf, ini bukan pasangan mu 💔";
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ship")
        .setDescription("Ship compatibility antara 2 member server")
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

            // Fetch users saja, tidak perlu fetch semua
            const member1 = await guild.members
                .fetch(user1Id)
                .catch(() => null);
            const member2 = await guild.members
                .fetch(user2Id)
                .catch(() => null);

            if (!member1 || !member2) {
                return await interaction.editReply({
                    content:
                        "❌ Salah satu atau kedua user tidak ada di server ini!",
                });
            }

            // Check apakah sama
            if (user1Id === user2Id) {
                return await interaction.editReply({
                    content: "❌ User harus berbeda!",
                });
            }

            const shipName = createShipName(
                member1.user.username,
                member2.user.username
            );
            const compatibility = getCompatibility(member1, member2);
            const simpleBar = createSimpleProgressBar(compatibility);
            const hearts = getHearts(compatibility);
            const shipMessage = getShipMessage(compatibility);

            // Color berdasarkan compatibility
            let color = "#808080"; // grey
            if (compatibility >= 80) color = "#FF1744"; // red
            else if (compatibility >= 60) color = "#FF69B4"; // pink
            else if (compatibility >= 40) color = "#FFC0CB"; // light pink
            else if (compatibility >= 20) color = "#FFB6C1"; // light pink

            const embed = new EmbedBuilder()
                .setColor(color)
                .setTitle("❤️ Love Meter")
                .setDescription(
                    `<@${member1.id}> ❤️ <@${member2.id}>\n\n\`KECOCOCOKAN: ${compatibility}% ${simpleBar}\`\n\n${hearts}\n\n${shipMessage}`
                )
                .setFooter({
                    text: `🔔 Semoga berjodoh ya! • Today at ${new Date().toLocaleTimeString(
                        "en-US",
                        { hour: "2-digit", minute: "2-digit" }
                    )}`,
                    iconURL: interaction.user.displayAvatarURL({
                        dynamic: true,
                    }),
                });

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error(error);
            await interaction.editReply({
                content: "❌ Ada error saat memproses command!",
            });
        }
    },
};
