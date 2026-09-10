export interface TrackItem {
    title: string;
    artist: string;
    album: string;
    albumArtBase64: string | null;
    isPlaying: boolean;
    timeAgo: string;
}

function formatRelativeTime(uts?: string): string {
    if (!uts) return 'just now';
    const timestamp = parseInt(uts, 10);
    if (isNaN(timestamp)) return 'just now';

    const diffSec = Math.floor(Date.now() / 1000) - timestamp;
    if (diffSec < 60) return 'just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
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
                const coverObj =
                    images.find((img: { size: string }) => img.size === 'medium') ||
                    images[0];
                const coverUrl = coverObj?.['#text'];
                const albumArtBase64 = coverUrl ? await imageToBase64(coverUrl) : null;

                const timeAgo = isPlaying ? 'playing now' : formatRelativeTime(item.date?.uts);

                return {
                    title: item.name || 'Unknown Track',
                    artist: item.artist?.['#text'] || item.artist?.name || 'Unknown Artist',
                    album: item.album?.['#text'] || 'Unknown Album',
                    albumArtBase64,
                    isPlaying,
                    timeAgo
                };
            })
        );

        return tracks;
    } catch (err) {
        console.error('[LASTFM ERROR getRecentTracks]', err);
        return [];
    }
}