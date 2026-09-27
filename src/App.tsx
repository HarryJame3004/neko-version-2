import React, { useState, useEffect, useCallback } from 'react';
import {
  IslandLevel,
  GhostlyConfig,
  MPRISPlayer,
  LinuxSystemMetrics,
  DBusNotification,
} from './types/ghostly';
import { DEFAULT_CONFIG, loadConfig, saveConfig } from './core/config';
import { INITIAL_MPRIS_PLAYERS } from './core/mpris-state';
import { getInitialLinuxMetrics, sampleNextLinuxMetrics } from './core/linux-system';
import { GhostlyIsland } from './components/island/GhostlyIsland';
import { KdeDesktopShell } from './components/shell/KdeDesktopShell';
import { playClickSound, playNotificationSound } from './core/audio';

export default function App() {
  // Config state
  const [config, setConfig] = useState<GhostlyConfig>(() => loadConfig());

  // Dynamic Island current morphing state
  const [currentLevel, setCurrentLevel] = useState<IslandLevel>(1);

  // MPRIS players
  const [players, setPlayers] = useState<MPRISPlayer[]>(INITIAL_MPRIS_PLAYERS);
  const [activePlayerId, setActivePlayerId] = useState<string>('spotify');

  const activePlayer = players.find((p) => p.id === activePlayerId) || players[0];

  // System Metrics
  const [metrics, setMetrics] = useState<LinuxSystemMetrics>(() => getInitialLinuxMetrics());

  // D-Bus Notifications
  const [notifications, setNotifications] = useState<DBusNotification[]>([
    {
      id: 1,
      appName: 'Ghostly Daemon',
      summary: 'Arch Linux Session Active',
      body: 'Wayland kwin compositor linked. Pupil tracking and MPRIS services ready.',
      urgency: 'normal',
      timestamp: new Date(),
    },
  ]);

  // Position coordinates for draggable floating mode
  const [customCoords, setCustomCoords] = useState({ x: 0, y: 16 });

  // Update config with persistence
  const handleUpdateConfig = (newConfig: GhostlyConfig) => {
    setConfig(newConfig);
    saveConfig(newConfig);
  };

  // Update active MPRIS player
  const handleUpdatePlayer = (updated: MPRISPlayer) => {
    setPlayers((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  };

  // MPRIS playback timeline timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activePlayer.playbackStatus === 'Playing') {
      interval = setInterval(() => {
        setPlayers((prev) =>
          prev.map((p) => {
            if (p.id === activePlayer.id) {
              const nextPos = p.position + 1;
              if (nextPos >= p.duration) {
                return { ...p, position: 0 };
              }
              return { ...p, position: nextPos };
            }
            return p;
          })
        );
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activePlayer.playbackStatus, activePlayer.id]);

  // Decoupled Linux system telemetry polling (~800ms)
  useEffect(() => {
    const pollInterval = setInterval(() => {
      setMetrics((prev) => sampleNextLinuxMetrics(prev));
    }, 850);
    return () => clearInterval(pollInterval);
  }, []);

  // Notification simulation & handling
  const handleSimulateNotification = useCallback(
    (notif?: DBusNotification) => {
      playNotificationSound(config.soundEffects);
      const incoming: DBusNotification = notif || {
        id: Date.now(),
        appName: 'pacman',
        summary: 'Package Upgrade Finished',
        body: 'Synchronized [core] and [extra]. System is up to date.',
        urgency: 'normal',
        timestamp: new Date(),
        actions: [{ id: 'ok', label: 'Dismiss' }],
      };

      setNotifications((prev) => [incoming, ...prev]);

      // If in compact mode, expand smoothly to Level 2 (Info Pill) for 4 seconds
      if (currentLevel === 1) {
        setCurrentLevel(2);
        setTimeout(() => {
          setCurrentLevel((lvl) => (lvl === 2 ? 1 : lvl));
        }, 4500);
      }
    },
    [config.soundEffects, currentLevel]
  );

  const handleDismissNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  // Keyboard navigation shortcuts (Section 29)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if focus is in an input or textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.tagName === 'SELECT'
      ) {
        return;
      }

      if (e.key === 'Escape') {
        playClickSound(config.soundEffects);
        setCurrentLevel(1);
      } else if (e.key === '1') {
        setCurrentLevel(1);
      } else if (e.key === '2') {
        setCurrentLevel(2);
      } else if (e.key === '3') {
        setCurrentLevel(3);
      } else if (e.key === '4') {
        setCurrentLevel(4);
      } else if (e.key === '5') {
        setCurrentLevel(5);
      } else if (e.key === ' ' || e.code === 'Space') {
        // Space toggles media play/pause
        e.preventDefault();
        playClickSound(config.soundEffects);
        handleUpdatePlayer({
          ...activePlayer,
          playbackStatus: activePlayer.playbackStatus === 'Playing' ? 'Paused' : 'Playing',
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [config.soundEffects, activePlayer]);

  return (
    <KdeDesktopShell
      currentLevel={currentLevel}
      onChangeLevel={setCurrentLevel}
      config={config}
      onUpdateConfig={handleUpdateConfig}
      activePlayer={activePlayer}
      onSimulateNotification={() => handleSimulateNotification()}
    >
      <GhostlyIsland
        currentLevel={currentLevel}
        onChangeLevel={setCurrentLevel}
        activePlayer={activePlayer}
        onUpdatePlayer={handleUpdatePlayer}
        playersList={players}
        onSelectPlayer={setActivePlayerId}
        systemMetrics={metrics}
        notifications={notifications}
        onDismissNotification={handleDismissNotification}
        onClearAllNotifications={handleClearAllNotifications}
        onSimulateNotification={handleSimulateNotification}
        config={config}
        onUpdateConfig={handleUpdateConfig}
        positionMode={config.position}
        customCoords={customCoords}
        onUpdateCoords={setCustomCoords}
      />
    </KdeDesktopShell>
  );
}
