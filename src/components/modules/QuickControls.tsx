import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Sun,
  Wifi,
  WifiOff,
  Bluetooth,
  Mic,
  MicOff,
  Moon,
  BellOff,
  Camera,
  Lock,
  Headphones,
  Sliders,
  Check,
} from 'lucide-react';
import { playClickSound } from '../../core/audio';

interface QuickControlsProps {
  soundEnabled?: boolean;
  onTriggerScreenshot?: () => void;
  onLockScreen?: () => void;
}

export const QuickControls: React.FC<QuickControlsProps> = ({
  soundEnabled = true,
  onTriggerScreenshot,
  onLockScreen,
}) => {
  // State toggles
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [brightness, setBrightness] = useState(85);
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true);
  const [micMuted, setMicMuted] = useState(false);
  const [nightLight, setNightLight] = useState(false);
  const [dnd, setDnd] = useState(false);
  const [selectedSink, setSelectedSink] = useState('PipeWire: Analog Stereo (Headphones)');
  const [showSinkMenu, setShowSinkMenu] = useState(false);

  const audioSinks = [
    'PipeWire: Analog Stereo (Headphones)',
    'PipeWire: Realtek ALC1220 Line Out',
    'PipeWire: Navi 21 HDMI/DP Audio',
  ];

  const handleToggle = (setter: React.Dispatch<React.SetStateAction<boolean>>, val: boolean) => {
    playClickSound(soundEnabled);
    setter(!val);
  };

  return (
    <div className="flex flex-col gap-4 text-slate-100 p-1">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-blue-400" />
          <span>KDE Plasma Quick Settings</span>
        </div>
        <span className="font-mono text-[11px]">WirePlumber 0.5.8</span>
      </div>

      {/* Sliders: Volume & Brightness */}
      <div className="space-y-3 p-3 rounded-xl bg-white/5 border border-white/10">
        {/* Master Volume */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <button
                onClick={() => {
                  playClickSound(soundEnabled);
                  setIsMuted(!isMuted);
                }}
                className="hover:text-white"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-blue-400" />
                )}
              </button>
              <span>Volume</span>
            </div>
            <span className="font-mono text-slate-400">{isMuted ? 'Muted' : `${volume}%`}</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(Number(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-400"
          />
        </div>

        {/* Display Backlight */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Brightness</span>
            </div>
            <span className="font-mono text-slate-400">{brightness}%</span>
          </div>
          <input
            type="range"
            min={10}
            max={100}
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />
        </div>
      </div>

      {/* Quick Action Toggles Grid */}
      <div className="grid grid-cols-4 gap-2">
        {/* Wi-Fi */}
        <button
          onClick={() => handleToggle(setWifiEnabled, wifiEnabled)}
          className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all cursor-pointer ${
            wifiEnabled
              ? 'bg-blue-500/20 border-blue-400/40 text-blue-200'
              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
          }`}
        >
          {wifiEnabled ? <Wifi className="w-5 h-5 mb-1" /> : <WifiOff className="w-5 h-5 mb-1" />}
          <span className="text-[11px] font-medium truncate max-w-full">
            {wifiEnabled ? 'Arch-Mesh' : 'Wi-Fi Off'}
          </span>
        </button>

        {/* Bluetooth */}
        <button
          onClick={() => handleToggle(setBluetoothEnabled, bluetoothEnabled)}
          className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all cursor-pointer ${
            bluetoothEnabled
              ? 'bg-indigo-500/20 border-indigo-400/40 text-indigo-200'
              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
          }`}
        >
          <Bluetooth className="w-5 h-5 mb-1" />
          <span className="text-[11px] font-medium truncate max-w-full">
            {bluetoothEnabled ? 'BT Active' : 'BT Off'}
          </span>
        </button>

        {/* Night Light */}
        <button
          onClick={() => handleToggle(setNightLight, nightLight)}
          className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all cursor-pointer ${
            nightLight
              ? 'bg-amber-500/20 border-amber-400/40 text-amber-200'
              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
          }`}
        >
          <Moon className="w-5 h-5 mb-1" />
          <span className="text-[11px] font-medium truncate max-w-full">Night Light</span>
        </button>

        {/* Mic Mute */}
        <button
          onClick={() => handleToggle(setMicMuted, micMuted)}
          className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all cursor-pointer ${
            micMuted
              ? 'bg-rose-500/20 border-rose-400/40 text-rose-200'
              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
          }`}
        >
          {micMuted ? <MicOff className="w-5 h-5 mb-1" /> : <Mic className="w-5 h-5 mb-1" />}
          <span className="text-[11px] font-medium truncate max-w-full">
            {micMuted ? 'Mic Muted' : 'Mic Live'}
          </span>
        </button>

        {/* Do Not Disturb */}
        <button
          onClick={() => handleToggle(setDnd, dnd)}
          className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all cursor-pointer ${
            dnd
              ? 'bg-purple-500/20 border-purple-400/40 text-purple-200'
              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
          }`}
        >
          <BellOff className="w-5 h-5 mb-1" />
          <span className="text-[11px] font-medium truncate max-w-full">DND</span>
        </button>

        {/* Screenshot (Spectacle / grim) */}
        <button
          onClick={() => {
            playClickSound(soundEnabled);
            onTriggerScreenshot?.();
          }}
          className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
        >
          <Camera className="w-5 h-5 mb-1 text-sky-400" />
          <span className="text-[11px] font-medium truncate max-w-full">Spectacle</span>
        </button>

        {/* Lock Screen */}
        <button
          onClick={() => {
            playClickSound(soundEnabled);
            onLockScreen?.();
          }}
          className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer col-span-2"
        >
          <div className="flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-medium">Lock Session (KDE)</span>
          </div>
        </button>
      </div>

      {/* Audio Sink Selector */}
      <div className="relative pt-1">
        <button
          onClick={() => {
            playClickSound(soundEnabled);
            setShowSinkMenu(!showSinkMenu);
          }}
          className="w-full flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300 hover:text-white transition-colors"
        >
          <div className="flex items-center gap-2 truncate">
            <Headphones className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="truncate">{selectedSink}</span>
          </div>
          <span className="text-[10px] text-blue-400 underline shrink-0 ml-2">Switch</span>
        </button>

        {showSinkMenu && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-white/20 rounded-xl shadow-xl p-1 z-20 space-y-1">
            {audioSinks.map((sink) => (
              <button
                key={sink}
                onClick={() => {
                  playClickSound(soundEnabled);
                  setSelectedSink(sink);
                  setShowSinkMenu(false);
                }}
                className={`w-full text-left text-xs p-2 rounded-lg flex items-center justify-between ${
                  sink === selectedSink ? 'bg-blue-500/20 text-blue-200' : 'text-slate-300 hover:bg-white/10'
                }`}
              >
                <span className="truncate">{sink}</span>
                {sink === selectedSink && <Check className="w-3.5 h-3.5 text-blue-400 shrink-0 ml-1" />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
