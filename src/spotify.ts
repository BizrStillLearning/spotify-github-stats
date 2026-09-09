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
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        return `data:${contentType};base64,${base64}`;
    } catch {
        return null;
    }
}

export async function getLastActivity(accessToken: string): Promise<TrackActivity> {
    const headers = {
        Authorization: `Bearer ${accessToken}`
    };

    try {
        const currentRes = await fetch('https://api.spotify.com/v1/me/player/currently-playing', { headers });

        if (currentRes.status === 200) {
            const data = await currentRes.json();
            if (data && data.is_playing && data.item) {
                const track = data.item;
                const albumImg = track.album?.images?.[0]?.url;
                const albumArtBase64 = albumImg ? await imageToBase64(albumImg) : null;

                return {
                    status: 'NOW_PLAYING',
                    title: track.name,
                    artist: track.artists.map((a: { name: string }) => a.name).join(', '),
                    album: track.album.name,
                    albumArtBase64
                };
            }
        }
    } catch (err) {
        console.warn('Gagal membaca currently-playing, fallback ke recently-played:', err);
    }

    const recentRes = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=1', { headers });

    if (recentRes.status === 200) {
        const data = await recentRes.json();
        if (data.items && data.items.length > 0) {
            const track = data.items[0].track;
            const albumImg = track.album?.images?.[0]?.url;
            const albumArtBase64 = albumImg ? await imageToBase64(albumImg) : null;

            return {
                status: 'LAST_PLAYED',
                title: track.name,
                artist: track.artists.map((a: { name: string }) => a.name).join(', '),
                album: track.album.name,
                albumArtBase64
            };
        }
    }

    return {
        status: 'OFFLINE',
        title: 'No recent track',
        artist: 'Spotify',
        album: 'N/A',
        albumArtBase64: null
    };
}