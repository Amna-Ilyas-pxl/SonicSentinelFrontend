import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';
import { usePreferences } from '../context/PreferencesContext';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import type { MainTabParamList } from '../navigation/types';
import DashboardFeatureCard from '../components/DashboardFeatureCard';
import type { TranslationKey } from '../constants/translations';
import { fetchHealthSummary, fetchAlerts } from '../services/api';

const { width } = Dimensions.get('window');

type Nav = BottomTabNavigationProp<MainTabParamList, 'Dashboard'>;

const QUICK_ACTIONS: {
  tab: keyof MainTabParamList;
  labelKey: TranslationKey;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}[] = [
  { tab: 'Monitor', labelKey: 'listen', icon: 'mic', color: '#7B2FF7' },
  { tab: 'Heatmap', labelKey: 'map', icon: 'map', color: '#5B8DEF' },
  { tab: 'Alerts', labelKey: 'alerts', icon: 'warning', color: '#FF4D6D' },
  { tab: 'Health', labelKey: 'health', icon: 'heart', color: '#2ECC71' },
];

export default function DashboardScreen() {
  const { user } = useAuth();
  const { theme, t } = usePreferences();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const isFocused = useIsFocused();
  const userName = user?.name ?? 'there';

  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [avgDb, setAvgDb] = useState(52);
  const [eventsCount, setEventsCount] = useState(0);
  const [safetyScore, setSafetyScore] = useState(72);
  const [recentEvents, setRecentEvents] = useState<any[]>([]);

  const loadDashboardData = async () => {
    try {
      const health = await fetchHealthSummary();
      if (health) {
        setAvgDb(health.avgDb ?? 52);
        setSafetyScore(health.score ?? 72);
      }
      
      const alerts = await fetchAlerts();
      if (Array.isArray(alerts)) {
        setEventsCount(alerts.length);
        
        // Map alert records to recent activity format
        const mapped = alerts.slice(0, 3).map((a: any) => ({
          id: a.id,
          title: a.title,
          time: a.time,
          level: a.severity === 'critical' ? t('high') : a.severity === 'high' ? t('moderate') : t('low'),
          color: a.severity === 'critical' ? COLORS.danger : a.severity === 'high' ? COLORS.warning : COLORS.success
        }));
        setRecentEvents(mapped);
      }
    } catch (e) {
      console.log('Failed to fetch dashboard live stats:', e);
      // Fallback fallback default events
      setRecentEvents([
        { id: '1', title: t('trafficPeak'), time: `12 ${t('minAgo')}`, level: t('moderate'), color: COLORS.warning },
        { id: '2', title: t('constructionDrone'), time: `1 ${t('hrAgo')}`, level: t('low'), color: COLORS.success },
        { id: '3', title: t('sirenPass'), time: `3 ${t('hrAgo')}`, level: t('high'), color: COLORS.danger },
      ]);
    }
  };

  useEffect(() => {
    if (isFocused) {
      loadDashboardData();
      const interval = setInterval(loadDashboardData, 8000);
      return () => clearInterval(interval);
    }
  }, [isFocused]);

  const goTo = (tab: keyof MainTabParamList) => {
    navigation.navigate(tab);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{
        paddingTop: insets.top + 8,
        paddingBottom: insets.bottom + 24,
      }}
      showsVerticalScrollIndicator={false}>

      <LinearGradient
        colors={['#7B2FF7', '#B76EFF', '#E8DCFF']}
        style={styles.hero}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}>
        <Text style={styles.heroLabel}>{t('heroLabel')}</Text>
        <Text style={styles.heroTitle}>Hi, {userName} 👋</Text>
        <Text style={styles.heroSub}>{t('heroSub')}</Text>
        <View style={styles.heroPills}>
          <View style={styles.pill}>
            <Ionicons name="shield-checkmark" size={14} color="#fff" />
            <Text style={styles.pillText}>{t('protected')}</Text>
          </View>
          <View style={styles.pill}>
            <Ionicons name="pulse" size={14} color="#fff" />
            <Text style={styles.pillText}>{t('liveSensors')}</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.statsRow}>
        <Pressable
          onHoverIn={() => setHoveredCard(0)}
          onHoverOut={() => setHoveredCard(null)}
          onPressIn={() => setHoveredCard(0)}
          onPressOut={() => setHoveredCard(null)}
          style={[
            styles.statCard,
            { backgroundColor: theme.white, borderColor: theme.border },
            hoveredCard === 0 ? { borderColor: theme.primary, borderWidth: 1.5 } : { borderWidth: 1 }
          ]}>
          <Ionicons name="checkmark-circle" size={22} color={avgDb < 75 && eventsCount === 0 ? COLORS.success : COLORS.warning} />
          <Text style={[styles.statLabel, { color: theme.gray }]}>{t('last24h')}</Text>
          <Text style={[styles.statValue, { color: theme.text }]}>{avgDb < 75 && eventsCount === 0 ? t('allClear') : t('moderate')}</Text>
        </Pressable>

        <Pressable
          onHoverIn={() => setHoveredCard(1)}
          onHoverOut={() => setHoveredCard(null)}
          onPressIn={() => setHoveredCard(1)}
          onPressOut={() => setHoveredCard(null)}
          style={[
            styles.statCard,
            { backgroundColor: theme.white, borderColor: theme.border },
            hoveredCard === 1 ? { borderColor: theme.primary, borderWidth: 1.5 } : { borderWidth: 1 }
          ]}>
          <Ionicons name="notifications" size={22} color={COLORS.warning} />
          <Text style={[styles.statLabel, { color: theme.gray }]}>{t('events')}</Text>
          <Text style={[styles.statValue, { color: theme.text }]}>{eventsCount}</Text>
        </Pressable>

        <Pressable
          onHoverIn={() => setHoveredCard(2)}
          onHoverOut={() => setHoveredCard(null)}
          onPressIn={() => setHoveredCard(2)}
          onPressOut={() => setHoveredCard(null)}
          style={[
            styles.statCard,
            { backgroundColor: theme.white, borderColor: theme.border },
            hoveredCard === 2 ? { borderColor: theme.primary, borderWidth: 1.5 } : { borderWidth: 1 }
          ]}>
          <Ionicons name="volume-high" size={22} color={theme.primary} />
          <Text style={[styles.statLabel, { color: theme.gray }]}>{t('avgDb')}</Text>
          <Text style={[styles.statValue, { color: theme.text }]}>{avgDb}</Text>
        </Pressable>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('quickActions')}</Text>
      <View style={styles.quickRow}>
        {QUICK_ACTIONS.map(action => (
          <TouchableOpacity
            key={action.tab}
            style={styles.quickBtn}
            onPress={() => goTo(action.tab)}>
            <View style={[styles.quickIcon, { backgroundColor: action.color }]}>
              <Ionicons name={action.icon} size={22} color="#fff" />
            </View>
            <Text style={[styles.quickLabel, { color: theme.textMuted }]}>{t(action.labelKey)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('explore')}</Text>

      <DashboardFeatureCard
        title={t('liveMonitorTitle')}
        description={t('liveMonitorDesc')}
        icon="mic"
        colors={['#5A1FD4', '#9B6BFF']}
        badge="LIVE"
        onPress={() => goTo('Monitor')}
        style={styles.featureSpacing}
      />

      <DashboardFeatureCard
        title={t('noiseHeatmapTitle')}
        description={t('noiseHeatmapDesc')}
        icon="map"
        colors={['#3D5AFE', '#7B9FFF']}
        onPress={() => goTo('Heatmap')}
        style={styles.featureSpacing}
      />

      <DashboardFeatureCard
        title={t('healthDashboardTitle')}
        description={t('healthDashboardDesc')}
        icon="heart"
        colors={['#0D9B6B', '#5DDFAB']}
        badge={`${safetyScore}% SAFE`}
        onPress={() => goTo('Health')}
        style={styles.featureSpacing}
      />

      <DashboardFeatureCard
        title={t('emergencyAlertsTitle')}
        description={t('emergencyAlertsDesc')}
        icon="warning"
        colors={['#C62828', '#FF6B6B']}
        badge={`${eventsCount} NEW`}
        onPress={() => goTo('Alerts')}
        style={styles.featureSpacing}
      />

      <TouchableOpacity
        style={[styles.outlineCard, { backgroundColor: theme.white, borderColor: theme.border }]}
        onPress={() => goTo('Profile')}>
        <Ionicons name="person-circle" size={32} color={theme.primary} />
        <View style={styles.outlineText}>
          <Text style={[styles.outlineTitle, { color: theme.text }]}>{t('profileAccountTitle')}</Text>
          <Text style={[styles.outlineSub, { color: theme.textMuted }]}>{t('profileAccountSub')}</Text>
        </View>
        <Ionicons name="chevron-forward" size={22} color={theme.gray} />
      </TouchableOpacity>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('recentActivity')}</Text>
      {recentEvents.map(event => (
        <View key={event.id} style={[styles.activityRow, { backgroundColor: theme.white, borderColor: theme.border }]}>
          <View style={[styles.activityDot, { backgroundColor: event.color }]} />
          <View style={styles.activityBody}>
            <Text style={[styles.activityTitle, { color: theme.text }]}>{event.title}</Text>
            <Text style={[styles.activityTime, { color: theme.gray }]}>{event.time}</Text>
          </View>
          <Text style={[styles.activityLevel, { color: event.color }]}>
            {event.level}
          </Text>
        </View>
      ))}

      <View style={[styles.tipCard, { backgroundColor: theme.white, borderColor: theme.border }]}>
        <Ionicons name="bulb" size={24} color={theme.primary} />
        <View style={styles.tipText}>
          <Text style={[styles.tipTitle, { color: theme.primary }]}>{t('safetyTip')}</Text>
          <Text style={[styles.tipBody, { color: theme.textMuted }]}>{t('safetyTipBody')}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  hero: {
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  heroLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 1.2,
  },
  heroTitle: {
    fontSize: width * 0.075,
    fontWeight: '800',
    color: '#fff',
    marginTop: 8,
  },
  heroSub: {
    color: 'rgba(255,255,255,0.9)',
    marginTop: 8,
    lineHeight: 22,
    fontSize: 15,
  },
  heroPills: {
    flexDirection: 'row',
    marginTop: SPACING.lg,
    gap: 10,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  pillText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginTop: 8,
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: SPACING.md,
  },
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  quickBtn: {
    alignItems: 'center',
    width: (width - 40 - 30) / 4,
  },
  quickIcon: {
    width: 52,
    height: 52,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  featureSpacing: {
    marginBottom: SPACING.md,
  },
  outlineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    borderWidth: 1,
  },
  outlineText: { flex: 1, marginLeft: SPACING.md },
  outlineTitle: { fontSize: 17, fontWeight: '700' },
  outlineSub: { fontSize: 13, marginTop: 4 },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
  },
  activityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: SPACING.md,
  },
  activityBody: { flex: 1 },
  activityTitle: { fontWeight: '700' },
  activityTime: { fontSize: 12, marginTop: 2 },
  activityLevel: { fontSize: 12, fontWeight: '700' },
  tipCard: {
    flexDirection: 'row',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.md,
    borderWidth: 1,
  },
  tipText: { flex: 1, marginLeft: SPACING.md },
  tipTitle: { fontWeight: '800', marginBottom: 6 },
  tipBody: { lineHeight: 20, fontSize: 14 },
});
