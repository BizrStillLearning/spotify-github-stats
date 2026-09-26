import { TrackItem, AlbumItem } from './spotify.js';
import { escapeXml, truncate } from './sanitize.js';

export function renderSvg(tracks: TrackItem[]): string {
    const rowHeight = 44;
    const paddingX = 16;
    const headerHeight = 36;
    const tableTop = headerHeight + 24;
    const width = 420;
    const totalHeight = tableTop + Math.max(tracks.length, 1) * rowHeight + 12;

    const fallbackCover =
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="%23392e56"><rect width="32" height="32" rx="4"/><circle cx="16" cy="16" r="6" fill="%2356477d"/></svg>';

    const rows = tracks.length === 0
        ? `<text x="${paddingX}" y="${tableTop + 24}" fill="#9282b8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="12">No recent tracks available.</text>`
        : tracks
            .map((t, idx) => {
                const y = tableTop + idx * rowHeight;
                const safeCover = escapeXml(t.albumArtBase64 || fallbackCover);
                const safeTitle = escapeXml(truncate(t.title, 26));
                const safeArtist = escapeXml(truncate(t.artist, 26));
                const clipId = `cover-clip-${idx}`;

                return `
      <!-- Row ${idx + 1} -->
      <g>
        <line x1="${paddingX}" y1="${y}" x2="${width - paddingX}" y2="${y}" stroke="#392e56" stroke-width="1" />
        
        <defs>
          <clipPath id="${clipId}">
            <rect x="${paddingX}" y="${y + 6}" width="32" height="32" rx="5" />
          </clipPath>
        </defs>
        <image href="${safeCover}" x="${paddingX}" y="${y + 6}" width="32" height="32" clip-path="url(#${clipId})" preserveAspectRatio="xMidYMid slice" />
        <rect x="${paddingX}" y="${y + 6}" width="32" height="32" rx="5" fill="none" stroke="#483a6c" stroke-width="1" />

        <text x="${paddingX + 42}" y="${y + 20}" class="track-title">${safeTitle}</text>
        <text x="${paddingX + 42}" y="${y + 33}" class="track-artist">${safeArtist}</text>
        <text x="${width - paddingX}" y="${y + 25}" class="track-time" text-anchor="end">${t.timeAgo}</text>
      </g>`;
            })
            .join('');

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${totalHeight}" viewBox="0 0 ${width} ${totalHeight}" fill="none">
  <defs>
    <style>
      .track-title { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; font-weight: 600; fill: #f1edfa; }
      .track-artist { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; fill: #b4a5d4; }
      .track-time { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; fill: #8574a8; }
      .header-title { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.05em; fill: #d5c8ed; }
    </style>
  </defs>

  <rect width="${width}" height="${totalHeight}" rx="12" fill="#28203d" stroke="#392e56" stroke-width="1" />

  <g transform="translate(${paddingX}, 24)">
    <text x="0" y="0" class="header-title">RECENTLY PLAYED</text>
    <g transform="translate(${width - paddingX * 2 - 18}, -13)">
      <path fill="#1ed760" d="M9 0C4.029 0 0 4.029 0 9s4.029 9 9 9 9-4.029 9-9S13.971 0 9 0zm4.127 12.982c-.162.265-.507.348-.771.186-2.115-1.291-4.777-1.584-7.914-.867-.302.069-.603-.12-.672-.421-.069-.301.12-.603.421-.672 3.428-.784 6.369-.447 8.75 1.003.264.162.348.507.186.771zm1.103-2.452c-.203.33-.635.433-.965.231-2.42-1.487-6.107-1.918-8.969-1.049-.372.113-.764-.096-.877-.468-.113-.372.096-.764.469-.877 3.268-.991 7.332-.511 10.11 1.198.33.203.434.635.232.965zm.094-2.551C11.6 6.345 6.815 6.188 3.967 7.053c-.453.138-.933-.117-1.071-.57-.138-.453.117-.933.57-1.071 3.258-.988 8.539-.808 11.829 1.146.408.242.542.77.3 1.178-.242.408-.77.542-1.178.3z"/>
    </g>
  </g>

  ${rows}
</svg>`;
}

export function renderAlbumGridSvg(albums: AlbumItem[]): string {
    const cardSize = 86;
    const gap = 10;
    const padding = 14;
    const headerHeight = 32;
    const cols = 2;
    const rows = 3;

    const totalWidth = padding * 2 + cols * cardSize + (cols - 1) * gap;
    const totalHeight = headerHeight + rows * cardSize + (rows - 1) * gap + padding;

    const fallbackCover =
        `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${cardSize}" height="${cardSize}" viewBox="0 0 ${cardSize} ${cardSize}" fill="%23392e56"><rect width="${cardSize}" height="${cardSize}" rx="8"/><circle cx="${cardSize/2}" cy="${cardSize/2}" r="16" fill="%2356477d"/></svg>`;

    const albumCards = Array.from({ length: 6 }).map((_, idx) => {
        const album = albums[idx];
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const x = padding + col * (cardSize + gap);
        const y = headerHeight + row * (cardSize + gap);
        const clipId = `grid-clip-${idx}`;
        const cover = escapeXml(album?.albumArtBase64 || fallbackCover);

        return `
    <g transform="translate(${x}, ${y})">
      <defs>
        <clipPath id="${clipId}">
          <rect width="${cardSize}" height="${cardSize}" rx="8" />
        </clipPath>
      </defs>
      <image href="${cover}" width="${cardSize}" height="${cardSize}" clip-path="url(#${clipId})" preserveAspectRatio="xMidYMid slice" />
      <rect width="${cardSize}" height="${cardSize}" rx="8" fill="none" stroke="#392e56" stroke-width="1" />
    </g>`;
    }).join('');

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}" fill="none">
  <defs>
    <style>
      .header-title { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.05em; fill: #d5c8ed; }
    </style>
  </defs>
  <rect width="${totalWidth}" height="${totalHeight}" rx="12" fill="#28203d" stroke="#392e56" stroke-width="1" />
  <g transform="translate(${padding}, 22)">
    <text x="0" y="0" class="header-title">TOP ALBUMS</text>
  </g>
  ${albumCards}
</svg>`;
}