import React, { useState } from 'react';
import { GhostlyConfig, IslandLevel, MPRISPlayer } from '../../types/ghostly';
import {
  Monitor,
  Layers,
  Terminal,
  Folder,
  Globe,
  Sliders,
  Bell,
  Play,
  Pause,
  Power,
  Volume2,
  Wifi,
  ChevronUp,
  Cpu,
  Sparkles,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { playClickSound } from '../../core/audio';

interface KdeDesktopShellProps {
  currentLevel: IslandLevel;
  onChangeLevel: (lvl: IslandLevel) => void;
  config: GhostlyConfig;
  onUpdateConfig: (cfg: GhostlyConfig) => void;
  activePlayer: MPRISPlayer;
  onSimulateNotification: () => void;
  children: React.ReactNode;
}

export const KdeDesktopShell: React.FC<KdeDesktopShellProps> = ({
  currentLevel,
  onChangeLevel,
  config,
  onUpdateConfig,
  activePlayer,
  onSimulateNotification,
  children,
}) => {
  // Desktop wallpaper theme
  const [wallpaper, setWallpaper] = useState<'arch-breeze' | 'plasma6' | 'minimal-dark'>('arch-breeze');
  const [isFullscreenSimulated, setIsFullscreenSimulated] = useState(false);
  const [showTrayMenu, setShowTrayMenu] = useState(false);
  const [showDevControls, setShowDevControls] = useState(true);

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

  // Wallpapers with pure CSS / high quality SVG gradients (resilient, no broken external images)
  const getWallpaperStyle = () => {
    if (wallpaper === 'arch-breeze') {
      return {
        background: 'radial-gradient(ellipse at 50% 30%, #1e293b 0%, #0f172a 60%, #020617 100%)',
      };
    }
    if (wallpaper === 'plasma6') {
      return {
        background: 'linear-gradient(135deg, #172554 0%, #1e1b4b 40%, #09090b 100%)',
      };
    }
    return {
      background: 'radial-gradient(circle at 50% 50%, #18181b 0%, #09090b 100%)',
    };
  };

  return (
    <div
      className="relative w-screen h-screen overflow-hidden select-none flex flex-col justify-between"
      style={getWallpaperStyle()}
    >
      {/* Subtle Arch Linux Logo Watermark in desktop center */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
        <svg viewBox="0 0 300 300" className="w-[420px] h-[420px]" fill="white">
          <path d="M141.2,28.6 C136.9,38.8 82.2,166.4 79.5,173.3 C75.5,183.4 69.3,196.8 62.7,208.5 C49.2,232.7 34.1,254.9 22.8,266.6 C18.1,271.5 17.5,272.5 19.3,272.8 C22.9,273.4 47.9,260.6 63.8,250.3 C74.1,243.6 77.2,242.3 84.4,242.3 C91.7,242.3 93.9,243.3 103.5,249.2 C115.6,256.7 131.7,268.4 135.2,272.3 C136.2,273.5 137.4,272.8 138.8,270.3 C140.2,267.7 148.6,245.9 157.5,221.7 C166.3,197.6 174.4,175.7 175.4,173 C176.4,170.3 181.7,157.3 187.2,144.1 L197.1,120.2 L194.2,126.9 C188.1,141.2 165.7,194.8 163.6,200.7 C161.4,206.9 154.5,223.3 148.1,237.2 C137.9,259.2 135.2,265.8 132.3,275 C132.8,275 140.4,269.9 149.3,263.7 C162.7,254.3 166.3,252.8 174.6,252.9 C182.8,253.1 187.6,255.4 200.9,265.5 C208.6,271.4 218.4,277.6 222.7,279.3 C224.2,279.9 225.1,279.1 226,276.5 C226.7,274.6 225.1,270.5 220.2,261.7 C207.2,238.4 177.6,172.9 161.5,131.8 C153.2,110.8 142.1,31.7 141.2,28.6 Z" />
        </svg>
      </div>

      {/* Top Floating Island Target Anchor Zone */}
      <div className="relative z-30 w-full pt-3 px-4 flex justify-center pointer-events-auto">
        {/* Fullscreen behavior toggle simulation */}
        {isFullscreenSimulated && config.fullscreenBehavior === 'hide' ? (
          <div className="text-xs text-slate-500 bg-black/60 px-3 py-1 rounded-full border border-white/10">
            [Ghostly Hidden in Fullscreen application mode]
          </div>
        ) : (
          <div
            style={{
              transform: `scale(${config.fractionalScale})`,
              transformOrigin: 'top center',
            }}
          >
            {children}
          </div>
        )}
      </div>

      {/* Interactive Arch Linux KDE Testing & Simulator Floating Controls */}
      {showDevControls && (
        <aside
          aria-label="Companion Controls"
          className="absolute top-4 left-4 z-40 bg-slate-950/85 backdrop-blur-md border border-white/10 rounded-2xl p-3 shadow-2xl text-xs text-slate-200 max-w-[280px] space-y-2.5"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-white">
              <Eye className="w-3.5 h-3.5 text-blue-400" />
              <span>Ghostly Control Bar</span>
            </div>
            <button
              onClick={() => setShowDevControls(false)}
              className="text-slate-400 hover:text-white text-[11px] p-0.5"
              title="Minimize control bar"
            >
              ✕
            </button>
          </div>

          {/* Morphing Level Switcher (Section 5) */}
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block mb-1">
              Dynamic Island State (Levels 1-5)
            </span>
            <div className="grid grid-cols-5 gap-1">
              {[
                { lvl: 1 as IslandLevel, label: 'L1' },
                { lvl: 2 as IslandLevel, label: 'L2' },
                { lvl: 3 as IslandLevel, label: 'L3' },
                { lvl: 4 as IslandLevel, label: 'L4' },
                { lvl: 5 as IslandLevel, label: 'L5' },
              ].map(({ lvl, label }) => (
                <button
                  key={lvl}
                  onClick={() => {
                    playClickSound(config.soundEffects);
                    onChangeLevel(lvl);
                  }}
                  className={`py-1 text-center font-mono rounded-md border transition-all cursor-pointer ${
                    currentLevel === lvl
                      ? 'bg-blue-500 text-white font-bold border-blue-400 shadow-xs'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                  title={`Switch to Level ${lvl}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="text-[10px] text-slate-400 mt-1 font-mono">
              {currentLevel === 1 && 'Compact: Two eyes ⚪ ⚪'}
              {currentLevel === 2 && 'Info Pill: Clock · Temp · Load'}
              {currentLevel === 3 && 'Interactive Pill: Media / Timer'}
              {currentLevel === 4 && 'Expanded: Modular Dashboard'}
              {currentLevel === 5 && 'Workspace: Browser & System'}
            </div>
          </div>

          {/* Auto-Fade Idle Inactivity Toggle */}
          <div className="pt-1 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] text-slate-300">Tự làm mờ khi rảnh (Idle):</span>
            <button
              onClick={() => onUpdateConfig({ ...config, autoFadeIdle: !config.autoFadeIdle })}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium transition-colors ${
                config.autoFadeIdle
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-400/40'
                  : 'bg-white/5 text-slate-400 border border-white/10'
              }`}
            >
              {config.autoFadeIdle ? `BẬT (${config.idleTimeoutSeconds}s)` : 'TẮT'}
            </button>
          </div>

          {/* Fractional Scaling Selector (Section 31) */}
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block mb-1">
              Wayland Fractional Scaling
            </span>
            <div className="grid grid-cols-4 gap-1">
              {[1.0, 1.25, 1.5, 1.75].map((scale) => (
                <button
                  key={scale}
                  onClick={() => onUpdateConfig({ ...config, fractionalScale: scale })}
                  className={`py-0.5 text-center font-mono text-[11px] rounded border transition-colors ${
                    config.fractionalScale === scale
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {Math.round(scale * 100)}%
                </button>
              ))}
            </div>
          </div>

          {/* Display Server & Fullscreen Tests */}
          <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[11px]">
            <button
              onClick={() =>
                onUpdateConfig({
                  ...config,
                  displayBackend: config.displayBackend === 'wayland' ? 'x11' : 'wayland',
                })
              }
              className="flex items-center gap-1 text-slate-300 hover:text-white font-mono"
            >
              <span>Backend:</span>
              <span className="text-blue-400 uppercase font-semibold">{config.displayBackend}</span>
            </button>

            <button
              onClick={() => onSimulateNotification()}
              className="px-2 py-0.5 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-400/30 font-medium"
            >
              + D-Bus Alert
            </button>
          </div>
        </aside>
      )}

      {/* Floating Re-Open Button when Dev Controls are Minimized */}
      {!showDevControls && (
        <button
          onClick={() => setShowDevControls(true)}
          className="absolute top-4 left-4 z-40 bg-slate-900/90 border border-white/20 p-2 rounded-xl text-white shadow-xl hover:bg-slate-800 transition-colors cursor-pointer"
          title="Open Ghostly Control Bar"
        >
          <Sliders className="w-4 h-4 text-blue-400" />
        </button>
      )}

      {/* KDE Plasma 6 Desktop Panel at Bottom */}
      <footer
        className="relative z-30 w-full h-11 bg-slate-950/80 backdrop-blur-xl border-t border-white/10 px-3 flex items-center justify-between text-slate-200 select-none shadow-lg"
      >
        {/* Left: KDE Gear / Application Launcher & Tasks */}
        <div className="flex items-center gap-2">
          {/* KDE Application Launcher Button */}
          <button
            onClick={() => playClickSound(config.soundEffects)}
            className="p-1.5 rounded-lg hover:bg-white/15 text-blue-400 transition-colors cursor-pointer"
            title="Application Launcher (KDE Plasma 6)"
          >
            <svg viewBox="0 0 32 32" className="w-5 h-5 fill-current">
              <circle cx="16" cy="16" r="14" fill="#1d4ed8" />
              <path
                d="M16 6 L20 12 L26 12 L22 17 L24 24 L16 20 L8 24 L10 17 L6 12 L12 12 Z"
                fill="white"
              />
            </svg>
          </button>

          {/* Virtual Desktops */}
          <div className="flex items-center gap-1 bg-white/5 p-1 rounded-md text-[11px] font-mono">
            <span className="px-1.5 py-0.5 bg-blue-600 rounded text-white font-bold">1</span>
            <span className="px-1.5 py-0.5 text-slate-400 hover:text-white cursor-pointer">2</span>
          </div>

          <div className="h-4 w-px bg-white/10 mx-1" />

          {/* Running Applications in Taskbar */}
          <div className="flex items-center gap-1.5">
            {/* Ghostly Island Companion Task Indicator */}
            <button
              onClick={() => {
                playClickSound(config.soundEffects);
                onChangeLevel(currentLevel === 1 ? 4 : 1);
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/15 border border-white/20 text-xs text-white shadow-xs cursor-pointer"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold">Ghostly</span>
              <span className="text-[10px] text-slate-400 font-mono">L{currentLevel}</span>
            </button>

            {/* Simulated Konsole Terminal */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-xs text-slate-300 cursor-pointer">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span className="truncate max-w-[90px]">konsole</span>
            </div>

            {/* Simulated Dolphin File Manager */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-xs text-slate-300 cursor-pointer">
              <Folder className="w-3.5 h-3.5 text-amber-400" />
              <span className="truncate max-w-[90px]">dolphin</span>
            </div>
          </div>
        </div>

        {/* Right: System Tray (Section 22) & Digital Clock */}
        <div className="flex items-center gap-3 text-xs">
          {/* Audio volume indicator */}
          <div className="flex items-center gap-1 text-slate-300">
            <Volume2 className="w-3.5 h-3.5" />
            <span className="font-mono text-[11px]">{Math.round(activePlayer.volume * 100)}%</span>
          </div>

          {/* Wi-Fi indicator */}
          <div className="text-slate-300">
            <Wifi className="w-3.5 h-3.5 text-blue-400" />
          </div>

          {/* Ghostly System Tray Icon (Section 22) */}
          <div className="relative">
            <button
              onClick={() => setShowTrayMenu(!showTrayMenu)}
              className="flex items-center gap-1 px-1.5 py-1 rounded-md bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/40 text-blue-200 transition-colors cursor-pointer"
              title="Ghostly System Tray Icon"
            >
              <span className="text-xs">👀</span>
              <ChevronUp className="w-3 h-3 text-blue-300" />
            </button>

            {/* Tray Context Menu (Section 22) */}
            {showTrayMenu && (
              <div className="absolute bottom-full right-0 mb-2 w-48 bg-slate-900 border border-white/20 rounded-xl shadow-2xl p-1.5 text-xs text-slate-200 z-50">
                <div className="px-2 py-1 border-b border-white/10 font-semibold text-white flex items-center justify-between">
                  <span>Ghostly Desktop</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Running</span>
                </div>
                <button
                  onClick={() => {
                    playClickSound(config.soundEffects);
                    onChangeLevel(4);
                    setShowTrayMenu(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors text-white"
                >
                  Open Ghostly (Level 4)
                </button>
                <button
                  onClick={() => {
                    playClickSound(config.soundEffects);
                    onChangeLevel(5);
                    setShowTrayMenu(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  Open Workspace & Settings
                </button>
                <div className="h-px bg-white/10 my-1" />
                <button
                  onClick={() => {
                    playClickSound(config.soundEffects);
                    onChangeLevel(1);
                    setShowTrayMenu(false);
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-white/10 transition-colors text-slate-400"
                >
                  Collapse to Compact 👀
                </button>
              </div>
            )}
          </div>

          {/* KDE Digital Clock */}
          <div className="flex flex-col items-end font-mono leading-tight pl-1 border-l border-white/10">
            <span className="font-semibold text-white text-[11px]">{currentTime}</span>
            <span className="text-[10px] text-slate-400">{currentDate}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
