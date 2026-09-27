import React, { useState } from 'react';
import { WeatherData } from '../../types/ghostly';
import { CITIES_WEATHER } from '../../core/weather-data';
import { Sun, Cloud, CloudSun, CloudRain, Wind, Droplets, MapPin, WifiOff, RefreshCw } from 'lucide-react';
import { playClickSound } from '../../core/audio';

interface WeatherModuleProps {
  soundEnabled?: boolean;
}

export const WeatherModule: React.FC<WeatherModuleProps> = ({ soundEnabled = true }) => {
  const [selectedCity, setSelectedCity] = useState<string>('Ho Chi Minh City');
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const weather: WeatherData = CITIES_WEATHER[selectedCity] || CITIES_WEATHER['Ho Chi Minh City'];

  const renderIcon = (iconName: string, className: string = 'w-5 h-5') => {
    switch (iconName) {
      case 'Sun':
        return <Sun className={`${className} text-amber-400`} />;
      case 'CloudSun':
        return <CloudSun className={`${className} text-amber-300`} />;
      case 'CloudRain':
        return <CloudRain className={`${className} text-sky-400`} />;
      case 'Wind':
        return <Wind className={`${className} text-teal-300`} />;
      case 'Cloud':
      default:
        return <Cloud className={`${className} text-slate-300`} />;
    }
  };

  const handleRefresh = () => {
    playClickSound(soundEnabled);
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="flex flex-col gap-4 text-slate-100 p-1">
      {/* Header with City Selector & Offline Toggle */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-blue-400" />
          <select
            value={selectedCity}
            onChange={(e) => {
              playClickSound(soundEnabled);
              setSelectedCity(e.target.value);
            }}
            className="bg-transparent text-xs font-medium text-white border-none outline-hidden cursor-pointer hover:text-blue-300"
          >
            {Object.keys(CITIES_WEATHER).map((c) => (
              <option key={c} value={c} className="bg-slate-900 text-white">
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          {/* Offline test toggle button */}
          <button
            onClick={() => {
              playClickSound(soundEnabled);
              setIsSimulatedOffline(!isSimulatedOffline);
            }}
            title={isSimulatedOffline ? 'Switch to Online mode' : 'Simulate Network Disconnected'}
            className={`text-xs px-2 py-0.5 rounded transition-colors ${
              isSimulatedOffline
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'bg-white/5 text-slate-400 hover:text-slate-200'
            }`}
          >
            {isSimulatedOffline ? 'Offline' : 'Online'}
          </button>

          <button
            onClick={handleRefresh}
            className={`p-1 text-slate-400 hover:text-white transition-transform ${isRefreshing ? 'animate-spin' : ''}`}
            title="Refresh weather data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {isSimulatedOffline ? (
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-2 text-center text-slate-400">
          <WifiOff className="w-8 h-8 text-slate-500" />
          <h4 className="text-sm font-medium text-slate-300">Weather Service Offline</h4>
          <p className="text-xs text-slate-400 max-w-xs">
            Cached location saved. Reconnect network to update meteorological data.
          </p>
        </div>
      ) : (
        <>
          {/* Main Weather Card */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold font-mono tracking-tight text-white">{weather.tempC}°C</span>
                <span className="text-xs text-slate-400 font-medium">Feels {weather.feelsLikeC}°C</span>
              </div>
              <p className="text-xs text-slate-300 font-medium">{weather.condition}</p>
            </div>

            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
              {renderIcon(weather.icon, 'w-10 h-10')}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
                <Droplets className="w-3 h-3 text-sky-400" />
                <span>Humidity</span>
              </div>
              <span className="font-mono font-semibold text-white">{weather.humidity}%</span>
            </div>

            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
                <Wind className="w-3 h-3 text-teal-300" />
                <span>Wind</span>
              </div>
              <span className="font-mono font-semibold text-white">{weather.windKmh} km/h</span>
            </div>

            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
              <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
                <Sun className="w-3 h-3 text-amber-400" />
                <span>UV Index</span>
              </div>
              <span className="font-mono font-semibold text-white">{weather.uvIndex} (Mod)</span>
            </div>
          </div>

          {/* 5-Day Forecast Grid */}
          <div className="grid grid-cols-5 gap-1.5 pt-1">
            {weather.forecast.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center p-2 rounded-lg bg-white/5 text-center text-xs">
                <span className="text-slate-400 font-medium mb-1">{item.day}</span>
                {renderIcon(item.icon, 'w-4 h-4 my-1')}
                <div className="font-mono text-[11px] text-white font-medium mt-0.5">
                  {item.high}°
                </div>
                <div className="font-mono text-[10px] text-slate-400">
                  {item.low}°
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
