import http from 'node:http';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { exec } from 'node:child_process';

const PORT = 8888;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;
const SCOPES = [
    'user-read-currently-playing',
    'user-read-playback-state',
    'user-read-recently-played'
].join(' ');

const rl = readline.createInterface({ input, output });

const clientId = (await rl.question('Masukkan Spotify CLIENT_ID: ')).trim();
const clientSecret = (await rl.question('Masukkan Spotify CLIENT_SECRET: ')).trim();
rl.close();

if (!clientId || !clientSecret) {
    console.error('Error: CLIENT_ID dan CLIENT_SECRET tidak boleh kosong.');
    process.exit(1);
}

const authUrl =
    'https://accounts.spotify.com/authorize?' +
    new URLSearchParams({
        response_type: 'code',
        client_id: clientId,
        scope: SCOPES,
        redirect_uri: REDIRECT_URI
    }).toString();

const server = http.createServer(async (req, res) => {
    const reqUrl = new URL(req.url, `http://127.0.0.1:${PORT}`);

    if (reqUrl.pathname !== '/callback') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
        return;
    }

    const code = reqUrl.searchParams.get('code');
    const error = reqUrl.searchParams.get('error');

    if (error || !code) {
        res.writeHead(400, { 'Content-Type': 'text/html' });
        res.end('<h3>Autentikasi gagal atau dibatalkan. Cek terminal Anda.</h3>');
        console.error(`\nAutentikasi gagal: ${error || 'Kode tidak ditemukan.'}`);
        server.close();
        process.exit(1);
    }

    try {
        const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${basicAuth}`
            },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code,
                redirect_uri: REDIRECT_URI
            })
        });

        const data = await tokenResponse.json();

        if (!tokenResponse.ok) {
            throw new Error(data.error_description || JSON.stringify(data));
        }

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h3>Berhasil! Anda bisa menutup tab ini dan kembali ke terminal.</h3>');

        console.log('\n================== SPOTIFY SECRETS ==================');
        console.log('Simpan nilai berikut ke GitHub Secrets repository Anda:\n');
        console.log(`SPOTIFY_CLIENT_ID=${clientId}`);
        console.log(`SPOTIFY_CLIENT_SECRET=${clientSecret}`);
        console.log(`SPOTIFY_REFRESH_TOKEN=${data.refresh_token}`);
        console.log('=====================================================\n');
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('<h3>Terjadi kesalahan saat menukar token. Cek terminal.</h3>');
        console.error('\nGagal menukar authorization code:', err.message);
    } finally {
        server.close();
        process.exit(0);
    }
});

server.listen(PORT, '127.0.0.1', () => {
    console.log(`\nServer lokal siap di ${REDIRECT_URI}`);
    console.log('Membuka browser untuk autentikasi Spotify...\n');

    const startCmd =
        process.platform === 'darwin'
            ? `open "${authUrl}"`
            : process.platform === 'win32'
                ? `start "" "${authUrl}"`
                : `xdg-open "${authUrl}"`;

    exec(startCmd, (err) => {
        if (err) {
            console.log('Gagal membuka browser secara otomatis.');
            console.log(`Buka URL berikut secara manual di browser:\n\n${authUrl}\n`);
        }
    });
});
