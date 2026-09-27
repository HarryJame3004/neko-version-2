import { GhostlyConfig } from '../types/ghostly';

export const DEFAULT_CONFIG: GhostlyConfig = {
  theme: 'dark',
  bgOpacity: 0.82,
  blurAmount: 20,
  cornerRadius: 24,
  position: 'top-center',
  displayBackend: 'wayland',
  monitorId: 'eDP-1 (Primary 1440p)',
  fractionalScale: 1.0,
  fullscreenBehavior: 'autodock',
  enabledModules: {
    eyes: true,
    media: true,
    system: true,
    timer: true,
    weather: true,
    clock: true,
    calendar: true,
    controls: true,
    notifications: true,
    browser: true,
  },
  autostart: true,
  soundEffects: true,
  debugMode: false,
  autoFadeIdle: true,
  idleTimeoutSeconds: 6,
  idleDimOpacity: 0.35,
};

const STORAGE_KEY = 'ghostly_config_v1';

export function loadConfig(): GhostlyConfig {
  try {
    const item = localStorage.getItem(STORAGE_KEY);
    if (item) {
      const parsed = JSON.parse(item);
      return { ...DEFAULT_CONFIG, ...parsed, enabledModules: { ...DEFAULT_CONFIG.enabledModules, ...parsed.enabledModules } };
    }
  } catch (e) {
    console.warn('Failed to load ghostly config from localStorage:', e);
  }
  return DEFAULT_CONFIG;
}

export function saveConfig(config: GhostlyConfig) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.warn('Failed to save ghostly config to localStorage:', e);
  }
}

/**
 * Generates the standard ~/.config/ghostly/config.toml representation
 */
export function generateTomlConfig(config: GhostlyConfig): string {
  return `# Ghostly Configuration File
# Location: ~/.config/ghostly/config.toml
# Platform: Arch Linux (KDE Plasma / Wayland / X11)

[general]
theme = "${config.theme}"
bg_opacity = ${config.bgOpacity}
blur_amount = ${config.blurAmount}
corner_radius = ${config.cornerRadius}
position = "${config.position}"
display_backend = "${config.displayBackend}"
monitor = "${config.monitorId}"
fractional_scale = ${config.fractionalScale}
fullscreen_behavior = "${config.fullscreenBehavior}"
autostart = ${config.autostart}
sound_effects = ${config.soundEffects}
debug = ${config.debugMode}
auto_fade_idle = ${config.autoFadeIdle}
idle_timeout_seconds = ${config.idleTimeoutSeconds}
idle_dim_opacity = ${config.idleDimOpacity}

[modules]
eyes = ${config.enabledModules.eyes}
media = ${config.enabledModules.media}
system = ${config.enabledModules.system}
timer = ${config.enabledModules.timer}
weather = ${config.enabledModules.weather}
clock = ${config.enabledModules.clock}
calendar = ${config.enabledModules.calendar}
controls = ${config.enabledModules.controls}
notifications = ${config.enabledModules.notifications}
browser = ${config.enabledModules.browser}

[mpris]
preferred_players = ["spotify", "firefox", "chromium", "mpv", "vlc"]
smooth_waveform = true

[system_monitor]
poll_interval_ms = 800
thermal_zone = "/sys/class/thermal/thermal_zone0/temp"
use_lm_sensors = true
`;
}
