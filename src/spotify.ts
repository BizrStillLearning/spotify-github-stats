export interface TrackItem {
    title: string;
    artist: string;
    album: string;
    albumArtBase64: string | null;
    isPlaying: boolean;
}

export interface AlbumItem {
    title: string;
    artist: string;
    albumArtBase64: string | null;
    url: string;
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

export async function getRecentTracks(apiKey: string, username: string, limit = 8): Promise<TrackItem[]> {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${encodeURIComponent(
        username
    )}&api_key=${encodeURIComponent(apiKey)}&format=json&limit=${limit}`;

    try {
        const res = await fetch(url);
        if (!res.ok) {
            console.error(`[LASTFM ERROR] HTTP status: ${res.status}`);
            return [];
        }

        const data = await res.json();
        const rawTracks = data?.recenttracks?.track;
        if (!rawTracks) return [];

        const trackList = Array.isArray(rawTracks) ? rawTracks : [rawTracks];

        const tracks: TrackItem[] = await Promise.all(
            trackList.slice(0, limit).map(async (item: any) => {
                const isPlaying = item['@attr']?.nowplaying === 'true';
                const images = item.image || [];
                const coverObj = images.find((img: { size: string }) => img.size === 'medium') || images[0];
                const coverUrl = coverObj?.['#text'];
                const albumArtBase64 = coverUrl ? await imageToBase64(coverUrl) : null;

                return {
                    title: item.name || 'Unknown Track',
                    artist: item.artist?.['#text'] || item.artist?.name || 'Unknown Artist',
                    album: item.album?.['#text'] || 'Unknown Album',
                    albumArtBase64,
                    isPlaying
                };
            })
        );

        return tracks;
    } catch (err) {
        console.error('[LASTFM ERROR getRecentTracks]', err);
        return [];
    }
}

export async function getTopAlbums(apiKey: string, username: string, limit = 6): Promise<AlbumItem[]> {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=${encodeURIComponent(
        username
    )}&api_key=${encodeURIComponent(apiKey)}&format=json&limit=${limit}&period=7day`;

    try {
        const res = await fetch(url);
        if (!res.ok) {
            console.error(`[LASTFM ERROR] HTTP status: ${res.status}`);
            return [];
        }

        const data = await res.json();
        const rawAlbums = data?.topalbums?.album;
        if (!rawAlbums) return [];

        const albumList = Array.isArray(rawAlbums) ? rawAlbums : [rawAlbums];

        const albums: AlbumItem[] = await Promise.all(
            albumList.slice(0, limit).map(async (item: any) => {
                const images = item.image || [];
                const coverObj = images.find((img: { size: string }) => img.size === 'large')
                    || images.find((img: { size: string }) => img.size === 'extralarge')
                    || images[0];

                const coverUrl = coverObj?.['#text'];
                const albumArtBase64 = coverUrl ? await imageToBase64(coverUrl) : null;

                return {
                    title: item.name || 'Unknown Album',
                    artist: item.artist?.name || 'Unknown Artist',
                    albumArtBase64,
                    url: item.url || 'https://www.last.fm'
                };
            })
        );

        return albums;
    } catch (err) {
        console.error('[LASTFM ERROR getTopAlbums]', err);
        return [];
    }
}