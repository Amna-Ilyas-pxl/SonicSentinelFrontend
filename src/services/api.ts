import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from '../config/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

/** Call when backend folder is wired up — e.g. after login store token and set here */
export function setAuthToken(token: string | null) {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
}

export async function fetchHealthSummary() {
  const { data } = await apiClient.get(API_ENDPOINTS.acoustic.health);
  return data;
}

export async function fetchAlerts() {
  const { data } = await apiClient.get(API_ENDPOINTS.acoustic.alerts);
  return data;
}

export async function fetchHeatmapPoints() {
  const { data } = await apiClient.get(API_ENDPOINTS.acoustic.heatmap);
  return data;
}

export async function postHeatmapPoint(latitude: number, longitude: number, intensity: number, dbLevel?: number) {
  const { data } = await apiClient.post(API_ENDPOINTS.acoustic.heatmap, {
    latitude,
    longitude,
    intensity,
    db_level: dbLevel,
  });
  return data;
}
