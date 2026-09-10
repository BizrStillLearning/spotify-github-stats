import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { getRecentTracks, getTopAlbums } from './spotify.js';
import { renderSvg, renderAlbumGridSvg } from './render.js';

async function main() {
    const apiKey = process.env.LASTFM_API_KEY;
    const username = process.env.LASTFM_USERNAME;

    if (!apiKey || !username) {
        console.error('Error: LASTFM_API_KEY dan LASTFM_USERNAME wajib disetel.');
        process.exit(1);
    }

    const outputDir = path.resolve(process.cwd(), 'dist');
    await fs.mkdir(outputDir, { recursive: true });

    const recentPath = path.join(outputDir, 'spotify-stats.svg');
    console.log('1. Mengambil 8 aktivitas trek via Last.fm API...');
    const tracks = await getRecentTracks(apiKey, username, 8);
    console.log(`   -> Berhasil mendapatkan ${tracks.length} lagu.`);

    console.log('2. Merender kartu SVG multi-track...');
    const svgContent = renderSvg(tracks);
    await fs.writeFile(recentPath, svgContent, 'utf-8');
    console.log(`File track berhasil dibuat di: ${recentPath}`);

    const albumsPath = path.join(outputDir, 'top-albums.svg');
    console.log('3. Mengambil 6 top albums via Last.fm API...');
    const albums = await getTopAlbums(apiKey, username, 6);
    console.log(`   -> Berhasil mendapatkan ${albums.length} album.`);

    console.log('4. Merender grid SVG top albums...');
    const albumsSvgContent = renderAlbumGridSvg(albums);
    await fs.writeFile(albumsPath, albumsSvgContent, 'utf-8');
    console.log(`File top albums berhasil dibuat di: ${albumsPath}`);

    console.log('Selesai! Seluruh SVG berhasil diperbarui.');
}

main().catch((err) => {
    console.error('Terjadi kegagalan pada pipeline:', err);
    process.exit(1);
});