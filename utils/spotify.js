function isSpotifyUrl(url) {
    return (
        url.includes("spotify.com/track") || url.includes("open.spotify.com")
    );
}

function extractSpotifyId(url) {
    const match = url.match(/track\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
}

module.exports = { isSpotifyUrl, extractSpotifyId };
