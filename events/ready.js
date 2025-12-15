const deployCommands = require("../utils/deployCommands");

module.exports = {
    name: "clientReady",
    once: true,
    async execute(client) {
        console.log(`✅ Bot login sebagai ${client.user.tag}`);
        console.log(
            `📊 Bot siap melayani di ${client.guilds.cache.size} server`
        );

        // Fetch semua member di setiap guild
        for (const guild of client.guilds.cache.values()) {
            try {
                await guild.members.fetch();
                console.log(
                    `📥 Fetched ${guild.memberCount} members dari ${guild.name}`
                );
            } catch (err) {
                console.error(
                    `❌ Gagal fetch members dari ${guild.name}:`,
                    err.message
                );
            }
        }

        // Deploy slash commands ke Discord
        await deployCommands(client);
    },
};
