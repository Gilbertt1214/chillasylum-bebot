const { REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = async (client) => {
    const commandsPath = path.join(__dirname, "..", "commands");
    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith(".js"));

    const commands = [];

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        // Clear cache untuk reload command
        delete require.cache[require.resolve(filePath)];
        const command = require(filePath);

        // Hanya deploy slash commands
        if ("data" in command && "execute" in command && !command.prefix) {
            commands.push(command.data.toJSON());
            console.log(`  📝 Preparing: /${command.data.name}`);
        }
    }

    const rest = new REST({ version: "10" }).setToken(
        process.env.DISCORD_TOKEN
    );

    try {
        // Deploy ke setiap guild (instant update)
        const guilds = client.guilds.cache;

        console.log(
            `\n🔄 Deploy ${commands.length} slash commands ke ${guilds.size} server...`
        );

        for (const [guildId, guild] of guilds) {
            try {
                const result = await rest.put(
                    Routes.applicationGuildCommands(client.user.id, guildId),
                    { body: commands }
                );
                console.log(
                    `✅ ${result.length} commands deployed ke: ${guild.name}`
                );
            } catch (err) {
                console.error(`❌ Gagal deploy ke ${guild.name}:`, err.message);
            }
        }

        console.log(`\n✅ Selesai deploy slash commands!`);
    } catch (error) {
        console.error("❌ Error deploying commands:", error);
    }
};
