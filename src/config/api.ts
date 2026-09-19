/**
 * Point this at your backend when the folder is in the project or deployed.
 * Local Android emulator: http://10.0.2.2:3000
 * Physical device on same Wi‑Fi: http://YOUR_PC_IP:3000
 */
//export const API_BASE_URL =
export const API_BASE_URL = 'https://sonicsentinelbackend-1.onrender.com/api';

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    profile: '/auth/me',
  },
  acoustic: {
    live: '/acoustic/live',
    heatmap: '/acoustic/heatmap',
    alerts: '/acoustic/alerts',
    health: '/acoustic/health',
  },
} as const;
