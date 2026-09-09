import { TrackActivity } from './spotify.js';
import { escapeXml, truncate } from './sanitize.js';

export function renderSvg(activity: TrackActivity, compiledCss: string): string {
    const isPlaying = activity.status === 'NOW_PLAYING';
    const statusLabel = isPlaying ? 'NOW PLAYING' : 'LAST PLAYED';
    const title = escapeXml(truncate(activity.title, 34));
    const artist = escapeXml(truncate(activity.artist, 38));
    const album = escapeXml(truncate(activity.album, 40));

    const fallbackCover =
        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="%2327272a"><rect width="24" height="24" rx="4"/></svg>';

    const coverUrl = activity.albumArtBase64 || fallbackCover;

    return `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="116" viewBox="0 0 420 116" fill="none">
  <defs>
    <style type="text/css">
      <![CDATA[
        ${compiledCss}
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
        .animate-status-dot {
          animation: pulse-dot 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      ]]>
    </style>
  </defs>
  <foreignObject width="100%" height="100%">
    <div xmlns="http://www.w3.org/1999/xhtml" class="w-full h-full">
      <div class="box-border flex items-center w-full h-full p-3.5 bg-zinc-950 border border-zinc-800/80 rounded-2xl shadow-xl font-sans text-white">
        <div class="relative shrink-0 mr-3.5 w-18 h-18 rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-inner">
          <img src="${coverUrl}" alt="Album Art" class="w-full h-full object-cover" />
        </div>

        <div class="flex flex-col justify-between flex-1 min-w-0 h-18 py-0.5">
          <div class="flex items-center space-x-1.5">
            <span class="w-2 h-2 rounded-full ${isPlaying ? 'bg-emerald-500 animate-status-dot' : 'bg-zinc-500'}"></span>
            <span class="text-[10px] font-bold tracking-widest uppercase ${isPlaying ? 'text-emerald-400' : 'text-zinc-400'}">
              ${statusLabel}
            </span>
          </div>

          <div class="flex flex-col min-w-0">
            <div class="text-sm font-semibold text-zinc-100 truncate leading-snug">
              ${title}
            </div>
            <div class="text-xs text-zinc-400 truncate leading-tight">
              ${artist}
            </div>
          </div>

          <div class="text-[10px] text-zinc-500 truncate flex items-center gap-1">
            <span>💿</span>
            <span class="truncate">${album}</span>
          </div>
        </div>

        <div class="shrink-0 pl-2 self-start pt-1 text-emerald-500">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.435-5.308-1.76-8.793-.963-.335.077-.67-.133-.746-.468-.077-.334.132-.67.467-.746 3.809-.871 7.077-.497 9.722 1.113.294.18.386.563.207.857zm1.225-2.724c-.226.367-.706.482-1.072.257-2.688-1.652-6.785-2.131-9.965-1.166-.413.126-.848-.107-.973-.52-.125-.414.108-.849.52-.974 3.632-1.102 8.147-.568 11.233 1.331.366.226.481.706.257 1.072zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71c-.494.15-1.017-.129-1.167-.624-.15-.494.129-1.018.624-1.168 3.532-1.072 9.404-.866 13.115 1.337.445.264.59.838.327 1.282-.264.444-.838.59-1.282.327z"/>
          </svg>
        </div>
      </div>
    </div>
  </foreignObject>
</svg>`;
}