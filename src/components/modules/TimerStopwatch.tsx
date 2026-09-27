import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Flag, Bell, Timer, Watch } from 'lucide-react';
import { playClickSound, playTimerAlarmSound } from '../../core/audio';

interface TimerStopwatchProps {
  soundEnabled?: boolean;
  onAlarmTrigger?: () => void;
  // External sync state for compact pill display
  activeTimeFormatted: string;
  isTimerRunning: boolean;
  onTimerStateChange: (running: boolean, formatted: string) => void;
}

export const TimerStopwatch: React.FC<TimerStopwatchProps> = ({
  soundEnabled = true,
  onAlarmTrigger,
  onTimerStateChange,
}) => {
  const [mode, setMode] = useState<'timer' | 'stopwatch'>('timer');

  // Timer states (in seconds)
  const [timerInitial, setTimerInitial] = useState(300); // 5 min default
  const [timerRemaining, setTimerRemaining] = useState(300);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerFinished, setTimerFinished] = useState(false);

  // Stopwatch states (in deciseconds: 100ms units)
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && timerRemaining > 0) {
      interval = setInterval(() => {
        setTimerRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setTimerRunning(false);
            setTimerFinished(true);
            playTimerAlarmSound(soundEnabled);
            onAlarmTrigger?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerRemaining, soundEnabled, onAlarmTrigger]);

  // Stopwatch interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (stopwatchRunning) {
      interval = setInterval(() => {
        setStopwatchTime((prev) => prev + 1);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [stopwatchRunning]);

  // Update external state for compact pill
  useEffect(() => {
    if (mode === 'timer') {
      const m = Math.floor(timerRemaining / 60);
      const s = timerRemaining % 60;
      const formatted = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      onTimerStateChange(timerRunning, formatted);
    } else {
      const totalSec = Math.floor(stopwatchTime / 10);
      const m = Math.floor(totalSec / 60);
      const s = totalSec % 60;
      const formatted = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      onTimerStateChange(stopwatchRunning, formatted);
    }
  }, [timerRemaining, timerRunning, stopwatchTime, stopwatchRunning, mode, onTimerStateChange]);

  const handleStartPauseTimer = () => {
    playClickSound(soundEnabled);
    if (timerRemaining === 0) {
      setTimerRemaining(timerInitial);
      setTimerFinished(false);
    }
    setTimerRunning(!timerRunning);
  };

  const handleResetTimer = () => {
    playClickSound(soundEnabled);
    setTimerRunning(false);
    setTimerRemaining(timerInitial);
    setTimerFinished(false);
  };

  const handleSetPreset = (seconds: number) => {
    playClickSound(soundEnabled);
    setTimerInitial(seconds);
    setTimerRemaining(seconds);
    setTimerRunning(false);
    setTimerFinished(false);
  };

  const handleStartPauseStopwatch = () => {
    playClickSound(soundEnabled);
    setStopwatchRunning(!stopwatchRunning);
  };

  const handleResetStopwatch = () => {
    playClickSound(soundEnabled);
    setStopwatchRunning(false);
    setStopwatchTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    playClickSound(soundEnabled);
    setLaps([stopwatchTime, ...laps]);
  };

  const formatTimerDigits = (totalSec: number) => {
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return {
      minutes: String(m).padStart(2, '0'),
      seconds: String(s).padStart(2, '0'),
    };
  };

  const formatStopwatchDigits = (decisec: number) => {
    const totalSec = Math.floor(decisec / 10);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    const ms = decisec % 10;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${ms}`;
  };

  const timerDigits = formatTimerDigits(timerRemaining);

  return (
    <div className="flex flex-col gap-4 text-slate-100 p-1">
      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg">
          <button
            onClick={() => {
              playClickSound(soundEnabled);
              setMode('timer');
            }}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              mode === 'timer' ? 'bg-white/20 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            <span>Countdown</span>
          </button>
          <button
            onClick={() => {
              playClickSound(soundEnabled);
              setMode('stopwatch');
            }}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              mode === 'stopwatch' ? 'bg-white/20 text-white shadow-xs' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Watch className="w-3.5 h-3.5" />
            <span>Stopwatch</span>
          </button>
        </div>

        {timerFinished && (
          <div className="flex items-center gap-1 text-xs text-rose-400 animate-pulse font-medium">
            <Bell className="w-3.5 h-3.5" />
            <span>Time Up!</span>
          </div>
        )}
      </div>

      {mode === 'timer' ? (
        <div className="flex flex-col items-center gap-4 py-2">
          {/* Large Digit Display */}
          <div className="flex items-center justify-center font-mono text-5xl font-bold tracking-tight text-white">
            <span className="w-20 text-center">{timerDigits.minutes}</span>
            <span className="text-slate-400 -translate-y-1">:</span>
            <span className="w-20 text-center">{timerDigits.seconds}</span>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-2">
            {[
              { label: '1m', sec: 60 },
              { label: '5m', sec: 300 },
              { label: '15m', sec: 900 },
              { label: '25m', sec: 1500 }, // Pomodoro
              { label: '45m', sec: 2700 },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => handleSetPreset(preset.sec)}
                className={`px-2.5 py-1 text-xs font-mono rounded-md border transition-colors ${
                  timerInitial === preset.sec
                    ? 'border-blue-400/50 bg-blue-500/20 text-blue-200'
                    : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleResetTimer}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-colors cursor-pointer"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handleStartPauseTimer}
              className={`px-6 py-2.5 rounded-full font-semibold text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer ${
                timerRunning
                  ? 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                  : 'bg-white hover:bg-slate-200 text-slate-950'
              }`}
            >
              {timerRunning ? (
                <>
                  <Pause className="w-4 h-4 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                  <span>{timerRemaining === 0 ? 'Restart' : 'Start'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 py-1">
          {/* Stopwatch Digit Display */}
          <div className="font-mono text-4xl font-bold tracking-tight text-white">
            {formatStopwatchDigits(stopwatchTime)}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleResetStopwatch}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
              title="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handleStartPauseStopwatch}
              className={`px-5 py-2 rounded-full font-semibold text-xs flex items-center gap-1.5 shadow-md ${
                stopwatchRunning
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-white text-slate-950'
              }`}
            >
              {stopwatchRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
              <span>{stopwatchRunning ? 'Stop' : 'Start'}</span>
            </button>

            {stopwatchRunning && (
              <button
                onClick={handleLap}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 transition-colors"
                title="Lap"
              >
                <Flag className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Laps List */}
          {laps.length > 0 && (
            <div className="w-full max-h-24 overflow-y-auto space-y-1 pt-2 border-t border-white/10">
              {laps.map((lap, i) => (
                <div key={i} className="flex justify-between text-xs font-mono text-slate-400 px-3 py-0.5">
                  <span>Lap {laps.length - i}</span>
                  <span>{formatStopwatchDigits(lap)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
