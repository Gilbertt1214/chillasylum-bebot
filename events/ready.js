const deployCommands = require("../utils/deployCommands");

module.exports = {
    name: "clientReady",
    once: true,
    async execute(client) {

        // Fetch semua member di setiap guild
        for (const guild of client.guilds.cache.values()) {
            try {
                await guild.members.fetch();
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
