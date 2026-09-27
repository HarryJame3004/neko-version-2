import React from 'react';
import { LinuxSystemMetrics } from '../../types/ghostly';
import { formatUptime } from '../../core/linux-system';
import { Cpu, HardDrive, Wifi, Battery, Thermometer, Clock, Activity, Zap } from 'lucide-react';

interface SystemMonitorProps {
  metrics: LinuxSystemMetrics;
}

export const SystemMonitor: React.FC<SystemMonitorProps> = ({ metrics }) => {
  // Helpers for progress bar colors
  const getLoadColor = (pct: number) => {
    if (pct < 50) return 'bg-emerald-400';
    if (pct < 80) return 'bg-amber-400';
    return 'bg-rose-400';
  };

  const getTempColor = (temp: number) => {
    if (temp < 50) return 'text-emerald-400';
    if (temp < 75) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <div className="flex flex-col gap-4 text-slate-100 p-1">
      {/* Header telemetry info */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2 text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-blue-400" />
          <span>Linux 6.13.4-arch1-1 (x86_64)</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          <span>Up: {formatUptime(metrics.uptimeSeconds)}</span>
        </div>
      </div>

      {/* Grid: CPU & Memory */}
      <div className="grid grid-cols-2 gap-3">
        {/* CPU Card */}
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-medium text-slate-300">AMD Ryzen 7</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <Thermometer className={`w-3.5 h-3.5 ${getTempColor(metrics.cpuTemp)}`} />
              <span className={`font-mono ${getTempColor(metrics.cpuTemp)}`}>{metrics.cpuTemp}°C</span>
            </div>
          </div>

          <div className="flex items-baseline justify-between mb-1">
            <span className="text-2xl font-bold font-mono tracking-tight">{metrics.cpuUsageTotal}%</span>
            <span className="text-[11px] text-slate-400">Total Load</span>
          </div>

          {/* 8 Cores Mini Histogram */}
          <div className="space-y-1">
            <div className="grid grid-cols-8 gap-1 items-end h-7 pt-1">
              {metrics.cpuCores.map((val, idx) => (
                <div key={idx} className="flex flex-col items-center h-full justify-end group relative" title={`Core ${idx}: ${val}%`}>
                  <div
                    className={`w-full rounded-xs transition-all duration-300 ${getLoadColor(val)}`}
                    style={{ height: `${Math.max(12, val)}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>C0</span>
              <span>C7</span>
            </div>
          </div>
        </div>

        {/* Memory & Swap Card */}
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-medium text-slate-300">DDR5 Memory</span>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {metrics.ramUsed} / {metrics.ramTotal} GB
            </span>
          </div>

          <div className="flex items-baseline justify-between mb-1">
            <span className="text-2xl font-bold font-mono tracking-tight">{metrics.ramPercent}%</span>
            <span className="text-[11px] text-slate-400">Used (Active)</span>
          </div>

          <div className="space-y-2 mt-1">
            {/* RAM Bar */}
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-indigo-400 to-blue-400 rounded-full transition-all duration-500"
                style={{ width: `${metrics.ramPercent}%` }}
              />
            </div>

            {/* Swap & Root Partition */}
            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
              <span>Swap: {metrics.swapUsed}G</span>
              <span>Root: {metrics.diskPercent}% used</span>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row: GPU, Network, Power */}
      <div className="grid grid-cols-3 gap-2 text-xs">
        {/* GPU */}
        <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span>GPU Vulkan</span>
            <span className="font-mono">{metrics.gpuTemp}°C</span>
          </div>
          <div className="text-lg font-bold font-mono text-white mt-1">
            {metrics.gpuUsage}%
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden">
            <div
              className="h-full bg-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${metrics.gpuUsage}%` }}
            />
          </div>
        </div>

        {/* Network RX/TX */}
        <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <div className="flex items-center gap-1">
              <Wifi className="w-3 h-3 text-sky-400" />
              <span>wlan0</span>
            </div>
          </div>
          <div className="space-y-0.5 mt-1 font-mono text-[11px]">
            <div className="text-emerald-400 flex items-center justify-between">
              <span>↓ {metrics.networkDownRate > 1024 ? `${(metrics.networkDownRate / 1024).toFixed(1)} MB/s` : `${metrics.networkDownRate} KB/s`}</span>
            </div>
            <div className="text-sky-300 flex items-center justify-between">
              <span>↑ {metrics.networkUpRate} KB/s</span>
            </div>
          </div>
        </div>

        {/* Battery & Thermal */}
        <div className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <div className="flex items-center gap-1">
              <Battery className="w-3 h-3 text-emerald-400" />
              <span>BAT0</span>
            </div>
            <span className="font-mono text-[10px] text-emerald-400">9.2h</span>
          </div>
          <div className="text-lg font-bold font-mono text-white mt-1">
            {metrics.batteryPercent}%
          </div>
          <div className="text-[10px] text-slate-400 truncate">
            {metrics.batteryState} (Discharging)
          </div>
        </div>
      </div>
    </div>
  );
};
