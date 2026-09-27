import React from 'react';
import { GhostlyEyes } from '../eyes/GhostlyEyes';
import { EyeExpression, MPRISPlayer } from '../../types/ghostly';
import { Play, Pause, Music, Timer } from 'lucide-react';
import { playClickSound } from '../../core/audio';

interface LevelInteractivePillProps {
  expression: EyeExpression;
  isHovered: boolean;
  soundEnabled: boolean;
  onClickReaction: () => void;
  onExpand: () => void;
  activePlayer: MPRISPlayer;
  onTogglePlayPause: () => void;
  timerActive: boolean;
  timerFormatted: string;
}

export const LevelInteractivePill: React.FC<LevelInteractivePillProps> = ({
  expression,
  isHovered,
  soundEnabled,
  onClickReaction,
  onExpand,
  activePlayer,
  onTogglePlayPause,
  timerActive,
  timerFormatted,
}) => {
  return (
    <div
      onClick={onExpand}
      className="flex items-center gap-3.5 px-4 py-2 cursor-pointer select-none"
      title="Ghostly Interactive Pill (Click to open full dashboard)"
    >
      <GhostlyEyes
        expression={expression}
        isHovered={isHovered}
        eyeSize={20}
        pupilSize={7.5}
        soundEnabled={soundEnabled}
        onClickReaction={onClickReaction}
      />

      {/* If timer running, show timer pill, otherwise show media pill */}
      {timerActive ? (
        <div className="flex items-center gap-3 text-xs text-white">
          <div className="flex items-center gap-1.5 text-amber-300">
            <Timer className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
            <span className="font-mono font-bold text-sm tracking-tight text-white">{timerFormatted}</span>
          </div>
          <span className="text-[11px] text-slate-400">Running</span>
        </div>
      ) : (
        <div className="flex items-center gap-3 text-xs text-white">
          {/* Subtle Equalizer Waveform animation */}
          <div className="flex items-center gap-0.5 h-3">
            <span
              className={`w-0.5 bg-emerald-400 rounded-full ${activePlayer.playbackStatus === 'Playing' ? 'animate-bounce h-3' : 'h-1'}`}
              style={{ animationDelay: '0ms', animationDuration: '600ms' }}
            />
            <span
              className={`w-0.5 bg-emerald-400 rounded-full ${activePlayer.playbackStatus === 'Playing' ? 'animate-bounce h-3' : 'h-2'}`}
              style={{ animationDelay: '200ms', animationDuration: '500ms' }}
            />
            <span
              className={`w-0.5 bg-emerald-400 rounded-full ${activePlayer.playbackStatus === 'Playing' ? 'animate-bounce h-3' : 'h-1.5'}`}
              style={{ animationDelay: '400ms', animationDuration: '700ms' }}
            />
          </div>

          {/* Song Title & Artist */}
          <div className="flex items-center gap-1.5 max-w-[200px] truncate">
            <span className="font-semibold text-white truncate">{activePlayer.title}</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-300 truncate text-[11px]">{activePlayer.artist}</span>
          </div>

          {/* Inline Play/Pause Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              playClickSound(soundEnabled);
              onTogglePlayPause();
            }}
            className="p-1.5 rounded-full bg-white text-slate-950 hover:bg-slate-200 transition-transform active:scale-95 shadow-xs"
            title={activePlayer.playbackStatus === 'Playing' ? 'Pause' : 'Play'}
          >
            {activePlayer.playbackStatus === 'Playing' ? (
              <Pause className="w-3 h-3 fill-current" />
            ) : (
              <Play className="w-3 h-3 fill-current ml-0.5" />
            )}
          </button>
        </div>
      )}
    </div>
  );
};
