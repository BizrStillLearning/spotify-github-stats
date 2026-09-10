import { TrackItem } from './spotify.js';
import { escapeXml, truncate } from './sanitize.js';

export function renderSvg(tracks: TrackItem[]): string {
    const rowHeight = 44;
    const paddingX = 16;
    const headerHeight = 65;
    const tableTop = headerHeight + 30;
    const width = 450;
    const totalHeight = tableTop + Math.max(tracks.length, 1) * rowHeight + 16;

    const fallbackCover =
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" fill="%231a0933"><rect width="30" height="30" rx="4"/><circle cx="15" cy="15" r="6" fill="%23ff2a85"/></svg>';

    const rows = tracks.length === 0
        ? `<text x="24" y="${tableTop + 28}" fill="#a390c4" font-family="'Courier New', monospace" font-size="12">NO RECENT SIGNAL RECORDED</text>`
        : tracks
            .map((t, idx) => {
                const y = tableTop + idx * rowHeight;
                const safeCover = escapeXml(t.albumArtBase64 || fallbackCover);
                const safeTitle = escapeXml(truncate(t.title, 24));
                const safeArtist = escapeXml(truncate(t.artist, 20));
                const clipId = `synth-clip-${idx}`;

                const timeBadge = t.isPlaying
                    ? `
              <g transform="translate(${width - paddingX - 48}, ${y + 14})">
                <rect width="44" height="18" rx="4" fill="rgba(255, 42, 133, 0.2)" stroke="#ff2a85" stroke-width="1" />
                <text x="22" y="13" fill="#ff2a85" font-family="'Courier New', monospace" font-size="10" font-weight="bold" text-anchor="middle" class="glow-pink">NOW</text>
              </g>
            `
                    : `
              <text x="${width - paddingX - 6}" y="${y + 26}" fill="#7b6299" font-family="'Courier New', monospace" font-size="11" text-anchor="end">${t.timeAgo}</text>
            `;

                return `
      <!-- Table Row ${idx + 1} -->
      <g>
        <line x1="${paddingX}" y1="${y}" x2="${width - paddingX}" y2="${y}" stroke="#ff2a85" stroke-opacity="0.15" stroke-width="1" />
        
        <text x="${paddingX + 6}" y="${y + 26}" fill="#ff2a85" font-family="'Courier New', monospace" font-size="11" font-weight="bold">#0${idx + 1}</text>

        <defs>
          <clipPath id="${clipId}">
            <rect x="${paddingX + 34}" y="${y + 7}" width="30" height="30" rx="4" />
          </clipPath>
        </defs>
        <image href="${safeCover}" x="${paddingX + 34}" y="${y + 7}" width="30" height="30" clip-path="url(#${clipId})" preserveAspectRatio="xMidYMid slice" />
        <rect x="${paddingX + 34}" y="${y + 7}" width="30" height="30" rx="4" fill="none" stroke="#00f0ff" stroke-width="1" stroke-opacity="0.6" />

        <text x="${paddingX + 72}" y="${y + 21}" class="track-title">${safeTitle}</text>
        <text x="${paddingX + 72}" y="${y + 34}" class="track-artist">${safeArtist}</text>

        ${timeBadge}
      </g>`;
            })
            .join('');

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${totalHeight}" viewBox="0 0 ${width} ${totalHeight}" fill="none">
  <defs>
    <linearGradient id="synthBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0d0221" />
      <stop offset="50%" stop-color="#150536" />
      <stop offset="100%" stop-color="#050112" />
    </linearGradient>

    <linearGradient id="neonBar" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff2a85" />
      <stop offset="50%" stop-color="#9d4edd" />
      <stop offset="100%" stop-color="#00f0ff" />
    </linearGradient>

    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <style>
      .track-title {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 12px;
        font-weight: 700;
        fill: #ffffff;
      }
      .track-artist {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 10px;
        fill: #00f0ff;
        letter-spacing: 0.02em;
      }
      .col-header {
        font-family: 'Courier New', monospace;
        font-size: 10px;
        font-weight: 700;
        fill: #ff2a85;
        letter-spacing: 0.12em;
      }
      .synth-title {
        font-family: 'Courier New', -apple-system, monospace;
        font-size: 14px;
        font-weight: 900;
        letter-spacing: 0.18em;
        fill: #00f0ff;
      }
      .glow-pink {
        filter: drop-shadow(0 0 3px #ff2a85);
      }
    </style>
  </defs>

  <rect width="${width}" height="${totalHeight}" rx="12" fill="url(#synthBg)" stroke="#301551" stroke-width="1.5" />
  
  <rect x="2" y="2" width="${width - 4}" height="${totalHeight - 4}" rx="10" fill="none" stroke="#ff2a85" stroke-opacity="0.2" stroke-width="1" />

  <rect x="0" y="0" width="${width}" height="3" fill="url(#neonBar)" />

  <g transform="translate(${paddingX}, 28)">
    <text x="0" y="0" class="synth-title" filter="url(#neonGlow)">// RECENTLY_PLAYED</text>
    <text x="0" y="16" fill="#a390c4" font-family="'Courier New', monospace" font-size="9" letter-spacing="0.08em">SPOTIFY AUDIO TELEMETRY</text>
  </g>

  <g transform="translate(${paddingX}, ${headerHeight + 14})">
    <text x="6" y="0" class="col-header">TRK</text>
    <text x="72" y="0" class="col-header">TRACK / ARTIST</text>
    <text x="${width - paddingX * 2 - 6}" y="0" class="col-header" text-anchor="end">TIME</text>
    <line x1="0" y1="8" x2="${width - paddingX * 2}" y2="8" stroke="#00f0ff" stroke-opacity="0.4" stroke-width="1.2" />
  </g>

  ${rows}
  
  <line x1="${paddingX}" y1="${totalHeight - 14}" x2="${width - paddingX}" y2="${totalHeight - 14}" stroke="#ff2a85" stroke-opacity="0.3" stroke-width="1" />
</svg>`;
}