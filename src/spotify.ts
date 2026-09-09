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

export async function getLastActivity(accessToken: string): Promise<TrackActivity> {
    const headers = { Authorization: `Bearer ${accessToken}` };

    try {
        const res = await fetch('https://api.spotify.com/v1/me/player/currently-playing', { headers });
        console.log(`[SPOTIFY DEBUG] currently-playing HTTP: ${res.status}`);

        if (res.status === 200) {
            const data = await res.json();
            console.log(`[SPOTIFY DEBUG] is_playing: ${data?.is_playing}, item: ${data?.item?.name}`);
            if (data && data.is_playing && data.item) {
                const track = data.item;
                const img = track.album?.images?.[0]?.url;
                return {
                    status: 'NOW_PLAYING',
                    title: track.name,
                    artist: track.artists.map((a: { name: string }) => a.name).join(', '),
                    album: track.album.name,
                    albumArtBase64: img ? await imageToBase64(img) : null
                };
            }
        } else {
            const text = await res.text();
            console.log(`[SPOTIFY DEBUG] currently-playing body: ${text}`);
        }
    } catch (err) {
        console.error('[SPOTIFY DEBUG] Error currently-playing:', err);
    }

    try {
        const res = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=1', { headers });
        console.log(`[SPOTIFY DEBUG] recently-played HTTP: ${res.status}`);

        if (res.status === 200) {
            const data = await res.json();
            console.log(`[SPOTIFY DEBUG] recently-played items count: ${data?.items?.length}`);
            if (data.items && data.items.length > 0) {
                const track = data.items[0].track;
                const img = track.album?.images?.[0]?.url;
                return {
                    status: 'LAST_PLAYED',
                    title: track.name,
                    artist: track.artists.map((a: { name: string }) => a.name).join(', '),
                    album: track.album.name,
                    albumArtBase64: img ? await imageToBase64(img) : null
                };
            }
        } else {
            const text = await res.text();
            console.log(`[SPOTIFY DEBUG] recently-played body: ${text}`);
        }
    } catch (err) {
        console.error('[SPOTIFY DEBUG] Error recently-played:', err);
    }

    return {
        status: 'OFFLINE',
        title: 'No recent track',
        artist: 'Spotify',
        album: 'N/A',
        albumArtBase64: null
    };
}