const play = require("play-dl");

async function getSpotifyTrack(url) {
    try {
        // Coba pakai play-dl untuk Spotify
        if (play.sp_validate(url) === "track") {
            const spotifyData = await play.spotify(url);
            return {
                title: spotifyData.name,
                artist: spotifyData.artists.map((a) => a.name).join(", "),
                duration: formatDuration(spotifyData.durationInMs),
                thumbnail: spotifyData.thumbnail?.url || null,
                query: `${spotifyData.name} ${spotifyData.artists[0].name}`,
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
