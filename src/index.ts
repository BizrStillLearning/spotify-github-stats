import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { getRecentTracks } from './spotify.js';
import { renderSvg } from './render.js';

async function main() {
    const apiKey = process.env.LASTFM_API_KEY;
    const username = process.env.LASTFM_USERNAME;

    if (!apiKey || !username) {
        console.error('Error: LASTFM_API_KEY dan LASTFM_USERNAME wajib disetel.');
        process.exit(1);
    }

    const outputDir = path.resolve(process.cwd(), 'dist');
    await fs.mkdir(outputDir, { recursive: true });

    const outputPath = path.join(outputDir, 'spotify-stats.svg');

    console.log('1. Mengambil 8 aktivitas trek via Last.fm API...');
    const tracks = await getRecentTracks(apiKey, username, 8);
    console.log(`   -> Berhasil mendapatkan ${tracks.length} lagu.`);

    console.log('2. Merender kartu SVG tabel Synthwave...');
    const svgContent = renderSvg(tracks);

    console.log('3. Menyimpan SVG ke disk...');
    await fs.writeFile(outputPath, svgContent, 'utf-8');

    console.log(`Selesai! File berhasil dibuat di: ${outputPath}`);
}

main().catch((err) => {
    console.error('Terjadi kegagalan pada pipeline:', err);
    process.exit(1);
});