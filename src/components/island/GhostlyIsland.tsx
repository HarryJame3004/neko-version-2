import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  IslandLevel,
  ActiveTab,
  EyeExpression,
  MPRISPlayer,
  LinuxSystemMetrics,
  DBusNotification,
  GhostlyConfig,
} from '../../types/ghostly';
import { LevelCompact } from './LevelCompact';
import { LevelInfoPill } from './LevelInfoPill';
import { LevelInteractivePill } from './LevelInteractivePill';
import { LevelExpandedPanel } from './LevelExpandedPanel';
import { LevelWorkspace } from './LevelWorkspace';
import { playClickSound, playMorphSound } from '../../core/audio';

interface GhostlyIslandProps {
  currentLevel: IslandLevel;
  onChangeLevel: (level: IslandLevel) => void;
  activePlayer: MPRISPlayer;
  onUpdatePlayer: (player: MPRISPlayer) => void;
  playersList: MPRISPlayer[];
  onSelectPlayer: (id: string) => void;
  systemMetrics: LinuxSystemMetrics;
  notifications: DBusNotification[];
  onDismissNotification: (id: number) => void;
  onClearAllNotifications: () => void;
  onSimulateNotification: (notif: DBusNotification) => void;
  config: GhostlyConfig;
  onUpdateConfig: (cfg: GhostlyConfig) => void;
  positionMode: 'top-center' | 'top-left' | 'top-right' | 'free';
  customCoords?: { x: number; y: number };
  onUpdateCoords?: (coords: { x: number; y: number }) => void;
}

