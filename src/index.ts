import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { getAccessToken } from './auth.js';
import { getLastActivity } from './spotify.js';
import { renderSvg } from './render.js';

async function main() {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

    if (!clientId || !clientSecret || !refreshToken) {
        console.error('Error: SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, dan SPOTIFY_REFRESH_TOKEN wajib disetel.');
        process.exit(1);
    }

    const outputDir = path.resolve(process.cwd(), 'dist');
    const outputPath = path.join(outputDir, 'spotify-stats.svg');

    console.log('1. Menukar refresh token ke access token...');
    const accessToken = await getAccessToken(clientId, clientSecret, refreshToken);

    console.log('2. Mengambil aktivitas trek Spotify...');
    const activity = await getLastActivity(accessToken);
    console.log(`   -> Status: ${activity.status} | Lagu: ${activity.title} (${activity.artist})`);

    console.log('3. Merender kartu SVG...');
    const svgContent = renderSvg(activity);

    console.log('4. Menyimpan SVG ke disk...');
    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(outputPath, svgContent, 'utf-8');

    console.log(`Selesai! File berhasil dibuat di: ${outputPath}`);
}

main().catch((err) => {
    console.error('Terjadi kegagalan pada pipeline:', err);
    process.exit(1);
});