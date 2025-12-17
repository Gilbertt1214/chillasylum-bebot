const { getData } = require("spotify-url-info");

async function getSpotifyTrack(url) {
    try {
        const data = await getData(url);

        if (data.type === "track") {
            return {
                title: data.name,
                artist: data.artists.map((a) => a.name).join(", "),
                duration: formatDuration(data.duration_ms),
                thumbnail: data.coverArt?.sources?.[0]?.url || null,
                query: `${data.name} ${data.artists[0].name}`,
            };
        }
        return null;
    } catch (error) {
        console.error("Spotify error:", error);
        return null;
    }
}

function isSpotifyUrl(url) {
    return (
        url.includes("spotify.com/track") || url.includes("open.spotify.com")
    );
}

function formatDuration(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

module.exports = { getSpotifyTrack, isSpotifyUrl };
