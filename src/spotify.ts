export interface TrackActivity {
    status: 'NOW_PLAYING' | 'LAST_PLAYED' | 'OFFLINE';
    title: string;
    artist: string;
    album: string;
    albumArtBase64: string | null;
}

async function imageToBase64(imageUrl: string): Promise<string | null> {
    try {
        const response = await fetch(imageUrl);
        if (!response.ok) return null;

        const contentType = response.headers.get('content-type') || '';
        if (!contentType.startsWith('image/')) return null;

        const arrayBuffer = await response.arrayBuffer();
        return `data:${contentType};base64,${Buffer.from(arrayBuffer).toString('base64')}`;
    } catch {
        return null;
    }
}

export async function getLastActivity(apiKey: string, username: string): Promise<TrackActivity> {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${encodeURIComponent(
        username
    )}&api_key=${encodeURIComponent(apiKey)}&format=json&limit=1`;

    try {
        const res = await fetch(url);
        if (!res.ok) {
            console.error(`[LASTFM ERROR] HTTP status: ${res.status}`);
            return getFallback();
        }

        const data = await res.json();
        const tracks = data?.recenttracks?.track;

        if (!tracks || tracks.length === 0) {
            return getFallback();
        }

        const currentTrack = Array.isArray(tracks) ? tracks[0] : tracks;
        const isNowPlaying = currentTrack['@attr']?.nowplaying === 'true';

        const images = currentTrack.image || [];
        const coverObj = images.find((img: { size: string }) => img.size === 'extralarge')
            || images.find((img: { size: string }) => img.size === 'large')
            || images[images.length - 1];

        const coverUrl = coverObj?.['#text'];
        const albumArtBase64 = coverUrl ? await imageToBase64(coverUrl) : null;

        return {
            status: isNowPlaying ? 'NOW_PLAYING' : 'LAST_PLAYED',
            title: currentTrack.name || 'Unknown Track',
            artist: currentTrack.artist?.['#text'] || currentTrack.artist?.name || 'Unknown Artist',
            album: currentTrack.album?.['#text'] || 'Unknown Album',
            albumArtBase64
        };
    } catch (err) {
        console.error('[LASTFM ERROR]', err);
        return getFallback();
    }
}

function getFallback(): TrackActivity {
    return {
        status: 'OFFLINE',
        title: 'No recent track',
        artist: 'Spotify',
        album: 'N/A',
        albumArtBase64: null
    };
}