interface TokenResponse {
    access_token: string;
    token_type: string;
    expires_in: number;
    scope: string;
}

export async function getAccessToken(
    clientId: string,
    clientSecret: string,
    refreshToken: string
): Promise<string> {
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Basic ${basicAuth}`
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gagal merefresh access token: ${response.status} - ${errorText}`);
    }

    const data = (await response.json()) as TokenResponse;
    return data.access_token;
}