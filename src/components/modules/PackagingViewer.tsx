import React, { useState } from 'react';
import {
  PKGBUILD_CONTENT,
  DESKTOP_FILE_CONTENT,
  SYSTEMD_SERVICE_CONTENT,
  ARCH_INSTALL_INSTRUCTIONS,
} from '../../core/packaging';
import { generateTomlConfig } from '../../core/config';
import { GhostlyConfig } from '../../types/ghostly';
import { Copy, Check, Download, Package, FileCode, Terminal, Settings } from 'lucide-react';
import { playClickSound } from '../../core/audio';

interface PackagingViewerProps {
  soundEnabled?: boolean;
  config: GhostlyConfig;
}

export const PackagingViewer: React.FC<PackagingViewerProps> = ({ soundEnabled = true, config }) => {
  const [tab, setTab] = useState<'pkgbuild' | 'desktop' | 'toml' | 'systemd' | 'cli'>('pkgbuild');
  const [copied, setCopied] = useState(false);

  const getActiveContent = () => {
    switch (tab) {
      case 'pkgbuild':
        return PKGBUILD_CONTENT;
      case 'desktop':
        return DESKTOP_FILE_CONTENT;
      case 'toml':
        return generateTomlConfig(config);
      case 'systemd':
        return SYSTEMD_SERVICE_CONTENT;
      case 'cli':
        return ARCH_INSTALL_INSTRUCTIONS;
    }
  };

  const activeContent = getActiveContent();

  const handleCopy = () => {
    playClickSound(soundEnabled);
    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    playClickSound(soundEnabled);
    const filenames: Record<string, string> = {
      pkgbuild: 'PKGBUILD',
      desktop: 'ghostly.desktop',
      toml: 'config.toml',
      systemd: 'ghostly.service',
      cli: 'install.sh',
    };
    const filename = filenames[tab] || 'ghostly.txt';
    const blob = new Blob([activeContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-3 text-slate-100 p-1">
      {/* Sub tabs */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-1 overflow-x-auto">
          <button
            onClick={() => {
              playClickSound(soundEnabled);
              setTab('pkgbuild');
            }}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-md transition-colors ${
              tab === 'pkgbuild' ? 'bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>PKGBUILD</span>
          </button>

          <button
            onClick={() => {
              playClickSound(soundEnabled);
              setTab('desktop');
            }}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-md transition-colors ${
              tab === 'desktop' ? 'bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>.desktop</span>
          </button>

          <button
            onClick={() => {
              playClickSound(soundEnabled);
              setTab('toml');
            }}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-md transition-colors ${
              tab === 'toml' ? 'bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>config.toml</span>
          </button>

          <button
            onClick={() => {
              playClickSound(soundEnabled);
              setTab('systemd');
            }}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-md transition-colors ${
              tab === 'systemd' ? 'bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>systemd</span>
          </button>

          <button
            onClick={() => {
              playClickSound(soundEnabled);
              setTab('cli');
            }}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded-md transition-colors ${
              tab === 'cli' ? 'bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Install CLI</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-xs text-slate-200 transition-colors cursor-pointer"
            title="Copy to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-slate-200 transition-colors cursor-pointer"
            title="Download file"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Code Viewer */}
      <div className="bg-black/60 rounded-xl border border-white/10 p-3 max-h-72 overflow-y-auto font-mono text-xs text-slate-300 leading-relaxed">
        <pre className="whitespace-pre-wrap">{activeContent}</pre>
      </div>

      <div className="text-[11px] text-slate-400 flex items-center justify-between px-1">
        <span>Arch Linux Packaging Standard 3.0</span>
        <span className="font-mono">makepkg -si</span>
      </div>
    </div>
  );
};
