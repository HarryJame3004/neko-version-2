import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Search, Bookmark, ExternalLink, Globe, ShieldCheck } from 'lucide-react';
import { playClickSound } from '../../core/audio';

interface MiniWebViewProps {
  soundEnabled?: boolean;
}

interface ArticleBookmark {
  title: string;
  url: string;
  source: string;
  summary: string;
  content: string;
}

const PRELOADED_ARTICLES: Record<string, ArticleBookmark> = {
  'wiki.archlinux.org/title/KDE': {
    title: 'KDE Plasma - ArchWiki',
    url: 'https://wiki.archlinux.org/title/KDE',
    source: 'Arch Linux Documentation',
    summary: 'Complete guide for running KDE Plasma 6 with native Wayland session on Arch Linux.',
    content: `KDE Plasma is the desktop environment provided by the KDE community. Under Arch Linux, Plasma 6 runs natively atop Wayland compositors (kwin_wayland) with full support for fractional scaling, HDR colorspaces, and PipeWire audio session management.

Installation:
  # pacman -S plasma-meta kde-applications-meta
  # systemctl enable sddm.service

Wayland configuration:
  Ensure qt6-wayland and kwayland packages are installed. To launch under Wayland, select "Plasma (Wayland)" from your display manager or invoke kwin_wayland directly.`,
  },
  'wiki.archlinux.org/title/PipeWire': {
    title: 'PipeWire Audio & Video - ArchWiki',
    url: 'https://wiki.archlinux.org/title/PipeWire',
    source: 'Arch Linux Documentation',
    summary: 'Low-latency multimedia framework replacing PulseAudio and JACK.',
    content: `PipeWire provides a low-latency graph-based processing engine for both audio and video streams. It seamlessly integrates ALSA, PulseAudio, and JACK clients into a unified daemon managed by WirePlumber.

MPRIS Integration:
  Media players publish their controls to the org.mpris.MediaPlayer2 D-Bus bus. Ghostly listens directly to these interfaces for real-time track metadata and seeking capabilities.`,
  },
  'aur.archlinux.org/packages/ghostly': {
    title: 'AUR: ghostly (git)',
    url: 'https://aur.archlinux.org/packages/ghostly',
    source: 'Arch User Repository',
    summary: 'Package details for Ghostly Dynamic Island companion.',
    content: `Package Details: ghostly 1.2.0-1
Description: Adaptive Dynamic Island desktop companion for Arch Linux and KDE Plasma
Upstream URL: https://github.com/ghostly-linux/ghostly
Licenses: GPL-3.0-or-later
Dependencies: qt6-base, qt6-declarative, qt6-wayland, playerctl, lm_sensors
Maintainer: Tran Khoi <trankhoi0606@gmail.com>

Installation:
  $ paru -S ghostly
  or
  $ makepkg -si`,
  },
};

