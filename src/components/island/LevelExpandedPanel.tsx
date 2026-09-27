import React from 'react';
import { GhostlyEyes } from '../eyes/GhostlyEyes';
import {
  ActiveTab,
  EyeExpression,
  MPRISPlayer,
  LinuxSystemMetrics,
  DBusNotification,
  GhostlyConfig,
} from '../../types/ghostly';
import { MediaMPRIS } from '../modules/MediaMPRIS';
import { SystemMonitor } from '../modules/SystemMonitor';
import { TimerStopwatch } from '../modules/TimerStopwatch';
import { WeatherModule } from '../modules/WeatherModule';
import { CalendarClock } from '../modules/CalendarClock';
import { QuickControls } from '../modules/QuickControls';
import { NotificationCenter } from '../modules/NotificationCenter';
import {
  Music,
  Activity,
  Timer,
  CloudSun,
  Calendar,
  Sliders,
  Bell,
  Minimize2,
  Maximize2,
  X,
} from 'lucide-react';
import { playClickSound, playMorphSound } from '../../core/audio';

interface LevelExpandedPanelProps {
  expression: EyeExpression;
  isHovered: boolean;
  soundEnabled: boolean;
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  onCollapse: () => void;
  onOpenWorkspace: () => void;
  onClickReaction: () => void;
  activePlayer: MPRISPlayer;
  onUpdatePlayer: (player: MPRISPlayer) => void;
  playersList: MPRISPlayer[];
  onSelectPlayer: (id: string) => void;
  systemMetrics: LinuxSystemMetrics;
  notifications: DBusNotification[];
  onDismissNotification: (id: number) => void;
  onClearAllNotifications: () => void;
  onSimulateNotification: (notif: DBusNotification) => void;
  activeTimeFormatted: string;
  isTimerRunning: boolean;
  onTimerStateChange: (running: boolean, formatted: string) => void;
  onAlarmTrigger: () => void;
  config: GhostlyConfig;
}

export const LevelExpandedPanel: React.FC<LevelExpandedPanelProps> = ({
  expression,
  isHovered,
  soundEnabled,
  activeTab,
  onChangeTab,
  onCollapse,
  onOpenWorkspace,
  onClickReaction,
  activePlayer,
  onUpdatePlayer,
  playersList,
  onSelectPlayer,
  systemMetrics,
  notifications,
  onDismissNotification,
  onClearAllNotifications,
  onSimulateNotification,
  activeTimeFormatted,
  isTimerRunning,
  onTimerStateChange,
  onAlarmTrigger,
  config,
}) => {
  const tabs = [
    { id: 'media' as ActiveTab, label: 'Media', icon: Music, enabled: config.enabledModules.media },
    { id: 'system' as ActiveTab, label: 'System', icon: Activity, enabled: config.enabledModules.system },
    { id: 'timer' as ActiveTab, label: 'Timer', icon: Timer, enabled: config.enabledModules.timer },
    { id: 'weather' as ActiveTab, label: 'Weather', icon: CloudSun, enabled: config.enabledModules.weather },
    { id: 'calendar' as ActiveTab, label: 'Calendar', icon: Calendar, enabled: config.enabledModules.calendar },
    { id: 'controls' as ActiveTab, label: 'Controls', icon: Sliders, enabled: config.enabledModules.controls },
  ].filter((t) => t.enabled);

  return (
    <div className="flex flex-col w-[460px] max-w-[92vw] text-slate-100 p-3 select-none">
      {/* Top Header Zone: Eyes in the center, controls on sides */}
      <div className="flex items-center justify-between pb-2 mb-1 border-b border-white/10">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <button
            onClick={() => {
              playClickSound(soundEnabled);
              onChangeTab('controls');
            }}
            className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-white/10 text-slate-300 transition-colors"
            title="Notification Center & D-Bus"
          >
            <Bell className="w-3.5 h-3.5" />
            {notifications.length > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            )}
          </button>
        </div>

        {/* Center: The mandatory Living Eyes tracking mouse */}
        <div className="flex items-center justify-center py-0.5">
          <GhostlyEyes
            expression={expression}
            isHovered={isHovered}
            eyeSize={22}
            pupilSize={8}
            spacing={9}
            soundEnabled={soundEnabled}
            onClickReaction={onClickReaction}
          />
        </div>

        {/* Right side controls: Workspace expand and Collapse */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              playMorphSound(soundEnabled);
              onOpenWorkspace();
            }}
            className="p-1.5 rounded-md hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Expand to Full Workspace (Level 5)"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              playMorphSound(soundEnabled);
              onCollapse();
            }}
            className="p-1.5 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Collapse to Compact Pill"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between gap-1 overflow-x-auto py-1 mb-2 border-b border-white/5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                playClickSound(soundEnabled);
                onChangeTab(tab.id);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-white/20 text-white shadow-xs font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Content Panel */}
      <div className="min-h-[280px]">
        {activeTab === 'media' && (
          <MediaMPRIS
            soundEnabled={soundEnabled}
            activePlayer={activePlayer}
            onUpdatePlayer={onUpdatePlayer}
            playersList={playersList}
            onSelectPlayer={onSelectPlayer}
          />
        )}

        {activeTab === 'system' && <SystemMonitor metrics={systemMetrics} />}

        {activeTab === 'timer' && (
          <TimerStopwatch
            soundEnabled={soundEnabled}
            activeTimeFormatted={activeTimeFormatted}
            isTimerRunning={isTimerRunning}
            onTimerStateChange={onTimerStateChange}
            onAlarmTrigger={onAlarmTrigger}
          />
        )}

        {activeTab === 'weather' && <WeatherModule soundEnabled={soundEnabled} />}

        {activeTab === 'calendar' && <CalendarClock soundEnabled={soundEnabled} />}

        {activeTab === 'controls' && (
          <div className="space-y-4">
            <QuickControls soundEnabled={soundEnabled} />
            <div className="pt-2 border-t border-white/10">
              <NotificationCenter
                soundEnabled={soundEnabled}
                notifications={notifications}
                onDismiss={onDismissNotification}
                onClearAll={onClearAllNotifications}
                onSimulateNotification={onSimulateNotification}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
