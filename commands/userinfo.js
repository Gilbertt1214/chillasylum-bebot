const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("userinfo")
        .setDescription("Lihat informasi tentang user")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("User yang ingin dilihat infonya")
                .setRequired(false)
        ),

    async execute(interaction) {
        const user = interaction.options.getUser("user") || interaction.user;
        const member = await interaction.guild.members
            .fetch(user.id)
            .catch(() => null);

        const createdAt = `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`;
        const joinedAt = member
            ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>`
            : "-";

        const roles = member
            ? member.roles.cache
                  .filter((r) => r.id !== interaction.guild.id)
                  .sort((a, b) => b.position - a.position)
                  .map((r) => r.toString())
                  .slice(0, 5)
                  .join(" ") || "-"
            : "-";

        const roleCount = member ? member.roles.cache.size - 1 : 0;

        const badges = [];
        const flags = user.flags?.toArray() || [];
        if (flags.includes("Staff")) badges.push("Discord Staff");
        if (flags.includes("Partner")) badges.push("Partner");
        if (flags.includes("HypeSquadOnlineHouse1")) badges.push("Bravery");
        if (flags.includes("HypeSquadOnlineHouse2")) badges.push("Brilliance");
        if (flags.includes("HypeSquadOnlineHouse3")) badges.push("Balance");
        if (flags.includes("PremiumEarlySupporter"))
            badges.push("Early Supporter");
        if (flags.includes("ActiveDeveloper")) badges.push("Active Developer");
        if (user.bot) badges.push("Bot");

        const embed = new EmbedBuilder()
            .setColor(
                member?.displayHexColor !== "#000000"
                    ? member?.displayHexColor
                    : "#2b2d31"
            )
            .setAuthor({
                name: user.tag,
                iconURL: user.displayAvatarURL({ size: 64 }),
            })
            .setThumbnail(user.displayAvatarURL({ size: 256, dynamic: true }))
            .addFields(
                {
                    name: "User",
                    value: [
                        `ID: \`${user.id}\``,
                        `Created: ${createdAt}`,
                        badges.length ? `Badges: ${badges.join(", ")}` : null,
                    ]
                        .filter(Boolean)
                        .join("\n"),
                    inline: true,
                },
                {
                    name: "Member",
                    value: [
                        `Nickname: ${member?.nickname || "-"}`,
                        `Joined: ${joinedAt}`,
                        `Roles: ${roleCount}`,
                    ].join("\n"),
                    inline: true,
                },
                {
                    name: `Top Roles`,
                    value: roles,
                    inline: false,
                }
            )
            .setFooter({ text: `Requested by ${interaction.user.username}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
