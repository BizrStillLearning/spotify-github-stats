import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getRecentTracks } from '../src/spotify.js';
import { renderSvg } from '../src/render.js';

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
        const tracks = await getRecentTracks(apiKey, user, 8);
        const svg = renderSvg(tracks);

        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60, stale-while-revalidate=30');
        return res.status(200).send(svg);
    } catch (error) {
        console.error('API Error:', error);
        res.setHeader('Content-Type', 'text/plain');
        return res.status(500).send('Internal Server Error');
    }
}