const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("halo")
        .setDescription("Salam dari bot"),

    async execute(interaction) {
        await interaction.reply({
            content: `👋 Halo ${interaction.user.username}!`,
        });
    },
};
