'use client';

import { useState, useEffect } from 'react';
import { THEMES } from './lib/render';
import { Terminal, Copy, Check, Music2, ExternalLink, SlidersHorizontal, Radio } from 'lucide-react';

export default function StudioPage() {
    const [username, setUsername] = useState('Bizr86');
    const [selectedTheme, setSelectedTheme] = useState('synthwave');
    const [showBorder, setShowBorder] = useState(true);
    const [origin, setOrigin] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setOrigin(window.location.origin);
    }, []);

    const queryParams = new URLSearchParams({
        user: username.trim() || 'Bizr86',
        theme: selectedTheme,
        border: showBorder ? 'true' : 'false',
    }).toString();

    const recentUrl = origin ? `${origin}/api/recent?${queryParams}` : '';
    const albumsUrl = origin ? `${origin}/api/top-albums?${queryParams}` : '';
    const nowPlayingUrl = origin ? `${origin}/api/now-playing?${queryParams}` : '';

    const markdownSnippet = `<table border="0" style="border: none;">
  <tr>
    <td width="50%" align="center" valign="top" style="border: none;">
      <a href="https://open.spotify.com" target="_blank" rel="noopener noreferrer">
        <img src="${recentUrl}" alt="Recently Played" width="100%" style="max-width: 420px;" />
      </a>
    </td>
    <td width="50%" align="center" valign="top" style="border: none;">
      <a href="https://www.last.fm/user/${encodeURIComponent(username.trim())}/library/albums" target="_blank" rel="noopener noreferrer">
        <img src="${albumsUrl}" alt="Top Albums" width="100%" style="max-width: 256px;" />
      </a>
    </td>
  </tr>
</table>

<div align="center">
  <a href="https://open.spotify.com" target="_blank" rel="noopener noreferrer">
    <img src="${nowPlayingUrl}" alt="Now Playing" width="100%" style="max-width: 688px;" />
  </a>
</div>`;

    const copyCode = () => {
        navigator.clipboard.writeText(markdownSnippet);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-[#fafafa] font-sans antialiased">
            <header className="border-b border-zinc-800/80 px-6 py-4 flex items-center justify-between backdrop-blur-md sticky top-0 z-50 bg-[#09090b]/80">
                <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-200">
                        <Music2 className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-sm tracking-tight text-zinc-100">
            spotify-github-stats <span className="text-zinc-500 font-normal">/ studio</span>
          </span>
                </div>
                <a
                    href="https://github.com/BizrStillLearning/spotify-github-stats"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-zinc-400 hover:text-zinc-100 flex items-center gap-1.5 transition"
                >
                    <span>GitHub</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                </a>
            </header>

            <main className="max-w-7xl mx-auto p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8">

                <section className="lg:col-span-4 space-y-6">
                    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 space-y-6 shadow-sm">
                        <div className="flex items-center gap-2 text-zinc-400 pb-3 border-b border-zinc-800/80">
                            <SlidersHorizontal className="w-4 h-4" />
                            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">Studio Configuration</h2>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-medium text-zinc-400">Last.fm Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Last.fm username..."
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-sm text-zinc-100 font-mono focus:outline-none focus:border-zinc-400 transition"
                            />
                        </div>

                        <div className="space-y-2.5">
                            <label className="text-xs font-medium text-zinc-400">Color Palette ({Object.keys(THEMES).length} Themes)</label>
                            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
                                {Object.keys(THEMES).map((themeKey) => {
                                    const t = THEMES[themeKey];
                                    const isActive = selectedTheme === themeKey;
                                    return (
                                        <button
                                            key={themeKey}
                                            onClick={() => setSelectedTheme(themeKey)}
                                            className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs capitalize transition ${
                                                isActive
                                                    ? 'border-zinc-200 bg-zinc-800/80 font-semibold text-white'
                                                    : 'border-zinc-800/80 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700'
                                            }`}
                                        >
                                            <span className="truncate">{themeKey}</span>
                                            <div className="flex items-center gap-1 shrink-0 ml-1">
                                                <span className="w-2.5 h-2.5 rounded-full border border-black/20" style={{ backgroundColor: t.bg }} />
                                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.accent }} />
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
                            <div>
                                <label className="text-xs font-medium text-zinc-300">Card Border</label>
                                <p className="text-[11px] text-zinc-500">Render border garis luar pada SVG</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowBorder(!showBorder)}
                                className={`w-11 h-6 flex items-center rounded-full p-1 transition ${
                                    showBorder ? 'bg-zinc-200' : 'bg-zinc-800'
                                }`}
                            >
                                <div
                                    className={`bg-zinc-950 w-4 h-4 rounded-full shadow-md transform transition ${
                                        showBorder ? 'translate-x-5' : 'translate-x-0'
                                    }`}
                                />
                            </button>
                        </div>
                    </div>

                    <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-zinc-400 text-xs font-medium">
                                <Terminal className="w-3.5 h-3.5" />
                                <span>Markdown Snippet</span>
                            </div>
                            <button
                                onClick={copyCode}
                                className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition"
                            >
                                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                {copied ? 'Copied' : 'Copy'}
                            </button>
                        </div>
                        <pre className="p-3 bg-zinc-900/80 border border-zinc-800/80 rounded-lg text-[11px] font-mono text-zinc-400 overflow-x-auto max-h-40">
              <code>{markdownSnippet}</code>
            </pre>
                    </div>
                </section>

                <section className="lg:col-span-8 space-y-4">
                    <div className="flex items-center justify-between text-xs text-zinc-400 px-1">
            <span className="font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Interactive Canvas
            </span>
                        <span className="text-zinc-500 font-mono text-[11px]">theme: {selectedTheme}</span>
                    </div>

                    <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center gap-6 min-h-[500px]">
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full">
                            {recentUrl && (
                                <img
                                    src={recentUrl}
                                    alt="Recently Played"
                                    className="max-w-[420px] w-full shadow-2xl rounded-[14px]"
                                />
                            )}
                            {albumsUrl && (
                                <img
                                    src={albumsUrl}
                                    alt="Top Albums"
                                    className="max-w-[256px] w-full shadow-2xl rounded-[14px]"
                                />
                            )}
                        </div>

                        {nowPlayingUrl && (
                            <div className="w-full flex flex-col items-center gap-2 pt-2 border-t border-zinc-900">
                <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1.5 self-start">
                  <Radio className="w-3 h-3 text-emerald-400" /> Live Stream Widget (Hanya tampil jika ada lagu aktif):
                </span>
                                <img
                                    src={nowPlayingUrl}
                                    alt="Now Playing"
                                    className="max-w-[688px] w-full shadow-xl rounded-[14px]"
                                />
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}