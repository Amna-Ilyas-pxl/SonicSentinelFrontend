import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { usePreferences } from '../context/PreferencesContext';
import { useAuth } from '../context/AuthContext';
import { fetchHealthSummary } from '../services/api';

export default function HealthScreen() {
  const insets = useSafeAreaInsets();
  const { theme, t } = usePreferences();
  const { user } = useAuth();
  const isFocused = useIsFocused();

  const [score, setScore] = useState(72);
  const [exposureHours, setExposureHours] = useState(3.0);
  const [peakDb, setPeakDb] = useState(75);
  const [loading, setLoading] = useState(true);

  const loadHealthData = useCallback(async () => {
    try {
      const health = await fetchHealthSummary();
      if (health) {
        setScore(health.score ?? 72);
        setExposureHours(health.exposureHours ?? 3.0);
        setPeakDb(health.peakDb ?? 75);
      }
    } catch (e) {
      console.log('Failed to fetch live health summary:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      loadHealthData();
      const interval = setInterval(loadHealthData, 10000);
      return () => clearInterval(interval);
    }
  }, [isFocused, loadHealthData]);

  const METRICS = [
    { label: t('dailyExposure'), value: `${exposureHours} h`, limit: '8 h WHO max', icon: 'time' as const, pct: Math.min(100, Math.round((exposureHours / 8) * 100)) },
    { label: t('peakLevelToday'), value: `${peakDb} dB`, limit: 'Under 85 dB risk', icon: 'volume-high' as const, pct: Math.min(100, Math.round((peakDb / 110) * 100)) },
    { label: t('nightQuietScore'), value: score > 75 ? 'Good' : 'Moderate', limit: 'Below 40 dB avg', icon: 'moon' as const, pct: score },
  ];

  const TIPS = [
    'Use ear protection in environments above 85 dB for 8+ hours.',
    'Take 10-minute quiet breaks every hour in noisy workplaces.',
    'Enable night mode alerts to track sleep-disrupting noise.',
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}>

      <Text style={[styles.label, { color: theme.secondary }]}>{t('healthHeader')}</Text>
      <Text style={[styles.heading, { color: theme.text }]}>{t('hearingWellness')}</Text>
      <Text style={[styles.sub, { color: theme.textMuted }]}>{t('whoGuidelines')}</Text>

      <View style={[styles.scoreCard, { backgroundColor: theme.white, borderColor: theme.border }]}>
        <View style={[styles.scoreRing, { borderColor: theme.primary }]}>
          <Text style={[styles.scoreValue, { color: theme.primary }]}>{score}%</Text>
        </View>
        <Text style={[styles.scoreLabel, { color: theme.text }]}>{t('safeExposureScore')}</Text>
        <Text style={[styles.scoreHint, { color: score > 70 ? COLORS.success : COLORS.warning }]}>
          {score > 70 ? t('goodWithinLimits') : 'Caution - exposure limits approaching'}
        </Text>
        <View style={[styles.scoreBar, { backgroundColor: theme.border }]}>
          <View style={[styles.scoreFill, { width: `${score}%`, backgroundColor: theme.primary }]} />
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('todaysMetrics')}</Text>
      {METRICS.map(m => (
        <View key={m.label} style={[styles.metricCard, { backgroundColor: theme.white, borderColor: theme.border }]}>
          <View style={[styles.metricIcon, { backgroundColor: theme.backgroundDeep }]}>
            <Ionicons name={m.icon} size={22} color={theme.primary} />
          </View>
          <View style={styles.metricBody}>
            <Text style={[styles.metricLabel, { color: theme.gray }]}>{m.label}</Text>
            <Text style={[styles.metricValue, { color: theme.text }]}>{m.value}</Text>
            <Text style={[styles.metricLimit, { color: theme.textMuted }]}>{m.limit}</Text>
            <View style={[styles.miniBar, { backgroundColor: theme.border }]}>
              <View style={[styles.miniFill, { width: `${m.pct}%`, backgroundColor: theme.secondary }]} />
            </View>
          </View>
        </View>
      ))}

      <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('weeklyTrend')}</Text>
      <View style={[styles.trendCard, { backgroundColor: theme.white, borderColor: theme.border }]}>
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => {
          const uniqueTrendHeight = 24 + (((score + i) * 7) % 5) * 12;
          return (
            <View key={`${day}-${i}`} style={styles.trendCol}>
              <View style={[styles.trendBar, { height: uniqueTrendHeight, backgroundColor: theme.primary }]} />
              <Text style={[styles.trendDay, { color: theme.gray }]}>{day}</Text>
            </View>
          );
        })}
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('recommendations')}</Text>
      {TIPS.map((tip, i) => (
        <View key={i} style={[styles.tipRow, { backgroundColor: theme.white, borderColor: theme.border }]}>
          <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
          <Text style={[styles.tipText, { color: theme.textMuted }]}>{tip}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  label: {
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 1,
  },
  heading: {
    fontSize: 30,
    fontWeight: '800',
    marginTop: 4,
  },
  sub: {
    marginBottom: SPACING.lg,
  },
  scoreCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.xl,
    borderWidth: 1,
  },
  scoreRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: '800',
  },
  scoreLabel: {
    fontSize: 18,
    fontWeight: '700',
  },
  scoreHint: {
    color: COLORS.success,
    marginTop: 6,
    fontWeight: '600',
  },
  scoreBar: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    marginTop: SPACING.lg,
    overflow: 'hidden',
  },
  scoreFill: {
    height: '100%',
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: SPACING.md,
  },
  metricCard: {
    flexDirection: 'row',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
    borderWidth: 1,
  },
  metricIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  metricBody: { flex: 1 },
  metricLabel: { fontSize: 12, fontWeight: '600' },
  metricValue: { fontSize: 20, fontWeight: '800', marginTop: 2 },
  metricLimit: { fontSize: 12, marginTop: 2 },
  miniBar: {
    height: 4,
    borderRadius: 2,
    marginTop: 10,
    overflow: 'hidden',
  },
  miniFill: {
    height: '100%',
    borderRadius: 2,
  },
  trendCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    alignItems: 'flex-end',
    borderWidth: 1,
  },
  trendCol: { alignItems: 'center' },
  trendBar: {
    width: 28,
    borderRadius: 6,
    marginBottom: 8,
    opacity: 0.85,
  },
  trendDay: { fontSize: 11, fontWeight: '600' },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    gap: 10,
    borderWidth: 1,
  },
  tipText: { flex: 1, lineHeight: 20 },
});
