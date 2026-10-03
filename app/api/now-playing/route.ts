import { NextRequest, NextResponse } from 'next/server';
import { getRecentTracks } from '../../lib/spotify';
import { renderNowPlayingSvg } from '../../lib/render';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const user = searchParams.get('user') || process.env.LASTFM_USERNAME;
    const theme = searchParams.get('theme') || 'synthwave';
    const showBorder = searchParams.get('border') !== 'false';
    const apiKey = process.env.LASTFM_API_KEY;

    if (!apiKey || !user) {
        return new NextResponse('Missing API Key or Username', { status: 400 });
    }

    const tracks = await getRecentTracks(apiKey, user, 1);
    const currentTrack = tracks[0];

    if (!currentTrack) {
        return new NextResponse('No tracks found', { status: 404 });
    }

    const svg = renderNowPlayingSvg(currentTrack, theme, showBorder);

    return new NextResponse(svg, {
        headers: {
            'Content-Type': 'image/svg+xml; charset=utf-8',
            'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0, s-maxage=10',
        },
    });
}