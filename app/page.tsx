'use client';

import { useState, useEffect } from 'react';
import { Music, Disc3, Copy, Check, ExternalLink, Sparkles } from 'lucide-react';

export default function GeneratorPage() {
    const [username, setUsername] = useState('Bizr86');
    const [origin, setOrigin] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setOrigin(window.location.origin);
    }, []);

    const recentUrl = origin ? `${origin}/api/recent?user=${encodeURIComponent(username.trim())}` : '';
    const albumsUrl = origin ? `${origin}/api/top-albums?user=${encodeURIComponent(username.trim())}` : '';

    const markdownSnippet = `<table border="0" style="border: none;">
  <tr>
    <td width="50%" align="center" valign="top" style="border: none;">
      <a href="https://open.spotify.com" target="_blank" rel="noopener noreferrer">
        <img src="${recentUrl}" alt="Recently Played" width="100%" style="max-width: 420px;" />
      </a>
    </td>
    <td width="50%" align="center" valign="top" style="border: none;">
      <a href="https://www.last.fm/user/${username.trim()}/library/albums" target="_blank" rel="noopener noreferrer">
        <img src="${albumsUrl}" alt="Top Albums" width="100%" style="max-width: 256px;" />
      </a>
    </td>
  </tr>
</table>`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(markdownSnippet);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-between p-6 sm:p-12">
            <div className="w-full max-w-4xl space-y-8">

                <div className="text-center space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-synth-card border border-synth-border text-xs font-semibold text-[#00f0ff]">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Synthwave Profile Audio Telemetry</span>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                        Spotify Stats Generator
                    </h1>
                    <p className="text-sm text-synth-muted max-w-lg mx-auto">
                        Input username Last.fm Anda untuk mendapatkan kartu aktivitas musik real-time dengan tema Synthwave untuk GitHub Profile README Anda.
                    </p>
                </div>

                <div className="bg-synth-surface border border-synth-border rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm space-y-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-synth-muted mb-2">
                            Last.fm Username
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="e.g. Bizr86"
                                className="w-full px-4 py-3.5 bg-synth-card border border-synth-border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#9d4edd] focus:ring-1 focus:ring-[#9d4edd] transition text-sm"
                            />
                        </div>
                        <p className="text-xs text-synth-muted mt-2">
                            Pastikan akun Spotify Anda sudah terhubung ke scrobbler Last.fm.
                        </p>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-synth-border">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xs font-bold uppercase tracking-wider text-synth-muted">
                                Live Preview
                            </h2>
                            <span className="text-xs text-emerald-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Dynamic Edge Rendering
              </span>
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-6 bg-synth-dark/70 p-6 rounded-2xl border border-synth-border">
                            {recentUrl && (
                                <div className="flex flex-col items-center">
                  <span className="text-[11px] text-synth-muted font-mono mb-2 flex items-center gap-1">
                    <Music className="w-3 h-3" /> /api/recent
                  </span>
                                    <img
                                        src={recentUrl}
                                        alt="Recently Played Preview"
                                        className="max-w-[380px] w-full rounded-xl shadow-lg transition-transform hover:scale-[1.01]"
                                    />
                                </div>
                            )}
                            {albumsUrl && (
                                <div className="flex flex-col items-center">
                  <span className="text-[11px] text-synth-muted font-mono mb-2 flex items-center gap-1">
                    <Disc3 className="w-3 h-3" /> /api/top-albums
                  </span>
                                    <img
                                        src={albumsUrl}
                                        alt="Top Albums Preview"
                                        className="max-w-[240px] w-full rounded-xl shadow-lg transition-transform hover:scale-[1.01]"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold uppercase tracking-wider text-synth-muted">
                                GitHub README.md Code
                            </label>
                            <button
                                onClick={copyToClipboard}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#9d4edd]/20 hover:bg-[#9d4edd]/30 text-[#00f0ff] border border-[#9d4edd]/40 text-xs font-semibold transition"
                            >
                                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                {copied ? 'Copied to Clipboard!' : 'Copy Markdown'}
                            </button>
                        </div>

                        <pre className="p-4 bg-[#0d0a17] border border-synth-border rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto selection:bg-[#9d4edd]">
              <code>{markdownSnippet}</code>
            </pre>
                    </div>
                </div>
            </div>

            <footer className="mt-12 text-center text-xs text-synth-muted flex items-center gap-2">
                <span>Built with Next.js & Tailwind CSS</span>
                <span>•</span>
                <a
                    href="https://github.com/BizrStillLearning/spotify-github-stats"
                    target="_blank"
                    rel="noreferrer"
                    className="text-synth-text hover:text-[#00f0ff] inline-flex items-center gap-1 transition underline"
                >
                    Open Source on GitHub <ExternalLink className="w-3 h-3" />
                </a>
            </footer>
        </main>
    );
}