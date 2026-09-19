import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { usePreferences } from '../context/PreferencesContext';
import { RADIUS, SPACING } from '../constants/theme';
import type { MainTabParamList } from '../navigation/types';

type Nav = BottomTabNavigationProp<MainTabParamList, 'Profile'>;

export default function ProfileScreen() {
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const { theme, t } = usePreferences();

  const menuItems = [
    { icon: 'settings' as const, label: t('settingsHeader'), tab: 'Settings' as const },
    { icon: 'shield-checkmark' as const, label: t('liveSensors'), tab: 'Settings' as const },
    { icon: 'document-text' as const, label: t('recentActivity'), tab: 'Alerts' as const },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 32 }}>

      <LinearGradient
        colors={['#7B2FF7', '#B76EFF']}
        style={styles.headerCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarLetter}>
            {(user?.name?.[0] ?? '?').toUpperCase()}
          </Text>
        </View>
        <Text style={styles.name}>{user?.name ?? 'Guest'}</Text>
        <Text style={styles.email}>{user?.email ?? ''}</Text>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Member</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Lahore zone</Text>
          </View>
        </View>
      </LinearGradient>

      <Text style={[styles.section, { color: theme.gray }]}>{t('account')}</Text>
      {menuItems.map(item => (
        <TouchableOpacity
          key={item.label}
          style={[styles.menuRow, { backgroundColor: theme.white, borderColor: theme.border }]}
          onPress={() => navigation.navigate(item.tab)}>
          <Ionicons name={item.icon} size={22} color={theme.primary} />
          <Text style={[styles.menuLabel, { color: theme.text }]}>{item.label}</Text>
          <Ionicons name="chevron-forward" size={20} color={theme.gray} />
        </TouchableOpacity>
      ))}

      <View style={[styles.statsCard, { backgroundColor: theme.white, borderColor: theme.border }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statNum, { color: theme.primary }]}>47</Text>
          <Text style={[styles.statLbl, { color: theme.gray }]}>Sessions</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statNum, { color: theme.primary }]}>12</Text>
          <Text style={[styles.statLbl, { color: theme.gray }]}>{t('alerts')}</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statNum, { color: theme.primary }]}>72%</Text>
          <Text style={[styles.statLbl, { color: theme.gray }]}>{t('health')}</Text>
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
  headerCard: {
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatarLetter: {
    color: '#fff',
    fontSize: 40,
    fontWeight: '800',
  },
  name: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
  },
  email: {
    color: 'rgba(255,255,255,0.9)',
    marginTop: 6,
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: SPACING.lg,
    gap: 10,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: { color: '#fff', fontWeight: '600', fontSize: 12 },
  section: {
    fontSize: 13,
    fontWeight: '800',
    marginBottom: SPACING.sm,
    letterSpacing: 0.8,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
    gap: 14,
    borderWidth: 1,
  },
  menuLabel: { flex: 1, fontSize: 16, fontWeight: '600' },
  statsCard: {
    flexDirection: 'row',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.lg,
    borderWidth: 1,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1 },
  statNum: { fontSize: 22, fontWeight: '800' },
  statLbl: { fontSize: 12, marginTop: 4 },
});
