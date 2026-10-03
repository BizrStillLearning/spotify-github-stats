import { TrackItem, AlbumItem } from './spotify';
import { escapeXml, truncate } from './sanitize';

export interface ThemeColors {
    bg: string;
    cardBg: string;
    border: string;
    divider: string;
    title: string;
    artist: string;
    time: string;
    header: string;
    accent: string;
}

export const THEMES: Record<string, ThemeColors> = {
    synthwave: {
        bg: '#1a102f',
        cardBg: '#26133e',
        border: '#ff2a5f',
        divider: '#3b1c5a',
        title: '#ffffff',
        artist: '#f7729b',
        time: '#a08cb6',
        header: '#ff2a5f',
        accent: '#ff0055',
    },
    dracula: {
        bg: '#282a36',
        cardBg: '#21222c',
        border: '#44475a',
        divider: '#44475a',
        title: '#f8f8f2',
        artist: '#bd93f9',
        time: '#6272a4',
        header: '#ff79c6',
        accent: '#50fa7b',
    },
    'tokyo-night': {
        bg: '#1a1b26',
        cardBg: '#16161e',
        border: '#2f3549',
        divider: '#24283b',
        title: '#c0caf5',
        artist: '#7aa2f7',
        time: '#565f89',
        header: '#bb9af7',
        accent: '#73daca',
    },
    catppuccin: {
        bg: '#1e1e2e',
        cardBg: '#181825',
        border: '#313244',
        divider: '#313244',
        title: '#cdd6f4',
        artist: '#cba6f7',
        time: '#6c7086',
        header: '#f5c2e7',
        accent: '#a6e3a1',
    },
    nord: {
        bg: '#2e3440',
        cardBg: '#3b4252',
        border: '#4c566a',
        divider: '#434c5e',
        title: '#eceff4',
        artist: '#88c0d0',
        time: '#d8dee9',
        header: '#81a1c1',
        accent: '#a3be8c',
    },
    gruvbox: {
        bg: '#282828',
        cardBg: '#1d2021',
        border: '#504945',
        divider: '#3c3836',
        title: '#ebdbb2',
        artist: '#fabd2f',
        time: '#a89984',
        header: '#fe8019',
        accent: '#b8bb26',
    },
    'rose-pine': {
        bg: '#191724',
        cardBg: '#1f1d2e',
        border: '#26233a',
        divider: '#26233a',
        title: '#e0def4',
        artist: '#ebbcba',
        time: '#6e6a86',
        header: '#c4a7e7',
        accent: '#31748f',
    },
    cyberpunk: {
        bg: '#050505',
        cardBg: '#121212',
        border: '#fee801',
        divider: '#262626',
        title: '#fee801',
        artist: '#00e5ff',
        time: '#71717a',
        header: '#00e5ff',
        accent: '#fee801',
    },
    dark: {
        bg: '#000000',
        cardBg: '#09090b',
        border: '#27272a',
        divider: '#18181b',
        title: '#fafafa',
        artist: '#a1a1aa',
        time: '#71717a',
        header: '#e4e4e7',
        accent: '#10b981',
    },
    light: {
        bg: '#ffffff',
        cardBg: '#f4f4f5',
        border: '#e4e4e7',
        divider: '#f4f4f5',
        title: '#09090b',
        artist: '#52525b',
        time: '#a1a1aa',
        header: '#18181b',
        accent: '#059669',
    },
};

export function getTheme(themeName?: string): ThemeColors {
    return THEMES[themeName?.toLowerCase() || 'synthwave'] || THEMES.synthwave;
}

