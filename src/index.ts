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

    const tracksPath = path.join(outputDir, 'spotify-stats.svg');
    console.log('1. Mengambil riwayat trek via Last.fm API...');
    const tracks = await getRecentTracks(apiKey, username, 8);
    console.log(`   -> Berhasil cache ${tracks.length} trek.`);
    const tracksSvg = renderSvg(tracks);
    await fs.writeFile(tracksPath, tracksSvg, 'utf-8');

    const albumsPath = path.join(outputDir, 'top-albums.svg');
    console.log('2. Mengambil top albums via Last.fm API...');
    const albums = await getTopAlbums(apiKey, username, 6);
    console.log(`   -> Berhasil cache ${albums.length} album.`);
    const albumsSvg = renderAlbumGridSvg(albums);
    await fs.writeFile(albumsPath, albumsSvg, 'utf-8');

    console.log('Selesai! Seluruh SVG berhasil di-cache ke folder dist.');
}

main().catch((err) => {
    console.error('Terjadi kegagalan pipeline:', err);
    process.exit(1);
});