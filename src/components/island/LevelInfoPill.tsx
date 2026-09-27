import React from 'react';
import { GhostlyEyes } from '../eyes/GhostlyEyes';
import { EyeExpression, DBusNotification } from '../../types/ghostly';
import { Bell, CloudSun, Cpu, Clock } from 'lucide-react';

interface LevelInfoPillProps {
  expression: EyeExpression;
  isHovered: boolean;
  soundEnabled: boolean;
  onClickReaction: () => void;
  onExpand: () => void;
  latestNotification?: DBusNotification;
  cpuPercent: number;
  tempC: number;
  timeFormatted: string;
}

export const LevelInfoPill: React.FC<LevelInfoPillProps> = ({
  expression,
  isHovered,
  soundEnabled,
  onClickReaction,
  onExpand,
  latestNotification,
  cpuPercent,
  tempC,
  timeFormatted,
}) => {
  return (
    <div
      onClick={onExpand}
      className="flex items-center gap-3 px-4 py-2 cursor-pointer select-none"
      title="Ghostly Info Pill (Click to open full dashboard)"
    >
      <GhostlyEyes
        expression={expression}
        isHovered={isHovered}
        eyeSize={20}
        pupilSize={7.5}
        soundEnabled={soundEnabled}
        onClickReaction={onClickReaction}
      />

      {/* Info content */}
      {latestNotification ? (
        <div className="flex items-center gap-2 max-w-[280px] text-xs text-white">
          <Bell className="w-3.5 h-3.5 text-blue-400 shrink-0 animate-bounce" />
          <span className="font-semibold text-blue-300 truncate">{latestNotification.appName}:</span>
          <span className="truncate text-slate-200">{latestNotification.summary}</span>
        </div>
      ) : (
        <div className="flex items-center gap-3 text-xs text-slate-300 font-medium">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-mono text-white">{timeFormatted}</span>
          </div>

          <span className="text-white/20">·</span>

          <div className="flex items-center gap-1">
            <CloudSun className="w-3.5 h-3.5 text-amber-400" />
            <span>{tempC}°C</span>
          </div>

          <span className="text-white/20">·</span>

          <div className="flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-mono">{cpuPercent}%</span>
          </div>
        </div>
      )}
    </div>
  );
};
