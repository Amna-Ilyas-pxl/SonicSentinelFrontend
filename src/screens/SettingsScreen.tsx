import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../context/AuthContext';
import { usePreferences } from '../context/PreferencesContext';
import { RADIUS, SPACING } from '../constants/theme';

type SettingRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  value?: boolean;
  onToggle?: (v: boolean) => void;
  onPress?: () => void;
  showChevron?: boolean;
};

function SettingRow({
  icon,
  title,
  subtitle,
  value,
  onToggle,
  onPress,
  showChevron,
}: SettingRowProps) {
  const { theme } = usePreferences();

  const content = (
    <View style={[styles.settingCard, { backgroundColor: theme.white, borderColor: theme.border }]}>
      <View style={[styles.settingIcon, { backgroundColor: theme.backgroundDeep }]}>
        <Ionicons name={icon} size={20} color={theme.primary} />
      </View>
      <View style={styles.settingTextBlock}>
        <Text style={[styles.settingText, { color: theme.text }]}>{title}</Text>
        {subtitle ? <Text style={[styles.settingSub, { color: theme.textMuted }]}>{subtitle}</Text> : null}
      </View>
      {onToggle !== undefined && value !== undefined ? (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: theme.border, true: theme.secondary }}
          thumbColor={value ? theme.primary : '#f4f3f4'}
        />
      ) : showChevron ? (
        <Ionicons name="chevron-forward" size={20} color={theme.gray} />
      ) : null}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {content}
      </TouchableOpacity>
    );
  }
  return content;
}