export function renderSvg(tracks: TrackItem[], themeName = 'synthwave', showBorder = true): string {
    const t = getTheme(themeName);
    const rowHeight = 44;
    const paddingX = 16;
    const headerHeight = 36;
    const tableTop = headerHeight + 20;
    const width = 420;
    const totalHeight = 428;

    const fallbackCover =
        `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="${encodeURIComponent(t.divider)}"><rect width="32" height="32" rx="4"/><circle cx="16" cy="16" r="6" fill="${encodeURIComponent(t.border)}"/></svg>`;

    const rows = tracks.length === 0
        ? `<text x="${paddingX}" y="${tableTop + 24}" fill="${t.time}" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="12">No recent tracks recorded.</text>`
        : tracks
            .slice(0, 8)
            .map((item, idx) => {
                const y = tableTop + idx * rowHeight;
                const safeCover = escapeXml(item.albumArtBase64 || fallbackCover);
                const safeTitle = escapeXml(truncate(item.title, 26));
                const safeArtist = escapeXml(truncate(item.artist, 26));
                const clipId = `cover-clip-${idx}`;
                const timeColor = item.isPlaying ? t.accent : t.time;

                return `
      <g>
        <line x1="${paddingX}" y1="${y}" x2="${width - paddingX}" y2="${y}" stroke="${t.divider}" stroke-width="1" />
        <defs>
          <clipPath id="${clipId}">
            <rect x="${paddingX}" y="${y + 6}" width="32" height="32" rx="5" />
          </clipPath>
        </defs>
        <image href="${safeCover}" x="${paddingX}" y="${y + 6}" width="32" height="32" clip-path="url(#${clipId})" preserveAspectRatio="xMidYMid slice" />
        <rect x="${paddingX}" y="${y + 6}" width="32" height="32" rx="5" fill="none" stroke="${t.border}" stroke-width="1" />
        <text x="${paddingX + 42}" y="${y + 20}" class="track-title">${safeTitle}</text>
        <text x="${paddingX + 42}" y="${y + 33}" class="track-artist">${safeArtist}</text>
        <text x="${width - paddingX}" y="${y + 25}" class="track-time" text-anchor="end" fill="${timeColor}">${item.timeAgo}</text>
      </g>`;
            })
            .join('');

    const borderAttr = showBorder ? `stroke="${t.border}" stroke-width="1"` : `stroke="none"`;

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${totalHeight}" viewBox="0 0 ${width} ${totalHeight}" fill="none">
  <defs>
    <style>
      .track-title { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; font-weight: 600; fill: ${t.title}; }
      .track-artist { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; fill: ${t.artist}; }
      .track-time { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; }
      .header-title { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.05em; fill: ${t.header}; }
    </style>
  </defs>
  <rect width="${width}" height="${totalHeight}" rx="14" fill="${t.bg}" ${borderAttr} />
  <g transform="translate(${paddingX}, 26)">
    <text x="0" y="0" class="header-title">RECENTLY PLAYED</text>
    <g transform="translate(${width - paddingX * 2 - 18}, -13)">
      <path fill="${t.accent}" d="M9 0C4.029 0 0 4.029 0 9s4.029 9 9 9 9-4.029 9-9S13.971 0 9 0zm4.127 12.982c-.162.265-.507.348-.771.186-2.115-1.291-4.777-1.584-7.914-.867-.302.069-.603-.12-.672-.421-.069-.301.12-.603.421-.672 3.428-.784 6.369-.447 8.75 1.003.264.162.348.507.186.771zm1.103-2.452c-.203.33-.635.433-.965.231-2.42-1.487-6.107-1.918-8.969-1.049-.372.113-.764-.096-.877-.468-.113-.372.096-.764.469-.877 3.268-.991 7.332-.511 10.11 1.198.33.203.434.635.232.965zm.094-2.551C11.6 6.345 6.815 6.188 3.967 7.053c-.453.138-.933-.117-1.071-.57-.138-.453.117-.933.57-1.071 3.258-.988 8.539-.808 11.829 1.146.408.242.542.77.3 1.178-.242.408-.77.542-1.178.3z"/>
    </g>
  </g>
  ${rows}
</svg>`;
}

export function renderAlbumGridSvg(albums: AlbumItem[], themeName = 'synthwave', showBorder = true): string {
    const t = getTheme(themeName);
    const cardSize = 105;
    const gap = 12;
    const padding = 16;
    const headerHeight = 36;
    const cols = 2;
    const rows = 3;
    const totalWidth = padding * 2 + cols * cardSize + (cols - 1) * gap;
    const totalHeight = 428;

    const fallbackCover =
        `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${cardSize}" height="${cardSize}" viewBox="0 0 ${cardSize} ${cardSize}" fill="${encodeURIComponent(t.cardBg)}"><rect width="${cardSize}" height="${cardSize}" rx="8"/><circle cx="${cardSize/2}" cy="${cardSize/2}" r="18" fill="${encodeURIComponent(t.border)}"/></svg>`;

    const albumCards = Array.from({ length: 6 }).map((_, idx) => {
        const album = albums[idx];
        const col = idx % cols;
        const row = Math.floor(idx / cols);
        const x = padding + col * (cardSize + gap);
        const y = headerHeight + 14 + row * (cardSize + gap);
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
      <rect width="${cardSize}" height="${cardSize}" rx="8" fill="none" stroke="${t.border}" stroke-width="1" />
    </g>`;
    }).join('');

    const borderAttr = showBorder ? `stroke="${t.border}" stroke-width="1"` : `stroke="none"`;

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}" fill="none">
  <defs>
    <style>
      .header-title { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.05em; fill: ${t.header}; }
    </style>
  </defs>
  <rect width="${totalWidth}" height="${totalHeight}" rx="14" fill="${t.bg}" ${borderAttr} />
  <g transform="translate(${padding}, 26)">
    <text x="0" y="0" class="header-title">TOP ALBUMS</text>
  </g>
  ${albumCards}
</svg>`;
}

export function renderNowPlayingSvg(track: TrackItem, themeName = 'synthwave', showBorder = true): string {
    const t = getTheme(themeName);
    const width = 688;
    const height = 84;
    const borderAttr = showBorder ? `stroke="${t.border}" stroke-width="1"` : `stroke="none"`;

    const fallbackCover =
        `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" fill="${encodeURIComponent(t.divider)}"><rect width="52" height="52" rx="8"/></svg>`;

    const safeCover = escapeXml(track.albumArtBase64 || fallbackCover);
    const safeTitle = escapeXml(truncate(track.title, 42));
    const safeArtist = escapeXml(truncate(track.artist, 45));

    const badgeText = track.isPlaying ? 'NOW STREAMING ON SPOTIFY' : `LAST STREAMED • ${track.timeAgo.toUpperCase()}`;
    const badgeColor = track.isPlaying ? t.accent : t.time;
    const equalizerColor = track.isPlaying ? t.accent : t.divider;

    const equalizerBars = track.isPlaying
        ? `
    <rect class="bar-1" x="0" y="0" width="4" height="16" rx="2" fill="${equalizerColor}" />
    <rect class="bar-2" x="7" y="0" width="4" height="16" rx="2" fill="${equalizerColor}" />
    <rect class="bar-3" x="14" y="0" width="4" height="16" rx="2" fill="${equalizerColor}" />`
        : `
    <rect x="0" y="10" width="4" height="6" rx="2" fill="${equalizerColor}" />
    <rect x="7" y="6" width="4" height="10" rx="2" fill="${equalizerColor}" />
    <rect x="14" y="12" width="4" height="4" rx="2" fill="${equalizerColor}" />`;

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none">
  <defs>
    <style>
      .np-title { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; font-weight: 700; fill: ${t.title}; }
      .np-artist { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; fill: ${t.artist}; }
      .np-badge { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.08em; fill: ${badgeColor}; }
      @keyframes eq1 { 0%, 100% { height: 4px; y: 16px; } 50% { height: 18px; y: 2px; } }
      @keyframes eq2 { 0%, 100% { height: 18px; y: 2px; } 50% { height: 6px; y: 14px; } }
      @keyframes eq3 { 0%, 100% { height: 10px; y: 10px; } 50% { height: 20px; y: 0px; } }
      .bar-1 { animation: eq1 1.1s ease-in-out infinite; }
      .bar-2 { animation: eq2 0.8s ease-in-out infinite; }
      .bar-3 { animation: eq3 1.3s ease-in-out infinite; }
    </style>
    <clipPath id="np-cover-clip">
      <rect x="16" y="16" width="52" height="52" rx="8" />
    </clipPath>
  </defs>

  <rect width="${width}" height="${height}" rx="14" fill="${t.bg}" ${borderAttr} />

  <image href="${safeCover}" x="16" y="16" width="52" height="52" clip-path="url(#np-cover-clip)" preserveAspectRatio="xMidYMid slice" />
  <rect x="16" y="16" width="52" height="52" rx="8" fill="none" stroke="${t.border}" stroke-width="1" />

  <g transform="translate(80, 28)">
    <text x="0" y="0" class="np-badge">${badgeText}</text>
    <text x="0" y="20" class="np-title">${safeTitle}</text>
    <text x="0" y="37" class="np-artist">${safeArtist}</text>
  </g>

  <g transform="translate(${width - 48}, 32)">
    ${equalizerBars}
  </g>
</svg>`;
}