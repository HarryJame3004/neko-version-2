import React from 'react';
import { DBusNotification } from '../../types/ghostly';
import { Bell, Check, Trash2, Terminal, MessageSquare, AlertTriangle, Send } from 'lucide-react';
import { playClickSound, playNotificationSound } from '../../core/audio';

interface NotificationCenterProps {
  soundEnabled?: boolean;
  notifications: DBusNotification[];
  onDismiss: (id: number) => void;
  onClearAll: () => void;
  onSimulateNotification: (notif: DBusNotification) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  soundEnabled = true,
  notifications,
  onDismiss,
  onClearAll,
  onSimulateNotification,
}) => {
  const triggerSimulation = (type: 'pacman' | 'chat' | 'warning') => {
    playNotificationSound(soundEnabled);
    const newId = Date.now();

    if (type === 'pacman') {
      onSimulateNotification({
        id: newId,
        appName: 'pacman / yay',
        summary: 'System Upgrade Finished',
        body: '38 packages upgraded successfully, including linux-6.13.4 and plasma-desktop-6.3.2.',
        urgency: 'normal',
        timestamp: new Date(),
        actions: [{ id: 'reboot', label: 'Reboot Later' }, { id: 'view', label: 'View Pacman Log' }],
      });
    } else if (type === 'chat') {
      onSimulateNotification({
        id: newId,
        appName: 'Matrix Client (Neochat)',
        summary: 'KDE Arch Linux Community',
        body: 'Nate Graham: "Plasma 6.3 Wayland fractional scaling improvements are merged!"',
        urgency: 'normal',
        timestamp: new Date(),
        actions: [{ id: 'reply', label: 'Open Chat' }],
      });
    } else {
      onSimulateNotification({
        id: newId,
        appName: 'kstats / sensors',
        summary: 'Thermal Throttling Alert',
        body: 'CPU package reached 84°C during kernel compilation. Fan profile adjusted to 100%.',
        urgency: 'critical',
        timestamp: new Date(),
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 text-slate-100 p-1">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-300">
          <Bell className="w-3.5 h-3.5 text-blue-400" />
          <span>org.freedesktop.Notifications</span>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={() => {
              playClickSound(soundEnabled);
              onClearAll();
            }}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Simulator Quick Triggers */}
      <div className="bg-white/5 p-2.5 rounded-xl border border-white/10 space-y-1.5">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
          Simulate D-Bus Notification Ingest
        </span>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            onClick={() => triggerSimulation('pacman')}
            className="flex items-center justify-center gap-1 p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-200 text-xs border border-white/10 transition-colors"
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span className="truncate">Pacman Sys</span>
          </button>

          <button
            onClick={() => triggerSimulation('chat')}
            className="flex items-center justify-center gap-1 p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-200 text-xs border border-white/10 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
            <span className="truncate">Chat Msg</span>
          </button>

          <button
            onClick={() => triggerSimulation('warning')}
            className="flex items-center justify-center gap-1 p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-200 text-xs border border-white/10 transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span className="truncate">Sensors Alert</span>
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
        {notifications.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs italic">
            No active notifications. D-Bus listener is idle.
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-3 rounded-xl border text-xs transition-all ${
                notif.urgency === 'critical'
                  ? 'bg-rose-500/10 border-rose-500/30'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-mono">
                    <span className="font-semibold text-blue-400">{notif.appName}</span>
                    <span>·</span>
                    <span>{notif.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <h5 className="font-semibold text-white tracking-tight">{notif.summary}</h5>
                  <p className="text-slate-300 text-[11px] leading-relaxed mt-0.5">{notif.body}</p>
                </div>

                <button
                  onClick={() => {
                    playClickSound(soundEnabled);
                    onDismiss(notif.id);
                  }}
                  className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/10"
                  title="Dismiss notification"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Action Buttons if present */}
              {notif.actions && notif.actions.length > 0 && (
                <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-white/10">
                  {notif.actions.map((act) => (
                    <button
                      key={act.id}
                      onClick={() => {
                        playClickSound(soundEnabled);
                        onDismiss(notif.id);
                      }}
                      className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-[10px] font-medium text-slate-200 transition-colors"
                    >
                      {act.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
