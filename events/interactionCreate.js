module.exports = {
    name: "interactionCreate",
    async execute(interaction) {
        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(
            interaction.commandName
        );

        if (!command) {
            console.error(
                `Command tidak ditemukan: ${interaction.commandName}`
            );
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            const errorReply = {
                content: "❌ Ada error saat menjalankan command!",
                flags: 64, // ephemeral flag
            };

            try {
                if (interaction.replied) {
                    await interaction.followUp(errorReply);
                } else if (interaction.deferred) {
                    await interaction.editReply(errorReply);
                } else {
                    await interaction.reply(errorReply);
                }
            } catch (replyError) {
                console.error("Error saat send error message:", replyError);
            }
        }
    },
};
