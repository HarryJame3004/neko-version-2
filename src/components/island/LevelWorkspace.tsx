import React, { useState } from 'react';
import { GhostlyEyes } from '../eyes/GhostlyEyes';
import {
  EyeExpression,
  MPRISPlayer,
  LinuxSystemMetrics,
  DBusNotification,
  GhostlyConfig,
} from '../../types/ghostly';
import { MiniWebView } from '../modules/MiniWebView';
import { SystemMonitor } from '../modules/SystemMonitor';
import { PackagingViewer } from '../modules/PackagingViewer';
import { MediaMPRIS } from '../modules/MediaMPRIS';
import { QuickControls } from '../modules/QuickControls';
import {
  Globe,
  Activity,
  Package,
  Sliders,
  Music,
  Minimize2,
  X,
  Settings,
} from 'lucide-react';
import { playClickSound, playMorphSound } from '../../core/audio';

interface LevelWorkspaceProps {
  expression: EyeExpression;
  isHovered: boolean;
  soundEnabled: boolean;
  onCollapseToPanel: () => void;
  onCollapseToCompact: () => void;
  onClickReaction: () => void;
  activePlayer: MPRISPlayer;
  onUpdatePlayer: (player: MPRISPlayer) => void;
  playersList: MPRISPlayer[];
  onSelectPlayer: (id: string) => void;
  systemMetrics: LinuxSystemMetrics;
  config: GhostlyConfig;
  onUpdateConfig: (cfg: GhostlyConfig) => void;
}

