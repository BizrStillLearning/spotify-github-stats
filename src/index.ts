import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { getLastActivity } from './spotify.js';
import { renderSvg } from './render.js';

async function main() {
    const apiKey = process.env.LASTFM_API_KEY;
    const username = process.env.LASTFM_USERNAME;

    if (!apiKey || !username) {
        console.error('Error: LASTFM_API_KEY dan LASTFM_USERNAME wajib disetel.');
        process.exit(1);
    }

    const outputDir = path.resolve(process.cwd(), 'dist');
    const outputPath = path.join(outputDir, 'spotify-stats.svg');

    console.log('1. Mengambil aktivitas musik via Last.fm API...');
    const activity = await getLastActivity(apiKey, username);
    console.log(`   -> Status: ${activity.status} | Lagu: ${activity.title} (${activity.artist})`);

    console.log('2. Merender kartu SVG...');
    const svgContent = renderSvg(activity);

    console.log('3. Menyimpan SVG ke disk...');
    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(outputPath, svgContent, 'utf-8');

    console.log(`Selesai! File berhasil dibuat di: ${outputPath}`);
}

main().catch((err) => {
    console.error('Terjadi kegagalan pada pipeline:', err);
    process.exit(1);
});