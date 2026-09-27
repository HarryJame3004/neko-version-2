import React, { useState, useEffect } from 'react';
import { MPRISPlayer } from '../../types/ghostly';
import { INITIAL_MPRIS_PLAYERS, formatTime } from '../../core/mpris-state';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music, Disc3 } from 'lucide-react';
import { playClickSound } from '../../core/audio';

interface MediaMPRISProps {
  soundEnabled?: boolean;
  activePlayer: MPRISPlayer;
  onUpdatePlayer: (player: MPRISPlayer) => void;
  playersList?: MPRISPlayer[];
  onSelectPlayer?: (playerId: string) => void;
}

export const MediaMPRIS: React.FC<MediaMPRISProps> = ({
  soundEnabled = true,
  activePlayer,
  onUpdatePlayer,
  playersList = INITIAL_MPRIS_PLAYERS,
  onSelectPlayer,
}) => {
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubPosition, setScrubPosition] = useState(activePlayer.position);

  // Sync scrub position when not dragging
  useEffect(() => {
    if (!isScrubbing) {
      setScrubPosition(activePlayer.position);
    }
  }, [activePlayer.position, isScrubbing]);

  const togglePlayPause = () => {
    playClickSound(soundEnabled);
    onUpdatePlayer({
      ...activePlayer,
      playbackStatus: activePlayer.playbackStatus === 'Playing' ? 'Paused' : 'Playing',
    });
  };

  const handleNext = () => {
    playClickSound(soundEnabled);
    onUpdatePlayer({
      ...activePlayer,
      position: 0,
    });
  };

  const handlePrevious = () => {
    playClickSound(soundEnabled);
    onUpdatePlayer({
      ...activePlayer,
      position: 0,
    });
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setScrubPosition(val);
  };

  const handleSeekCommit = () => {
    setIsScrubbing(false);
    onUpdatePlayer({
      ...activePlayer,
      position: scrubPosition,
    });
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    onUpdatePlayer({
      ...activePlayer,
      volume: vol,
    });
  };

  const progressPercent = (scrubPosition / (activePlayer.duration || 1)) * 100;

  return (
    <div className="flex flex-col gap-4 text-slate-100 p-1">
      {/* Player Switcher (MPRIS D-Bus Bus Selector) */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono text-slate-400">MPRIS2 D-Bus Bus</span>
        </div>
        <div className="flex items-center gap-1.5">
          {playersList.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                playClickSound(soundEnabled);
                onSelectPlayer?.(p.id);
              }}
              className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                p.id === activePlayer.id
                  ? 'bg-white/20 text-white font-medium shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              {p.displayName.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Track Display */}
      <div className="flex items-center gap-4">
        {/* Album Artwork with fallback */}
        <div className="relative w-20 h-20 rounded-xl overflow-hidden shadow-md shrink-0 bg-slate-800 border border-white/10">
          <img
            src={activePlayer.artUrl}
            alt={activePlayer.album}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          {activePlayer.playbackStatus === 'Playing' && (
            <div className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/60 backdrop-blur-xs flex items-center gap-0.5">
              <span className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1 h-1.5 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          )}
        </div>

        {/* Track Metadata */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-0.5">
            <span className="truncate">{activePlayer.album}</span>
          </div>
          <h4 className="text-base font-semibold text-white truncate tracking-tight">
            {activePlayer.title}
          </h4>
          <p className="text-sm text-slate-300 truncate mt-0.5">
            {activePlayer.artist}
          </p>
        </div>
      </div>

      {/* Track Progress Scrubber */}
      <div className="space-y-1">
        <div className="relative w-full h-2 group flex items-center cursor-pointer">
          <input
            type="range"
            min={0}
            max={activePlayer.duration}
            value={scrubPosition}
            onMouseDown={() => setIsScrubbing(true)}
            onTouchStart={() => setIsScrubbing(true)}
            onChange={handleSeek}
            onMouseUp={handleSeekCommit}
            onTouchEnd={handleSeekCommit}
            className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
          />
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-blue-400 to-indigo-400 rounded-full transition-all duration-75"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        <div className="flex justify-between text-[11px] font-mono text-slate-400">
          <span>{formatTime(scrubPosition)}</span>
          <span>{formatTime(activePlayer.duration)}</span>
        </div>
      </div>

      {/* Playback Controls & Volume */}
      <div className="flex items-center justify-between pt-1">
        {/* Left Audio Device Info */}
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Disc3 className={`w-3.5 h-3.5 ${activePlayer.playbackStatus === 'Playing' ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
          <span className="truncate max-w-[100px]">PipeWire / ALSA</span>
        </div>

        {/* Center Control Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevious}
            className="p-2 rounded-full hover:bg-white/10 text-slate-200 hover:text-white transition-colors cursor-pointer"
            title="Previous (D-Bus MPRIS)"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlayPause}
            className="p-3 rounded-full bg-white text-slate-950 hover:bg-slate-200 transition-transform active:scale-95 shadow-md cursor-pointer"
            title={activePlayer.playbackStatus === 'Playing' ? 'Pause' : 'Play'}
          >
            {activePlayer.playbackStatus === 'Playing' ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={handleNext}
            className="p-2 rounded-full hover:bg-white/10 text-slate-200 hover:text-white transition-colors cursor-pointer"
            title="Next (D-Bus MPRIS)"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Volume Slider */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpdatePlayer({ ...activePlayer, volume: activePlayer.volume === 0 ? 0.8 : 0 })}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            {activePlayer.volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={activePlayer.volume}
            onChange={handleVolume}
            className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-400"
            title={`Volume: ${Math.round(activePlayer.volume * 100)}%`}
          />
        </div>
      </div>
    </div>
  );
};
