import { LinuxSystemMetrics } from '../types/ghostly';

// State to retain smooth history and uptime
let currentUptime = 38420; // in seconds (~10 hours)
let baseCpu = 24;
let baseRam = 7.8;
const totalRam = 16.0;
const totalSwap = 8.0;

export function getInitialLinuxMetrics(): LinuxSystemMetrics {
  return {
    cpuUsageTotal: 28,
    cpuCores: [24, 32, 18, 42, 22, 28, 16, 34],
    cpuTemp: 44, // lm_sensors k10temp / coretemp
    ramUsed: 7.6,
    ramTotal: totalRam,
    ramPercent: Math.round((7.6 / totalRam) * 100),
    swapUsed: 0.8,
    swapTotal: totalSwap,
    gpuUsage: 14,
    gpuTemp: 42,
    networkDownRate: 1420, // KB/s
    networkUpRate: 380, // KB/s
    batteryPercent: 88,
    batteryState: 'Discharging',
    uptimeSeconds: currentUptime,
    diskPercent: 46, // /dev/nvme0n1p2 root partition
  };
}

export function sampleNextLinuxMetrics(prev: LinuxSystemMetrics): LinuxSystemMetrics {
  currentUptime += 1;

  // Gentle random walk for CPU
  const deltaCpu = (Math.random() - 0.48) * 8;
  const newCpu = Math.max(8, Math.min(92, Math.round(baseCpu + deltaCpu)));
  baseCpu = newCpu * 0.3 + baseCpu * 0.7;

  // Multi-core variations (8 logical cores)
  const newCores = prev.cpuCores.map((core) => {
    const jitter = (Math.random() - 0.5) * 14;
    return Math.max(4, Math.min(100, Math.round(newCpu + jitter)));
  });

  // RAM random walk
  const deltaRam = (Math.random() - 0.5) * 0.08;
  const newRam = Math.max(4.0, Math.min(14.5, Number((baseRam + deltaRam).toFixed(1))));
  baseRam = newRam;

  // Thermal walk based on CPU load
  const targetTemp = 39 + Math.round((newCpu / 100) * 32);
  const newCpuTemp = Math.round(prev.cpuTemp * 0.85 + targetTemp * 0.15);

  // Network jitter
  const newDown = Math.max(80, Math.round(prev.networkDownRate + (Math.random() - 0.48) * 400));
  const newUp = Math.max(30, Math.round(prev.networkUpRate + (Math.random() - 0.5) * 120));

  return {
    cpuUsageTotal: newCpu,
    cpuCores: newCores,
    cpuTemp: newCpuTemp,
    ramUsed: newRam,
    ramTotal: totalRam,
    ramPercent: Math.round((newRam / totalRam) * 100),
    swapUsed: 0.8,
    swapTotal: totalSwap,
    gpuUsage: Math.max(5, Math.min(85, Math.round(newCpu * 0.6 + (Math.random() - 0.5) * 10))),
    gpuTemp: Math.max(36, newCpuTemp - 4),
    networkDownRate: newDown,
    networkUpRate: newUp,
    batteryPercent: prev.batteryPercent,
    batteryState: prev.batteryState,
    uptimeSeconds: currentUptime,
    diskPercent: 46,
  };
}

export function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  if (d > 0) return `${d}d ${h}h ${m}m`;
  return `${h}h ${m}m`;
}
