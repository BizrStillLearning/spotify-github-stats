import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getTopAlbums } from '../src/spotify.js';
import { renderAlbumGridSvg } from '../src/render.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    const user = (req.query.user as string) || process.env.LASTFM_USERNAME;
    const apiKey = process.env.LASTFM_API_KEY;

    if (!apiKey) {
        res.setHeader('Content-Type', 'text/plain');
        return res.status(500).send('Server Error: LASTFM_API_KEY environment variable is not configured.');
    }

    if (!user) {
        res.setHeader('Content-Type', 'text/plain');
        return res.status(400).send('Bad Request: Parameter ?user= is required.');
    }

    try {
        const albums = await getTopAlbums(apiKey, user, 6);
        const svg = renderAlbumGridSvg(albums);

        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=600, stale-while-revalidate=60');
        return res.status(200).send(svg);
    } catch (error) {
        console.error('API Error:', error);
        res.setHeader('Content-Type', 'text/plain');
        return res.status(500).send('Internal Server Error');
    }
}