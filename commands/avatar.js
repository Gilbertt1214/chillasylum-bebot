const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("Lihat avatar user dalam ukuran besar")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("User yang ingin dilihat avatarnya")
                .setRequired(false)
        ),

    async execute(interaction) {
        const user = interaction.options.getUser("user") || interaction.user;

        const formats = ["png", "jpg", "webp"];
        if (user.avatar?.startsWith("a_")) formats.push("gif");

        const links = formats
            .map(
                (f) =>
                    `[${f.toUpperCase()}](${user.displayAvatarURL({
                        extension: f,
                        size: 1024,
                    })})`
            )
            .join(" | ");

        const embed = new EmbedBuilder()
            .setColor("#2b2d31")
            .setAuthor({
                name: user.tag,
                iconURL: user.displayAvatarURL({ size: 64 }),
            })
            .setDescription(`Download: ${links}`)
            .setImage(user.displayAvatarURL({ size: 1024, dynamic: true }))
            .setFooter({ text: `Requested by ${interaction.user.username}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
