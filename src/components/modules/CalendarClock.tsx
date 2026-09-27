import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin } from 'lucide-react';
import { playClickSound } from '../../core/audio';

interface CalendarClockProps {
  soundEnabled?: boolean;
}

interface CalendarEvent {
  day: number;
  title: string;
  category: 'system' | 'plasma' | 'personal';
  time: string;
}

export const CalendarClock: React.FC<CalendarClockProps> = ({ soundEnabled = true }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number>(currentDate.getDate());

  // Real-time ticking clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeFormatted = currentDate.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const dateFormatted = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Example Arch/KDE specific schedule events
  const events: CalendarEvent[] = [
    { day: currentDate.getDate(), title: 'Ghostly Companion Running', category: 'personal', time: 'Active' },
    { day: 28, title: 'Arch Linux Core Repository Sync', category: 'system', time: '04:00 UTC' },
    { day: 30, title: 'KDE Plasma Bugfix Release Cycle', category: 'plasma', time: '14:30' },
  ];

  // Calendar math for current month
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthName = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const paddingArray = Array.from({ length: firstDayIndex }, (_, i) => i);

  return (
    <div className="flex flex-col gap-4 text-slate-100 p-1">
      {/* Top Digital Clock Display */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
        <div className="space-y-0.5">
          <div className="text-3xl font-bold font-mono tracking-tight text-white flex items-baseline gap-2">
            <span>{timeFormatted}</span>
            <span className="text-xs font-sans text-slate-400 font-normal">ICT / UTC+7</span>
          </div>
          <div className="text-xs text-slate-300 font-medium">
            {dateFormatted}
          </div>
        </div>

        <div className="flex flex-col items-end text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>NTP Synced</span>
          </span>
          <span className="text-[10px] text-slate-400 mt-1">systemd-timesyncd</span>
        </div>
      </div>

      {/* Calendar Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-blue-400" />
          <h4 className="text-xs font-semibold text-white tracking-wide">{monthName}</h4>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => playClickSound(soundEnabled)}
            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => playClickSound(soundEnabled)}
            className="p-1 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Month Days Grid */}
      <div className="bg-white/5 p-3 rounded-xl border border-white/10">
        {/* Days of week */}
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-slate-400 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
            <span key={d}>{d}</span>
          ))}
        </div>

        {/* Days numbers */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-mono">
          {paddingArray.map((p) => (
            <div key={`pad-${p}`} className="h-7" />
          ))}

          {daysArray.map((day) => {
            const isToday = day === currentDate.getDate();
            const isSelected = day === selectedDay;
            const hasEvent = events.some((e) => e.day === day);

            return (
              <button
                key={day}
                onClick={() => {
                  playClickSound(soundEnabled);
                  setSelectedDay(day);
                }}
                className={`h-7 rounded-md relative flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-blue-500 text-white font-semibold shadow-xs'
                    : isToday
                    ? 'bg-white/20 text-white font-semibold'
                    : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                <span>{day}</span>
                {hasEvent && !isSelected && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-blue-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Agenda */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Events for {currentDate.toLocaleString('en-US', { month: 'short' })} {selectedDay}
        </span>
        <div className="space-y-1">
          {events.filter((e) => e.day === selectedDay).length > 0 ? (
            events
              .filter((e) => e.day === selectedDay)
              .map((evt, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        evt.category === 'system'
                          ? 'bg-amber-400'
                          : evt.category === 'plasma'
                          ? 'bg-blue-400'
                          : 'bg-emerald-400'
                      }`}
                    />
                    <span className="font-medium text-slate-200">{evt.title}</span>
                  </div>
                  <span className="text-slate-400 font-mono text-[11px]">{evt.time}</span>
                </div>
              ))
          ) : (
            <p className="text-xs text-slate-400 italic py-1">No scheduled system maintenance or events.</p>
          )}
        </div>
      </div>
    </div>
  );
};
