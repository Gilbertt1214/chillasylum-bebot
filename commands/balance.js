const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const economy = require("../utils/economy");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("balance")
        .setDescription("Cek saldo kamu atau user lain")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("User yang ingin dicek saldonya")
                .setRequired(false)
        ),

    async execute(interaction) {
        const targetUser =
            interaction.options.getUser("user") || interaction.user;
        const user = economy.getUser(targetUser.id);

        const embed = new EmbedBuilder()
            .setColor("#2b2d31")
            .setAuthor({
                name: targetUser.tag,
                iconURL: targetUser.displayAvatarURL(),
            })
            .addFields({
                name: "Balance",
                value: `\`${user.balance.toLocaleString()}\` coins`,
            })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
