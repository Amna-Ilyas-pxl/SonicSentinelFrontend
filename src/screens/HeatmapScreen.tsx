import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { RADIUS, SPACING } from '../constants/theme';
import { usePreferences } from '../context/PreferencesContext';
import NoiseHeatmap from '../components/NoiseHeatmap';
import { fetchHeatmapPoints } from '../services/api';

const LAHORE_REGION = {
  latitude: 31.5204,
  longitude: 74.3587,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};



export default function HeatmapScreen() {
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const { theme, t } = usePreferences();
  
  const [loading, setLoading] = useState(true);
  const [heatmapData, setHeatmapData] = useState<[number, number, number][]>([]);

  const loadHeatmapData = useCallback(async () => {
    try {
      const data = await fetchHeatmapPoints();
      let points: [number, number, number][] = [];

      if (Array.isArray(data)) {
        points = data
          .map((item: any) => {
            if (Array.isArray(item) && item.length >= 2) {
              return [item[0], item[1], item[2] ?? 0.5] as [number, number, number];
            } else if (item && typeof item === 'object') {
              const lat = item.latitude ?? item.lat;
              const lng = item.longitude ?? item.lng;
              const intensity = item.intensity ?? item.opacity ?? item.value ?? 0.5;
              if (typeof lat === 'number' && typeof lng === 'number') {
                return [lat, lng, intensity] as [number, number, number];
              }
            }
            return null;
          })
          .filter((p): p is [number, number, number] => p !== null);
      }

      setHeatmapData(points);
    } catch (error) {
      console.log('Failed to fetch live heatmap points:', error);
      setHeatmapData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch heatmap data on focus and periodically update it every 10 seconds for real-time accuracy
  useEffect(() => {
    if (!isFocused) return;

    loadHeatmapData();
    const interval = setInterval(loadHeatmapData, 10000);

    return () => clearInterval(interval);
  }, [isFocused, loadHeatmapData]);

  if (!isFocused) {
    return <View style={[styles.placeholder, { backgroundColor: theme.backgroundDeep }]} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundDeep }]}>
      {loading && (
        <View style={[styles.loading, { backgroundColor: theme.background }]}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.textMuted }]}>Loading map…</Text>
        </View>
      )}

      <NoiseHeatmap dataPoints={heatmapData} />

      <View style={[styles.topOverlay, { top: insets.top + 12, backgroundColor: theme.white, borderColor: theme.border }]} pointerEvents="none">
        <Text style={[styles.overlayTitle, { color: theme.text }]}>{t('noiseHeatmapHeader')}</Text>
        <Text style={[styles.overlaySub, { color: theme.textMuted }]}>{t('lahoreZones')}</Text>
      </View>

      {!loading && (
        <View style={[styles.legend, { bottom: insets.bottom + 16, backgroundColor: theme.white, borderColor: theme.border }]} pointerEvents="none">
          <Text style={[styles.legendTitle, { color: theme.text }]}>{t('intensity')}</Text>
          <View style={styles.legendBar}>
            <View style={[styles.legendSeg, { backgroundColor: '#7B2FF7' }]} />
            <View style={[styles.legendSeg, { backgroundColor: '#5A1FD4' }]} />
            <View style={[styles.legendSeg, { backgroundColor: '#B76EFF' }]} />
            <View style={[styles.legendSeg, { backgroundColor: '#E53E3E' }]} />
          </View>
          <View style={styles.legendLabels}>
            <Text style={[styles.legendLbl, { color: theme.gray }]}>{t('low')}</Text>
            <Text style={[styles.legendLbl, { color: theme.gray }]}>{t('med')}</Text>
            <Text style={[styles.legendLbl, { color: theme.gray }]}>{t('high')}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  placeholder: {
    flex: 1,
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  loadingText: {
    marginTop: SPACING.md,
    fontWeight: '600',
  },
  topOverlay: {
    position: 'absolute',
    left: SPACING.lg,
    right: SPACING.lg,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    zIndex: 1,
  },
  overlayTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  overlaySub: {
    fontSize: 13,
    marginTop: 4,
  },
  legend: {
    position: 'absolute',
    left: SPACING.lg,
    right: SPACING.lg,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderWidth: 1,
    zIndex: 1,
  },
  legendTitle: {
    fontWeight: '700',
    marginBottom: 8,
  },
  legendBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  legendSeg: { flex: 1 },
  legendLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  legendLbl: { fontSize: 11, fontWeight: '600' },
});

