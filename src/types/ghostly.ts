/**
 * Ghostly Type Definitions
 * Designed for Arch Linux KDE Plasma Dynamic Island Companion
 */

export type IslandLevel = 1 | 2 | 3 | 4 | 5;

export type ActiveTab = 'media' | 'system' | 'timer' | 'weather' | 'calendar' | 'controls' | 'browser' | 'packaging';

export type EyeExpression = 'neutral' | 'curious' | 'happy' | 'focused' | 'sleepy' | 'alert' | 'musical';

export interface EyeConfig {
  size: number; // eyeball diameter in px (default ~18-24px)
  pupilSize: number; // pupil diameter in px (default ~7-9px)
  spacing: number; // space between eyes
  followStrength: number; // spring stiffness (0.05 to 0.3)
  maxDisplacement: number; // max px pupil can move from center
  blinkIntervalMin: number; // ms min
  blinkIntervalMax: number; // ms max
}

export interface MPRISPlayer {
  id: string;
  name: string; // e.g. "org.mpris.MediaPlayer2.spotify"
  displayName: string; // e.g. "Spotify"
  icon: string;
  playbackStatus: 'Playing' | 'Paused' | 'Stopped';
  title: string;
  artist: string;
  album: string;
  artUrl: string;
  position: number; // in seconds
  duration: number; // in seconds
  volume: number; // 0.0 to 1.0
  canGoNext: boolean;
  canGoPrevious: boolean;
  canPlay: boolean;
  canPause: boolean;
}

export interface LinuxSystemMetrics {
  cpuUsageTotal: number; // 0 - 100%
  cpuCores: number[]; // usage per core (e.g. 8 cores)
  cpuTemp: number; // in °C (lm_sensors /sys/class/thermal)
  ramUsed: number; // in GB
  ramTotal: number; // in GB
  ramPercent: number; // 0 - 100%
  swapUsed: number; // in GB
  swapTotal: number; // in GB
  gpuUsage: number; // 0 - 100%
  gpuTemp: number; // in °C
  networkDownRate: number; // KB/s
  networkUpRate: number; // KB/s
  batteryPercent: number; // 0 - 100%
  batteryState: 'Discharging' | 'Charging' | 'Full';
  uptimeSeconds: number;
  diskPercent: number;
}

export interface DBusNotification {
  id: number;
  appName: string;
  appIcon?: string;
  summary: string;
  body: string;
  urgency: 'low' | 'normal' | 'critical';
  timestamp: Date;
  actions?: { id: string; label: string }[];
}

export interface WeatherData {
  city: string;
  country: string;
  tempC: number;
  condition: string;
  icon: string;
  feelsLikeC: number;
  humidity: number;
  windKmh: number;
  uvIndex: number;
  forecast: { day: string; high: number; low: number; icon: string; condition: string }[];
  isOnline: boolean;
  lastUpdated: Date;
}

export interface GhostlyConfig {
  theme: 'dark' | 'light' | 'breeze' | 'amoled';
  bgOpacity: number; // 0.4 to 0.95
  blurAmount: number; // px blur (e.g. 16px backdrop-filter)
  cornerRadius: number; // px
  position: 'top-center' | 'top-left' | 'top-right' | 'free';
  displayBackend: 'wayland' | 'x11';
  monitorId: string;
  fractionalScale: number; // 1.0, 1.25, 1.5, 2.0
  fullscreenBehavior: 'always' | 'hide' | 'autodock';
  enabledModules: {
    eyes: boolean;
    media: boolean;
    system: boolean;
    timer: boolean;
    weather: boolean;
    clock: boolean;
    calendar: boolean;
    controls: boolean;
    notifications: boolean;
    browser: boolean;
  };
  autostart: boolean;
  soundEffects: boolean;
  debugMode: boolean;
  autoFadeIdle: boolean; // whether to automatically fade/dim when inactive
  idleTimeoutSeconds: number; // seconds before fading (e.g. 5s, 10s, 30s)
  idleDimOpacity: number; // opacity when faded (e.g. 0.25 to 0.45)
}