export const GhostlyIsland: React.FC<GhostlyIslandProps> = ({
  currentLevel,
  onChangeLevel,
  activePlayer,
  onUpdatePlayer,
  playersList,
  onSelectPlayer,
  systemMetrics,
  notifications,
  onDismissNotification,
  onClearAllNotifications,
  onSimulateNotification,
  config,
  onUpdateConfig,
  positionMode,
  customCoords = { x: 0, y: 16 },
  onUpdateCoords,
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('media');
  const [isHovered, setIsHovered] = useState(false);
  const [expression, setExpression] = useState<EyeExpression>('neutral');
  const [isIdleFaded, setIsIdleFaded] = useState(false);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Inactivity / Idle Auto-Fade Engine
  const resetIdleTimer = useCallback(() => {
    setIsIdleFaded(false);
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }

    // Only auto-fade in compact mode (Level 1 & 2) when user is not hovering and autoFadeIdle is enabled
    if (config.autoFadeIdle && currentLevel <= 2 && !isHovered) {
      idleTimerRef.current = setTimeout(() => {
        setIsIdleFaded(true);
      }, (config.idleTimeoutSeconds || 6) * 1000);
    }
  }, [config.autoFadeIdle, config.idleTimeoutSeconds, currentLevel, isHovered]);

  useEffect(() => {
    resetIdleTimer();

    const handleUserActivity = () => {
      resetIdleTimer();
    };

    window.addEventListener('mousemove', handleUserActivity, { passive: true });
    window.addEventListener('keydown', handleUserActivity, { passive: true });
    window.addEventListener('touchstart', handleUserActivity, { passive: true });
    window.addEventListener('mousedown', handleUserActivity, { passive: true });

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
      window.removeEventListener('mousedown', handleUserActivity);
    };
  }, [resetIdleTimer]);

  // Dragging support for floating free mode
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ mouseX: 0, mouseY: 0, posX: 0, posY: 0 });

  // Running timer tracking for pills
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [activeTimeFormatted, setActiveTimeFormatted] = useState('05:00');

  // Time formatted for info pill
  const [clockTimeFormatted, setClockTimeFormatted] = useState('10:32');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setClockTimeFormatted(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync expression based on system state
  useEffect(() => {
    if (activePlayer.playbackStatus === 'Playing') {
      setExpression('musical');
    } else if (isTimerRunning) {
      setExpression('focused');
    } else if (systemMetrics.batteryPercent < 20) {
      setExpression('sleepy');
    } else if (notifications.some((n) => n.urgency === 'critical')) {
      setExpression('alert');
    } else {
      setExpression('neutral');
    }
  }, [activePlayer.playbackStatus, isTimerRunning, systemMetrics.batteryPercent, notifications]);

  // Handle eye click reaction
  const handleEyeClickReaction = () => {
    setExpression('happy');
    setTimeout(() => {
      setExpression('neutral');
    }, 800);
  };

  // Timer alarm trigger
  const handleAlarmTrigger = () => {
    setExpression('alert');
    onChangeLevel(4); // auto-expand to show alarm
    setActiveTab('timer');
    setTimeout(() => {
      setExpression('neutral');
    }, 4000);
  };

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only allow drag if free position or holding alt/ctrl or drag handle
    if (positionMode === 'free' || e.altKey) {
      setIsDragging(true);
      dragStart.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        posX: customCoords.x,
        posY: customCoords.y,
      };
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && onUpdateCoords) {
        const dx = e.clientX - dragStart.current.mouseX;
        const dy = e.clientY - dragStart.current.mouseY;
        onUpdateCoords({
          x: dragStart.current.posX + dx,
          y: Math.max(10, dragStart.current.posY + dy),
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, onUpdateCoords]);

  // Theming background class
  let themeBg = 'bg-slate-950/85 border-white/15 text-slate-100 shadow-2xl';
  if (config.theme === 'breeze') {
    themeBg = 'bg-[#1b222c]/85 border-[#3daee9]/30 text-[#eff0f1] shadow-2xl';
  } else if (config.theme === 'amoled') {
    themeBg = 'bg-black/95 border-white/20 text-white shadow-2xl';
  } else if (config.theme === 'light') {
    themeBg = 'bg-slate-900/80 border-slate-700/50 text-slate-100 shadow-xl';
  }

  // Determine container styling and shape based on level
  const getRadiusClass = () => {
    if (currentLevel <= 3) return 'rounded-full';
    if (currentLevel === 4) return 'rounded-3xl';
    return 'rounded-2xl';
  };

  return (
    <div
      onMouseEnter={() => {
        setIsHovered(true);
        setIsIdleFaded(false);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        resetIdleTimer();
      }}
      onMouseDown={handleMouseDown}
      className={`relative transition-all duration-500 ease-out border backdrop-blur-md overflow-hidden ${themeBg} ${getRadiusClass()} ${
        isIdleFaded ? 'opacity-35 scale-95 hover:opacity-100 hover:scale-100' : 'opacity-100 scale-100'
      }`}
      style={{
        backdropFilter: `blur(${isIdleFaded ? 8 : config.blurAmount}px)`,
        backgroundColor:
          config.theme === 'amoled'
            ? `rgba(0, 0, 0, ${isIdleFaded ? config.idleDimOpacity : config.bgOpacity})`
            : config.theme === 'breeze'
            ? `rgba(27, 34, 44, ${isIdleFaded ? config.idleDimOpacity : config.bgOpacity})`
            : `rgba(15, 23, 42, ${isIdleFaded ? config.idleDimOpacity : config.bgOpacity})`,
        boxShadow:
          currentLevel >= 4
            ? '0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.1)'
            : isIdleFaded
            ? '0 2px 8px -2px rgba(0, 0, 0, 0.4)'
            : '0 8px 24px -6px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.08)',
        cursor: isDragging ? 'grabbing' : 'default',
      }}
    >
      {/* Level 1: Compact Eye Pill */}
      {currentLevel === 1 && (
        <LevelCompact
          expression={expression}
          isHovered={isHovered}
          soundEnabled={config.soundEffects}
          onClickReaction={handleEyeClickReaction}
          onExpand={() => {
            playMorphSound(config.soundEffects);
            onChangeLevel(4);
          }}
        />
      )}

      {/* Level 2: Informational Pill */}
      {currentLevel === 2 && (
        <LevelInfoPill
          expression={expression}
          isHovered={isHovered}
          soundEnabled={config.soundEffects}
          onClickReaction={handleEyeClickReaction}
          onExpand={() => {
            playMorphSound(config.soundEffects);
            onChangeLevel(4);
          }}
          latestNotification={notifications[0]}
          cpuPercent={systemMetrics.cpuUsageTotal}
          tempC={systemMetrics.cpuTemp}
          timeFormatted={clockTimeFormatted}
        />
      )}

      {/* Level 3: Interactive Pill */}
      {currentLevel === 3 && (
        <LevelInteractivePill
          expression={expression}
          isHovered={isHovered}
          soundEnabled={config.soundEffects}
          onClickReaction={handleEyeClickReaction}
          onExpand={() => {
            playMorphSound(config.soundEffects);
            onChangeLevel(4);
          }}
          activePlayer={activePlayer}
          onTogglePlayPause={() => {
            onUpdatePlayer({
              ...activePlayer,
              playbackStatus: activePlayer.playbackStatus === 'Playing' ? 'Paused' : 'Playing',
            });
          }}
          timerActive={isTimerRunning}
          timerFormatted={activeTimeFormatted}
        />
      )}

      {/* Level 4: Expanded Panel */}
      {currentLevel === 4 && (
        <LevelExpandedPanel
          expression={expression}
          isHovered={isHovered}
          soundEnabled={config.soundEffects}
          activeTab={activeTab}
          onChangeTab={setActiveTab}
          onCollapse={() => {
            playMorphSound(config.soundEffects);
            onChangeLevel(1);
          }}
          onOpenWorkspace={() => {
            playMorphSound(config.soundEffects);
            onChangeLevel(5);
          }}
          onClickReaction={handleEyeClickReaction}
          activePlayer={activePlayer}
          onUpdatePlayer={onUpdatePlayer}
          playersList={playersList}
          onSelectPlayer={onSelectPlayer}
          systemMetrics={systemMetrics}
          notifications={notifications}
          onDismissNotification={onDismissNotification}
          onClearAllNotifications={onClearAllNotifications}
          onSimulateNotification={onSimulateNotification}
          activeTimeFormatted={activeTimeFormatted}
          isTimerRunning={isTimerRunning}
          onTimerStateChange={(running, formatted) => {
            setIsTimerRunning(running);
            setActiveTimeFormatted(formatted);
          }}
          onAlarmTrigger={handleAlarmTrigger}
          config={config}
        />
      )}

      {/* Level 5: Workspace */}
      {currentLevel === 5 && (
        <LevelWorkspace
          expression={expression}
          isHovered={isHovered}
          soundEnabled={config.soundEffects}
          onCollapseToPanel={() => {
            playMorphSound(config.soundEffects);
            onChangeLevel(4);
          }}
          onCollapseToCompact={() => {
            playMorphSound(config.soundEffects);
            onChangeLevel(1);
          }}
          onClickReaction={handleEyeClickReaction}
          activePlayer={activePlayer}
          onUpdatePlayer={onUpdatePlayer}
          playersList={playersList}
          onSelectPlayer={onSelectPlayer}
          systemMetrics={systemMetrics}
          config={config}
          onUpdateConfig={onUpdateConfig}
        />
      )}
    </div>
  );
};
