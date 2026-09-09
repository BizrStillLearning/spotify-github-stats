import { TrackActivity } from './spotify.js';
import { escapeXml, truncate } from './sanitize.js';

export function renderSvg(activity: TrackActivity): string {
    const isPlaying = activity.status === 'NOW_PLAYING';
    const statusLabel = isPlaying ? 'NOW PLAYING' : 'LAST PLAYED';
    const statusColor = isPlaying ? '#10b981' : '#71717a';
    const statusTextColor = isPlaying ? '#34d399' : '#a1a1aa';

    const title = escapeXml(truncate(activity.title, 32));
    const artist = escapeXml(truncate(activity.artist, 38));
    const album = escapeXml(truncate(activity.album, 40));

    const fallbackCover =
        'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjMjcyNzJhIj48cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHJ4PSI0Ii8+PC9zdmc+';

    const rawCover = activity.albumArtBase64 && activity.albumArtBase64.startsWith('data:image/')
        ? activity.albumArtBase64
        : fallbackCover;

    const safeCoverUrl = escapeXml(rawCover);

    return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="420" height="116" viewBox="0 0 420 116" fill="none">
  <defs>
    <clipPath id="albumClip">
      <rect x="14" y="14" width="88" height="88" rx="10" />
    </clipPath>
    <style>
      .text-title { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 600; fill: #f4f4f5; }
      .text-artist { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; fill: #a1a1aa; }
      .text-album { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 10px; fill: #71717a; }
      .text-status { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; }
      @keyframes pulse {
        0%, 100% { opacity: 1; r: 4; }
        50% { opacity: 0.3; r: 3; }
      }
      .dot-pulse {
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }
    </style>
  </defs>

  <rect width="420" height="116" rx="16" fill="#09090b" stroke="#27272a" stroke-width="1" />

  <image href="${safeCoverUrl}" x="14" y="14" width="88" height="88" clip-path="url(#albumClip)" preserveAspectRatio="xMidYMid slice" />
  <rect x="14" y="14" width="88" height="88" rx="10" fill="none" stroke="#27272a" stroke-width="1" />

  <circle cx="118" cy="25" r="4" fill="${statusColor}" ${isPlaying ? 'class="dot-pulse"' : ''} />
  <text x="128" y="28" class="text-status" fill="${statusTextColor}">${statusLabel}</text>

  <text x="118" y="52" class="text-title">${title}</text>

  <text x="118" y="72" class="text-artist">${artist}</text>

  <text x="118" y="93" class="text-album">💿 ${album}</text>

  <g transform="translate(382, 16)">
    <path fill="#1ed760" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.309c-.216.354-.676.464-1.028.248-2.82-1.722-6.369-2.112-10.552-1.156-.402.092-.804-.16-.896-.562-.092-.401.16-.804.562-.896 4.571-1.045 8.492-.596 11.666 1.338.352.216.464.676.248 1.028zm1.47-3.269c-.271.44-.847.578-1.287.308-3.226-1.982-8.142-2.557-11.958-1.399-.496.151-1.018-.128-1.169-.624-.151-.496.13-1.018.625-1.169 4.358-1.322 9.776-.682 13.481 1.597.44.27.578.847.308 1.287zm.126-3.402C15.467 8.46 9.087 8.25 5.289 9.404c-.604.184-1.244-.156-1.428-.76-.184-.604.156-1.244.76-1.428 4.344-1.318 11.385-1.077 15.772 1.528.544.323.722 1.027.399 1.571-.323.544-1.027.722-1.571.399z"/>
  </g>
</svg>`;
}