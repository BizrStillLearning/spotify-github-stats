import { TrackItem, AlbumItem } from './spotify.js';
import { escapeXml, truncate } from './sanitize.js';

export function renderSvg(tracks: TrackItem[]): string {
    const itemHeight = 56;
    const padding = 16;
    const headerHeight = 36;
    const totalHeight = headerHeight + Math.max(tracks.length, 1) * itemHeight + padding;
    const width = 420;

    const fallbackCover =
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="%2327272a"><rect width="40" height="40" rx="6"/><circle cx="20" cy="20" r="8" fill="%233f3f46"/></svg>';

    const trackRows = tracks.length === 0
        ? `<text x="20" y="${headerHeight + 35}" fill="#71717a" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13">No recent tracks recorded yet.</text>`
        : tracks
            .map((t, index) => {
                const yPos = headerHeight + index * itemHeight;
                const safeCover = escapeXml(t.albumArtBase64 || fallbackCover);
                const safeTitle = escapeXml(truncate(t.title, 34));
                const safeArtist = escapeXml(truncate(t.artist, 40));
                const clipId = `clip-${index}`;

                const statusBadge = t.isPlaying
                    ? `<circle cx="${width - 24}" cy="${yPos + 20}" r="4" fill="#10b981" class="pulse"/>`
                    : '';

                return `
      <g transform="translate(16, ${yPos})">
        <defs>
          <clipPath id="${clipId}">
            <rect x="0" y="4" width="40" height="40" rx="6" />
          </clipPath>
        </defs>
        <image href="${safeCover}" x="0" y="4" width="40" height="40" clip-path="url(#${clipId})" preserveAspectRatio="xMidYMid slice" />
        <rect x="0" y="4" width="40" height="40" rx="6" fill="none" stroke="#27272a" stroke-width="1" />
        
        <text x="50" y="22" class="track-title">${safeTitle}</text>
        <text x="50" y="38" class="track-artist">${safeArtist}</text>
        ${statusBadge}
      </g>`;
            })
            .join('');

    return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${totalHeight}" viewBox="0 0 ${width} ${totalHeight}" fill="none">
  <defs>
    <style>
      .track-title { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; font-weight: 600; fill: #f4f4f5; }
      .track-artist { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 11px; fill: #a1a1aa; }
      .header-title { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 700; fill: #71717a; letter-spacing: 0.08em; }
      @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.3; transform: scale(0.85); }
      }
      .pulse {
        transform-origin: center;
        animation: pulse 2s ease-in-out infinite;
      }
    </style>
  </defs>

  <rect width="${width}" height="${totalHeight}" rx="14" fill="#09090b" stroke="#27272a" stroke-width="1" />

  <g transform="translate(16, 24)">
    <text x="0" y="0" class="header-title">RECENTLY PLAYED</text>
    <g transform="translate(366, -14)">
      <path fill="#1ed760" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.309c-.216.354-.676.464-1.028.248-2.82-1.722-6.369-2.112-10.552-1.156-.402.092-.804-.16-.896-.562-.092-.401.16-.804.562-.896 4.571-1.045 8.492-.596 11.666 1.338.352.216.464.676.248 1.028zm1.47-3.269c-.271.44-.847.578-1.287.308-3.226-1.982-8.142-2.557-11.958-1.399-.496.151-1.018-.128-1.169-.624-.151-.496.13-1.018.625-1.169 4.358-1.322 9.776-.682 13.481 1.597.44.27.578.847.308 1.287zm.126-3.402C15.467 8.46 9.087 8.25 5.289 9.404c-.604.184-1.244-.156-1.428-.76-.184-.604.156-1.244.76-1.428 4.344-1.318 11.385-1.077 15.772 1.528.544.323.722 1.027.399 1.571-.323.544-1.027.722-1.571.399z"/>
    </g>
  </g>

  ${trackRows}
</svg>`;
}

export function renderAlbumGridSvg(albums: AlbumItem[]): string {
    const cardSize = 120;
    const gap = 16;
    const padding = 16;
    const headerHeight = 36;
    const cols = 2;
    const rows = Math.ceil(Math.min(albums.length || 1, 6) / cols);

    const totalWidth = padding * 2 + cols * cardSize + (cols - 1) * gap;
    const totalHeight = headerHeight + rows * cardSize + (rows - 1) * gap + padding;

    const fallbackCover =
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" fill="%2318181b"><rect width="120" height="120" rx="10"/><circle cx="60" cy="60" r="24" fill="%2327272a"/></svg>';

    const albumCards = albums.slice(0, 6).map((album, idx) => {
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const x = padding + col * (cardSize + gap);
        const y = headerHeight + row * (cardSize + gap);
        const clipId = `album-clip-${idx}`;
        const cover = escapeXml(album.albumArtBase64 || fallbackCover);

        return `
    <g transform="translate(${x}, ${y})">
      <defs>
        <clipPath id="${clipId}">
          <rect width="${cardSize}" height="${cardSize}" rx="10" />
        </clipPath>
      </defs>
      <image href="${cover}" width="${cardSize}" height="${cardSize}" clip-path="url(#${clipId})" preserveAspectRatio="xMidYMid slice" />
      <rect width="${cardSize}" height="${cardSize}" rx="10" fill="none" stroke="#27272a" stroke-width="1" />
    </g>`;
    }).join('');

    return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}" fill="none">
  <style>
    .header-title { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; font-weight: 700; fill: #f4f4f5; }
  </style>
  <rect width="${totalWidth}" height="${totalHeight}" rx="16" fill="#09090b" stroke="#27272a" stroke-width="1" />
  <text x="${padding}" y="24" class="header-title">Curated Favorites 💿</text>
  ${albumCards}
</svg>`;
}