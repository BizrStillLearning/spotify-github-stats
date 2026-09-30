import { NextRequest, NextResponse } from 'next/server';
import { getRecentTracks } from '../../lib/spotify';
import { renderSvg } from '../../lib/render';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const user = searchParams.get('user') || process.env.LASTFM_USERNAME;
    const apiKey = process.env.LASTFM_API_KEY;

    if (!apiKey) {
        return new NextResponse('Server Error: Missing LASTFM_API_KEY in environment', { status: 500 });
    }
    if (!user) {
        return new NextResponse('Missing parameter ?user=', { status: 400 });
    }

    const tracks = await getRecentTracks(apiKey, user, 8);
    const svg = renderSvg(tracks);

    return new NextResponse(svg, {
        headers: {
            'Content-Type': 'image/svg+xml; charset=utf-8',
            'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=15',
        },
    });
}