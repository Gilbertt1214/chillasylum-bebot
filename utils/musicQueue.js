const { Collection } = require("discord.js");

const queues = new Collection();

function getQueue(guildId) {
    if (!queues.has(guildId)) {
        queues.set(guildId, {
            songs: [],
            playing: false,
            connection: null,
            player: null,
            textChannel: null,
            voiceChannel: null,
        });
    }
    return queues.get(guildId);
}

function deleteQueue(guildId) {
    queues.delete(guildId);
}

module.exports = { getQueue, deleteQueue };