export const MiniWebView: React.FC<MiniWebViewProps> = ({ soundEnabled = true }) => {
  const [currentUrlKey, setCurrentUrlKey] = useState<string>('wiki.archlinux.org/title/KDE');
  const [urlInput, setUrlInput] = useState<string>('https://wiki.archlinux.org/title/KDE');
  const [history, setHistory] = useState<string[]>(['wiki.archlinux.org/title/KDE']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const activeArticle = PRELOADED_ARTICLES[currentUrlKey] || {
    title: 'Custom Query Search',
    url: urlInput,
    source: 'Web Search Engine',
    summary: `Results for query: "${urlInput}"`,
    content: `Browsing simulation inside Ghostly embedded WebKitGTK/QtWebEngine sandbox.\n\nQuery: ${urlInput}\nTarget: Linux Wayland Session\nStatus: 200 OK\nRendering engine: WebKitGTK-6.0`,
  };

  const handleNavigate = (key: string) => {
    playClickSound(soundEnabled);
    setIsLoading(true);
    setCurrentUrlKey(key);
    setUrlInput(PRELOADED_ARTICLES[key]?.url || `https://${key}`);

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(key);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    setTimeout(() => setIsLoading(false), 300);
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      playClickSound(soundEnabled);
      const prev = historyIndex - 1;
      setHistoryIndex(prev);
      setCurrentUrlKey(history[prev]);
      setUrlInput(PRELOADED_ARTICLES[history[prev]]?.url || `https://${history[prev]}`);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      playClickSound(soundEnabled);
      const next = historyIndex + 1;
      setHistoryIndex(next);
      setCurrentUrlKey(history[next]);
      setUrlInput(PRELOADED_ARTICLES[history[next]]?.url || `https://${history[next]}`);
    }
  };

  const handleReload = () => {
    playClickSound(soundEnabled);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 300);
  };

  const handleSubmitUrl = (e: React.FormEvent) => {
    e.preventDefault();
    playClickSound(soundEnabled);
    setIsLoading(true);
    let clean = urlInput.replace(/^https?:\/\//, '');
    setCurrentUrlKey(clean);
    setTimeout(() => setIsLoading(false), 300);
  };

  return (
    <div className="flex flex-col gap-3 text-slate-100 p-1 h-full">
      {/* Browser Bar */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={handleBack}
            disabled={historyIndex === 0}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleForward}
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleReload}
            className={`p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 ${isLoading ? 'animate-spin' : ''}`}
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Address Input */}
        <form onSubmit={handleSubmitUrl} className="flex-1 flex items-center bg-white/10 rounded-lg px-2.5 py-1 border border-white/10">
          <Globe className="w-3.5 h-3.5 text-blue-400 mr-2 shrink-0" />
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="w-full bg-transparent text-xs text-white placeholder-slate-400 outline-hidden font-mono"
            placeholder="Search ArchWiki or enter URL..."
          />
          {isLoading ? (
            <div className="w-3 h-3 rounded-full border border-blue-400 border-t-transparent animate-spin ml-2 shrink-0" />
          ) : (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 ml-2 shrink-0" />
          )}
        </form>
      </div>

      {/* Bookmarks Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mr-1 shrink-0">
          Quick:
        </span>
        <button
          onClick={() => handleNavigate('wiki.archlinux.org/title/KDE')}
          className={`px-2 py-0.5 rounded text-[11px] truncate shrink-0 transition-colors ${
            currentUrlKey === 'wiki.archlinux.org/title/KDE'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
              : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          ArchWiki KDE
        </button>
        <button
          onClick={() => handleNavigate('wiki.archlinux.org/title/PipeWire')}
          className={`px-2 py-0.5 rounded text-[11px] truncate shrink-0 transition-colors ${
            currentUrlKey === 'wiki.archlinux.org/title/PipeWire'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
              : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          PipeWire
        </button>
        <button
          onClick={() => handleNavigate('aur.archlinux.org/packages/ghostly')}
          className={`px-2 py-0.5 rounded text-[11px] truncate shrink-0 transition-colors ${
            currentUrlKey === 'aur.archlinux.org/packages/ghostly'
              ? 'bg-blue-500/20 text-blue-300 border border-blue-400/30'
              : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          AUR ghostly
        </button>
      </div>

      {/* Rendered Sandbox Document Viewport */}
      <div className="flex-1 bg-slate-900/80 rounded-xl border border-white/10 p-4 overflow-y-auto max-h-72">
        <div className="space-y-3">
          <div className="border-b border-white/10 pb-2">
            <span className="text-[10px] text-blue-400 font-mono uppercase tracking-wider">
              {activeArticle.source}
            </span>
            <h3 className="text-base font-bold text-white mt-0.5">{activeArticle.title}</h3>
            <p className="text-xs text-slate-300 mt-1">{activeArticle.summary}</p>
          </div>

          <div className="text-xs font-mono text-slate-300 leading-relaxed whitespace-pre-wrap bg-black/40 p-3 rounded-lg border border-white/5">
            {activeArticle.content}
          </div>
        </div>
      </div>
    </div>
  );
};
