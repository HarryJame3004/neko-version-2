import { MPRISPlayer } from '../types/ghostly';

export const INITIAL_MPRIS_PLAYERS: MPRISPlayer[] = [
  {
    id: 'spotify',
    name: 'org.mpris.MediaPlayer2.spotify',
    displayName: 'Spotify (Desktop)',
    icon: 'Music',
    playbackStatus: 'Playing',
    title: 'Midnight City',
    artist: 'M83',
    album: 'Hurry Up, We\'re Dreaming',
    artUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%236366f1"/><stop offset="50%" stop-color="%238b5cf6"/><stop offset="100%" stop-color="%23d946ef"/></linearGradient></defs><rect width="300" height="300" fill="url(%23g1)"/><circle cx="150" cy="150" r="70" fill="none" stroke="white" stroke-width="4" opacity="0.6"/><polygon points="140,120 180,150 140,180" fill="white"/></svg>',
    position: 74,
    duration: 243,
    volume: 0.8,
    canGoNext: true,
    canGoPrevious: true,
    canPlay: true,
    canPause: true,
  },
  {
    id: 'firefox',
    name: 'org.mpris.MediaPlayer2.firefox.instance_2941',
    displayName: 'Firefox (YouTube Music)',
    icon: 'Globe',
    playbackStatus: 'Paused',
    title: 'Resonance',
    artist: 'HOME',
    album: 'Odyssey',
    artUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><defs><linearGradient id="g2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%230ea5e9"/><stop offset="50%" stop-color="%2306b6d4"/><stop offset="100%" stop-color="%2310b981"/></linearGradient></defs><rect width="300" height="300" fill="url(%23g2)"/><circle cx="150" cy="150" r="60" fill="none" stroke="white" stroke-width="6" opacity="0.7"/><circle cx="150" cy="150" r="20" fill="white" opacity="0.9"/></svg>',
    position: 112,
    duration: 212,
    volume: 0.9,
    canGoNext: true,
    canGoPrevious: true,
    canPlay: true,
    canPause: true,
  },
  {
    id: 'mpv',
    name: 'org.mpris.MediaPlayer2.mpv',
    displayName: 'mpv Video Player',
    icon: 'PlayCircle',
    playbackStatus: 'Stopped',
    title: 'arch-linux-ricing-timelapse.mkv',
    artist: 'Local Media',
    album: 'Videos',
    artUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><defs><linearGradient id="g3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23172554"/><stop offset="100%" stop-color="%231e3a8a"/></linearGradient></defs><rect width="300" height="300" fill="url(%23g3)"/><polygon points="100,240 150,80 200,240" fill="none" stroke="%2338bdf8" stroke-width="8"/><polygon points="120,240 150,140 180,240" fill="%2338bdf8" opacity="0.5"/></svg>',
    position: 0,
    duration: 540,
    volume: 0.7,
    canGoNext: false,
    canGoPrevious: false,
    canPlay: true,
    canPause: false,
  },
];

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}
