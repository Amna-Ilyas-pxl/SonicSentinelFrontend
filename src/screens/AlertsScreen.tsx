import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RADIUS, SPACING } from '../constants/theme';
import { usePreferences } from '../context/PreferencesContext';
import { fetchAlerts } from '../services/api';

export default function AlertsScreen() {
  const insets = useSafeAreaInsets();
  const { theme, t } = usePreferences();
  const isFocused = useIsFocused();
  
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAlerts = useCallback(async () => {
    try {
      const data = await fetchAlerts();
      if (Array.isArray(data)) {
        setAlerts(data);
      }
    } catch (e) {
      console.log('Failed to fetch live alerts:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isFocused) {
      loadAlerts();
      const interval = setInterval(loadAlerts, 10000);
      return () => clearInterval(interval);
    }
  }, [isFocused, loadAlerts]);

  const severityColor: Record<string, string> = {
    critical: theme.danger,
    high: '#FF8C42',
    medium: theme.warning,
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingBottom: 24 }}>

      <Text style={[styles.label, { color: theme.danger }]}>{t('alertsHeader')}</Text>
      <Text style={[styles.heading, { color: theme.text }]}>{t('emergencyFeed')}</Text>
      <Text style={[styles.sub, { color: theme.textMuted }]}>{t('threatNotifications')}</Text>

      <View style={styles.summaryRow}>
        <View style={[styles.summaryChip, { backgroundColor: theme.white, borderColor: theme.border }]}>
          <Text style={[styles.summaryNum, { color: theme.primary }]}>
            {alerts.filter(a => a.severity === 'critical').length}
          </Text>
          <Text style={[styles.summaryLbl, { color: theme.gray }]}>{t('active')}</Text>
        </View>
        <View style={[styles.summaryChip, { backgroundColor: theme.white, borderColor: theme.border }]}>
          <Text style={[styles.summaryNum, { color: theme.primary }]}>{alerts.length}</Text>
          <Text style={[styles.summaryLbl, { color: theme.gray }]}>{t('thisWeek')}</Text>
        </View>
        <View style={[styles.summaryChip, { backgroundColor: theme.white, borderColor: theme.border }]}>
          <Text style={[styles.summaryNum, { color: theme.primary }]}>ON</Text>
          <Text style={[styles.summaryLbl, { color: theme.gray }]}>{t('autoNotify')}</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 40 }} />
      ) : (
        alerts.map(alert => (
          <TouchableOpacity key={alert.id} style={[styles.alertCard, { backgroundColor: theme.white, borderColor: theme.border }]} activeOpacity={0.9}>
            <View
              style={[
                styles.severityBar,
                { backgroundColor: severityColor[alert.severity] || theme.primary },
              ]}
            />
            <View style={styles.alertBody}>
              <View style={styles.alertHeader}>
                <Ionicons
                  name={alert.icon}
                  size={24}
                  color={severityColor[alert.severity] || theme.primary}
                />
                <Text style={[styles.alertTitle, { color: theme.text }]}>{alert.title}</Text>
              </View>
              <Text style={[styles.alertText, { color: theme.textMuted }]}>{alert.body}</Text>
              <View style={styles.alertFooter}>
                <Text style={[styles.alertTime, { color: theme.gray }]}>{alert.time}</Text>
                <Text
                  style={[
                    styles.severityTag,
                    { color: severityColor[alert.severity] || theme.primary },
                  ]}>
                  {(alert.severity ?? 'medium').toUpperCase()}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))
      )}

      <TouchableOpacity style={[styles.muteCard, { backgroundColor: theme.white, borderColor: theme.border }]}>
        <Ionicons name="volume-mute" size={22} color={theme.primary} />
        <Text style={[styles.muteText, { color: theme.text }]}>{t('configureZones')}</Text>
        <Ionicons name="chevron-forward" size={20} color={theme.gray} />
      </TouchableOpacity>
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
  },
  sub: {
    marginBottom: SPACING.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: SPACING.xl,
  },
  summaryChip: {
    flex: 1,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
  },
  summaryNum: { fontSize: 22, fontWeight: '800' },
  summaryLbl: { fontSize: 11, marginTop: 4, fontWeight: '600' },
  alertCard: {
    flexDirection: 'row',
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    borderWidth: 1,
  },
  severityBar: { width: 5 },
  alertBody: { flex: 1, padding: SPACING.lg },
  alertHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  alertTitle: { fontSize: 18, fontWeight: '800', flex: 1 },
  alertText: { lineHeight: 20 },
  alertFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  alertTime: { fontSize: 12 },
  severityTag: { fontSize: 11, fontWeight: '800' },
  muteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.sm,
    gap: 12,
    borderWidth: 1,
  },
  muteText: { flex: 1, fontWeight: '600' },
});