export const LevelWorkspace: React.FC<LevelWorkspaceProps> = ({
  expression,
  isHovered,
  soundEnabled,
  onCollapseToPanel,
  onCollapseToCompact,
  onClickReaction,
  activePlayer,
  onUpdatePlayer,
  playersList,
  onSelectPlayer,
  systemMetrics,
  config,
  onUpdateConfig,
}) => {
  const [workspaceTab, setWorkspaceTab] = useState<'browser' | 'system' | 'packaging' | 'settings' | 'media'>('browser');

  return (
    <div className="flex flex-col w-[720px] max-w-[94vw] text-slate-100 p-4 select-none">
      {/* Workspace Top Header: Ghostly Eyes in Center */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-400" />
          <span className="text-xs font-semibold tracking-wide text-white uppercase">Ghostly Workspace</span>
          <span className="text-[10px] text-slate-400 font-mono">Arch Linux · Wayland</span>
        </div>

        {/* The Mandatory Living Eyes */}
        <div className="flex items-center justify-center">
          <GhostlyEyes
            expression={expression}
            isHovered={isHovered}
            eyeSize={22}
            pupilSize={8}
            spacing={10}
            soundEnabled={soundEnabled}
            onClickReaction={onClickReaction}
          />
        </div>

        {/* Window controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              playMorphSound(soundEnabled);
              onCollapseToPanel();
            }}
            className="p-1.5 rounded-md hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Return to Panel (Level 4)"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              playMorphSound(soundEnabled);
              onCollapseToCompact();
            }}
            className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Collapse to Compact Pill"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Workspace Navigation Tabs */}
      <div className="flex items-center gap-2 mb-3 border-b border-white/5 pb-2">
        {[
          { id: 'browser' as const, label: 'Mini Browser (WebKitGTK)', icon: Globe },
          { id: 'system' as const, label: 'Deep System Monitor', icon: Activity },
          { id: 'packaging' as const, label: 'PKGBUILD & Packaging', icon: Package },
          { id: 'settings' as const, label: 'Ghostly Config & Themes', icon: Settings },
          { id: 'media' as const, label: 'MPRIS Audio', icon: Music },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = workspaceTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                playClickSound(soundEnabled);
                setWorkspaceTab(tab.id);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-500/20 text-blue-200 border border-blue-400/30 font-semibold shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="min-h-[360px]">
        {workspaceTab === 'browser' && <MiniWebView soundEnabled={soundEnabled} />}

        {workspaceTab === 'system' && (
          <div className="space-y-4">
            <SystemMonitor metrics={systemMetrics} />
            <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs font-mono text-slate-300">
              <span className="text-slate-400 block mb-1">/sys/devices/system/cpu/vulnerabilities:</span>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                <div>meltdown: Not affected</div>
                <div>spectre_v1: Mitigation; usercopy/swapgs</div>
                <div>spectre_v2: Mitigation; Retpolines, IBPB</div>
                <div>spec_store_bypass: Mitigation</div>
              </div>
            </div>
          </div>
        )}

        {workspaceTab === 'packaging' && <PackagingViewer soundEnabled={soundEnabled} config={config} />}

        {workspaceTab === 'media' && (
          <MediaMPRIS
            soundEnabled={soundEnabled}
            activePlayer={activePlayer}
            onUpdatePlayer={onUpdatePlayer}
            playersList={playersList}
            onSelectPlayer={onSelectPlayer}
          />
        )}

        {workspaceTab === 'settings' && (
          <div className="space-y-4 p-2 text-xs">
            <div className="grid grid-cols-2 gap-4">
              {/* Theme & Visuals */}
              <div className="space-y-3 p-3 bg-white/5 rounded-xl border border-white/10">
                <h4 className="font-semibold text-white text-xs">Theme & Appearance</h4>
                <div>
                  <label className="text-slate-400 block mb-1">Color Palette</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {(['dark', 'breeze', 'amoled', 'light'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => onUpdateConfig({ ...config, theme: t })}
                        className={`p-1.5 rounded-lg border text-center capitalize ${
                          config.theme === t ? 'border-blue-400 bg-blue-500/20 text-white' : 'border-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Backdrop Blur</span>
                    <span className="font-mono">{config.blurAmount}px</span>
                  </div>
                  <input
                    type="range"
                    min={4}
                    max={36}
                    value={config.blurAmount}
                    onChange={(e) => onUpdateConfig({ ...config, blurAmount: Number(e.target.value) })}
                    className="w-full h-1 bg-white/20 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Translucency Opacity</span>
                    <span className="font-mono">{Math.round(config.bgOpacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0.4}
                    max={0.98}
                    step={0.02}
                    value={config.bgOpacity}
                    onChange={(e) => onUpdateConfig({ ...config, bgOpacity: Number(e.target.value) })}
                    className="w-full h-1 bg-white/20 rounded-lg cursor-pointer"
                  />
                </div>

                {/* Auto Fade Idle when Inactive */}
                <div className="pt-2 border-t border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-white font-medium block">Auto-Dim on Inactivity</span>
                      <span className="text-[10px] text-slate-400">Tự làm mờ khi không chạm lâu</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.autoFadeIdle}
                      onChange={(e) => onUpdateConfig({ ...config, autoFadeIdle: e.target.checked })}
                      className="rounded accent-blue-500 w-4 h-4 cursor-pointer"
                    />
                  </div>

                  {config.autoFadeIdle && (
                    <>
                      <div>
                        <div className="flex justify-between text-[11px] text-slate-400 mb-0.5">
                          <span>Idle Timeout (Thời gian chờ)</span>
                          <span className="font-mono text-blue-300">{config.idleTimeoutSeconds}s</span>
                        </div>
                        <input
                          type="range"
                          min={3}
                          max={30}
                          step={1}
                          value={config.idleTimeoutSeconds}
                          onChange={(e) => onUpdateConfig({ ...config, idleTimeoutSeconds: Number(e.target.value) })}
                          className="w-full h-1 bg-white/20 rounded-lg cursor-pointer accent-blue-400"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] text-slate-400 mb-0.5">
                          <span>Dim Opacity (Độ mờ)</span>
                          <span className="font-mono text-blue-300">{Math.round((config.idleDimOpacity || 0.35) * 100)}%</span>
                        </div>
                        <input
                          type="range"
                          min={0.15}
                          max={0.65}
                          step={0.05}
                          value={config.idleDimOpacity || 0.35}
                          onChange={(e) => onUpdateConfig({ ...config, idleDimOpacity: Number(e.target.value) })}
                          className="w-full h-1 bg-white/20 rounded-lg cursor-pointer accent-blue-400"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Linux & Wayland Environment */}
              <div className="space-y-3 p-3 bg-white/5 rounded-xl border border-white/10">
                <h4 className="font-semibold text-white text-xs">Display & Platform Integration</h4>

                <div>
                  <label className="text-slate-400 block mb-1">Display Server Backend</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onUpdateConfig({ ...config, displayBackend: 'wayland' })}
                      className={`flex-1 p-1.5 rounded-lg border text-center font-mono ${
                        config.displayBackend === 'wayland'
                          ? 'border-blue-400 bg-blue-500/20 text-white font-semibold'
                          : 'border-white/10 text-slate-400'
                      }`}
                    >
                      Wayland (Native)
                    </button>
                    <button
                      onClick={() => onUpdateConfig({ ...config, displayBackend: 'x11' })}
                      className={`flex-1 p-1.5 rounded-lg border text-center font-mono ${
                        config.displayBackend === 'x11'
                          ? 'border-blue-400 bg-blue-500/20 text-white font-semibold'
                          : 'border-white/10 text-slate-400'
                      }`}
                    >
                      X11 (XCB fallback)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Fullscreen Application Behavior</label>
                  <select
                    value={config.fullscreenBehavior}
                    onChange={(e) => onUpdateConfig({ ...config, fullscreenBehavior: e.target.value as any })}
                    className="w-full bg-slate-900 border border-white/15 rounded-lg p-1.5 text-white"
                  >
                    <option value="autodock">Auto-dock / Subtle compact</option>
                    <option value="always">Always keep visible on top</option>
                    <option value="hide">Hide completely during fullscreen</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-400 block mb-1">Target Monitor</label>
                  <select
                    value={config.monitorId}
                    onChange={(e) => onUpdateConfig({ ...config, monitorId: e.target.value })}
                    className="w-full bg-slate-900 border border-white/15 rounded-lg p-1.5 text-white font-mono"
                  >
                    <option value="eDP-1 (Primary 1440p)">eDP-1 (Primary 2560x1440 @ 165Hz)</option>
                    <option value="DP-1 (4K External)">DP-1 (External 3840x2160 @ 120Hz)</option>
                    <option value="HDMI-A-1 (1080p)">HDMI-A-1 (Secondary 1920x1080 @ 60Hz)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Modules Checkbox Grid */}
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <h4 className="font-semibold text-white text-xs mb-2">Enable / Disable Modules</h4>
              <div className="grid grid-cols-4 gap-2">
                {Object.entries(config.enabledModules).map(([modKey, isEnabled]) => (
                  <label key={modKey} className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
                    <input
                      type="checkbox"
                      checked={isEnabled}
                      onChange={(e) =>
                        onUpdateConfig({
                          ...config,
                          enabledModules: { ...config.enabledModules, [modKey]: e.target.checked },
                        })
                      }
                      className="rounded accent-blue-500"
                    />
                    <span className="capitalize">{modKey}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
