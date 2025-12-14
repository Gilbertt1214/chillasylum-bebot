const deployCommands = require("../utils/deployCommands");

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        console.log(`✅ Bot login sebagai ${client.user.tag}`);
        console.log(
            `📊 Bot siap melayani di ${client.guilds.cache.size} server`
        );

        // Deploy slash commands ke Discord
        await deployCommands(client);
    },
};
