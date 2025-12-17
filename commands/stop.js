const {
    SlashCommandBuilder,
    EmbedBuilder,
    MessageFlags,
} = require("discord.js");
const { getKazagumo } = require("../utils/lavalink");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("stop")
        .setDescription("Stop musik dan keluar dari voice channel"),

    async execute(interaction) {
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            const embed = new EmbedBuilder()
                .setColor("#ed4245")
                .setDescription("Kamu harus join voice channel dulu!");
            return interaction.reply({
                embeds: [embed],
                flags: MessageFlags.Ephemeral,
            });
        }

        const kazagumo = getKazagumo();
        const player = kazagumo?.players.get(interaction.guild.id);

        if (!player) {
            const embed = new EmbedBuilder()
                .setColor("#ed4245")
                .setDescription("Bot tidak sedang memutar musik.");
            return interaction.reply({
                embeds: [embed],
                flags: MessageFlags.Ephemeral,
            });
        }

        // Check if user is in the same voice channel as bot
        if (player.voiceId !== voiceChannel.id) {
            const embed = new EmbedBuilder()
                .setColor("#ed4245")
                .setDescription(
                    `Kamu harus join <#${player.voiceId}> untuk control musik.`
                );
            return interaction.reply({
                embeds: [embed],
                flags: MessageFlags.Ephemeral,
            });
        }

        try {
            player.destroy();
        } catch (e) {
            console.error("Stop error:", e);
        }

        const embed = new EmbedBuilder()
            .setColor("#ed4245")
            .setDescription("⏹️ Musik dihentikan dan bot keluar.");
        return interaction.reply({ embeds: [embed] });
    },
};