export default function SettingsScreen() {
  const { logout, user } = useAuth();
  const insets = useSafeAreaInsets();
  const { theme, t, darkMode, toggleDarkMode, language, setLanguage, sensitivity, setSensitivity } = usePreferences();

  const [backgroundDetection, setBackgroundDetection] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [gunshotModel, setGunshotModel] = useState(true);
  const [explosionModel, setExplosionModel] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [shareAnalytics, setShareAnalytics] = useState(false);
  const [highAccuracy, setHighAccuracy] = useState(true);

  const handleSensitivityPress = () => {
    Alert.alert(
      t('alertSensitivity'),
      'Select threat detection sensitivity / Seleccione sensibilidad:',
      [
        {
          text: `Low / Bajo (~85 dB) ${sensitivity === 'Low' ? '✓' : ''}`,
          onPress: () => setSensitivity('Low'),
        },
        {
          text: `Medium / Medio (~75 dB) ${sensitivity === 'Medium' ? '✓' : ''}`,
          onPress: () => setSensitivity('Medium'),
        },
        {
          text: `High / Alto (~65 dB) ${sensitivity === 'High' ? '✓' : ''}`,
          onPress: () => setSensitivity('High'),
        },
        { text: 'Cancel', style: 'cancel' },
      ],
    );
  };

  const handleLanguagePress = () => {
    Alert.alert(
      t('language'),
      'Select application language / Seleccione idioma:',
      [
        { text: `English ${language === 'English' ? '✓' : ''}`, onPress: () => setLanguage('English') },
        { text: `Español ${language === 'Spanish' ? '✓' : ''}`, onPress: () => setLanguage('Spanish') },
        { text: `Deutsch ${language === 'German' ? '✓' : ''}`, onPress: () => setLanguage('German') },
        { text: `Français ${language === 'French' ? '✓' : ''}`, onPress: () => setLanguage('French') },
        { text: 'Cancel', style: 'cancel' },
      ],
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 32,
      }}
      showsVerticalScrollIndicator={false}>

      <Text style={[styles.label, { color: theme.secondary }]}>{t('settingsHeader')}</Text>
      <Text style={[styles.heading, { color: theme.text }]}>{t('preferences')}</Text>
      <Text style={[styles.accountEmail, { color: theme.textMuted }]}>{user?.email}</Text>

      <Text style={[styles.section, { color: theme.gray }]}>{t('detectionSection')}</Text>
      <SettingRow
        icon="headset"
        title={t('backgroundDetection')}
        subtitle={t('backgroundDetectionSub')}
        value={backgroundDetection}
        onToggle={setBackgroundDetection}
      />
      <SettingRow
        icon="flash"
        title={t('gunshotClassifier')}
        subtitle={t('gunshotClassifierSub')}
        value={gunshotModel}
        onToggle={setGunshotModel}
      />
      <SettingRow
        icon="nuclear"
        title={t('explosionClassifier')}
        value={explosionModel}
        onToggle={setExplosionModel}
      />
      <SettingRow
        icon="locate"
        title={t('highAccuracyLocation')}
        subtitle={t('highAccuracyLocationSub')}
        value={highAccuracy}
        onToggle={setHighAccuracy}
      />

      <Text style={[styles.section, { color: theme.gray }]}>{t('notificationsSection')}</Text>
      <SettingRow
        icon="notifications"
        title={t('pushAlerts')}
        subtitle={t('pushAlertsSub')}
        value={pushAlerts}
        onToggle={setPushAlerts}
      />
      <SettingRow
        icon="phone-portrait"
        title={t('vibrationOnAlert')}
        value={vibration}
        onToggle={setVibration}
      />
      <SettingRow
        icon="options"
        title={t('alertSensitivity')}
        subtitle={t(sensitivity.toLowerCase() as any) || sensitivity}
        showChevron
        onPress={handleSensitivityPress}
      />

      <Text style={[styles.section, { color: theme.gray }]}>{t('privacyDataSection')}</Text>
      <SettingRow
        icon="analytics"
        title={t('shareAnalytics')}
        value={shareAnalytics}
        onToggle={setShareAnalytics}
      />
      <SettingRow
        icon="download"
        title={t('exportLogs')}
        showChevron
        onPress={() => {
          // Generate localized mockup CSV data and export it via alert
          const csvMock = "Timestamp,Decibel,ThreatLevel,Type\n" +
            "2026-06-28 12:00:05,45,Quiet,Ambient hum\n" +
            "2026-06-28 12:12:14,88,Hazardous,Traffic peak\n" +
            "2026-06-28 13:02:40,94,Hazardous,Gunshot detected\n";
          Alert.alert(
            t('exportLogs'),
            `Acoustic logs exported successfully!\n\n${csvMock}\n(Saved locally to sonicsentinel_logs.csv)`
          );
        }}
      />
      <SettingRow
        icon="trash"
        title={t('clearCache')}
        showChevron
        onPress={() => Alert.alert(t('clearCache'), 'Local cache removed successfully.')}
      />

      <Text style={[styles.section, { color: theme.gray }]}>{t('appSection')}</Text>
      <SettingRow
        icon="moon"
        title={t('darkMode')}
        value={darkMode}
        onToggle={toggleDarkMode}
      />
      <SettingRow
        icon="language"
        title={t('language')}
        subtitle={language}
        showChevron
        onPress={handleLanguagePress}
      />
      <SettingRow
        icon="document-text"
        title={t('privacyPolicy')}
        showChevron
        onPress={() => Alert.alert(t('privacyPolicy'), 'Sonic Sentinel privacy policy details.')}
      />
      <SettingRow
        icon="help-circle"
        title={t('helpSupport')}
        showChevron
        onPress={() => Alert.alert(t('helpSupport'), 'Contact support at: support@sonicsentinel.app')}
      />

      <Text style={[styles.version, { color: theme.gray }]}>Sonic Sentinel v0.0.1</Text>

      <TouchableOpacity style={[styles.logoutButton, { backgroundColor: theme.white, borderColor: theme.danger }]} onPress={logout}>
        <Ionicons name="log-out-outline" size={22} color={theme.danger} />
        <Text style={[styles.logoutText, { color: theme.danger }]}>{t('logOut')}</Text>
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
    marginTop: 4,
  },
  accountEmail: {
    marginBottom: SPACING.lg,
  },
  section: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
  },
  settingCard: {
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  settingTextBlock: { flex: 1 },
  settingText: {
    fontSize: 16,
    fontWeight: '600',
  },
  settingSub: {
    fontSize: 12,
    marginTop: 2,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    marginTop: SPACING.xl,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: SPACING.lg,
    borderRadius: RADIUS.lg,
    padding: 18,
    borderWidth: 1.5,
  },
  logoutText: {
    fontWeight: '700',
    fontSize: 16,
  },
});
