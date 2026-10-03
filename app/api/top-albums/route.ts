import { NextRequest, NextResponse } from 'next/server';
import { getTopAlbums } from '../../lib/spotify';
import { renderAlbumGridSvg } from '../../lib/render';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const user = searchParams.get('user') || process.env.LASTFM_USERNAME;
    const theme = searchParams.get('theme') || 'synthwave';
    const showBorder = searchParams.get('border') !== 'false';
    const apiKey = process.env.LASTFM_API_KEY;

    if (!apiKey) {
        return new NextResponse('Server Error: Missing LASTFM_API_KEY', { status: 500 });
    }
    if (!user) {
        return new NextResponse('Missing parameter ?user=', { status: 400 });
    }

    const albums = await getTopAlbums(apiKey, user, 6);
    const svg = renderAlbumGridSvg(albums, theme, showBorder);

    return new NextResponse(svg, {
        headers: {
            'Content-Type': 'image/svg+xml; charset=utf-8',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=60',
        },
    });
}