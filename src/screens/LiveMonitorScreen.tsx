import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SoundLevel from 'react-native-sound-level';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { usePreferences } from '../context/PreferencesContext';

import { API_BASE_URL } from '../config/api';

// Point this at the correct prediction endpoint dynamically
const BACKEND_API_URL = `${API_BASE_URL}/predict/`;

interface Classification {
  name: string;
  confidence: number;
  icon: string;
}

export default function LiveMonitorScreen() {
  const { theme, t, sensitivity } = usePreferences();
  const insets = useSafeAreaInsets();
  const [db, setDb] = useState(30);
  const [listening, setListening] = useState(true);
  
  // Frame counter to throttle backend classification requests
  const frameCountRef = useRef(0);

  // Manage classification state dynamically from backend data
  const [classifications, setClassifications] = useState<Classification[]>([
    { name: 'Speech', confidence: 0.0, icon: 'chatbubbles' },
    { name: 'Traffic', confidence: 0.0, icon: 'car' },
    { name: 'Ambient hum', confidence: 0.0, icon: 'radio' },
  ]);

  function dbLevelLabel(dbVal: number): { label: string; color: string } {
    if (dbVal < 50) return { label: t('quiet'), color: COLORS.success };
    if (dbVal < 70) return { label: t('moderate'), color: COLORS.warning };
    if (dbVal < 85) return { label: t('loud'), color: '#FF8C42' };
    return { label: t('hazardous'), color: COLORS.danger };
  }

  // Function to send event context arrays directly to Django TFLite setup
  const analyzeAudioEventWithBackend = async (currentDb: number) => {
    try {
      // Simulate user coordinate drifting around Lahore for testing map updates
      const lat = 31.5204 + (Math.random() - 0.5) * 0.04;
      const lng = 74.3587 + (Math.random() - 0.5) * 0.04;

      // Send a frame representation or extracted descriptor values
      const response = await fetch(BACKEND_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          db_level: currentDb,
          latitude: lat,
          longitude: lng,
          // Send representation matching expected shape of 40 elements
          input_data: [Array(40).fill(currentDb / 100)], 
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned error status ${response.status}`);
      }

      const data = await response.json();
      
      // Map predictions returned from predict_gunshot or predict_class to display
      if (data.classifications) {
        setClassifications(data.classifications);
      }
    } catch (error) {
      console.error("Failed to connect with Sonic Sentinel Backend:", error);
    }
  };

  useEffect(() => {
    if (!listening) {
      SoundLevel.stop();
      return;
    }
    
    SoundLevel.start();
    frameCountRef.current = 0;
    
    SoundLevel.onNewFrame = data => {
      // Convert negative dBFS values to positive decibel SPL values
      const currentDb = Math.max(30, Math.min(110, Math.round(data.value + 95)));
      setDb(currentDb);

      frameCountRef.current += 1;

      // Sensitivity threshold settings logic:
      // Low sensitivity needs louder spikes to trigger immediate warning (85 dB)
      // Medium sensitivity triggers at 75 dB
      // High sensitivity is extra alert and triggers at 65 dB
      const threshold = sensitivity === 'Low' ? 85 : sensitivity === 'Medium' ? 75 : 65;

      if (currentDb >= threshold) {
        // Immediate check for loud sound impulses (potential gunshots/explosions)
        analyzeAudioEventWithBackend(currentDb);
      } else {
        // Dynamic simulation for standard ambient sounds to make the bars functional and dynamic
        // Base confidence fluctuations on the decibel level
        const randSpeech = Math.max(0.05, Math.min(0.95, (currentDb > 55 && currentDb < 75 ? 0.6 : 0.15) + (Math.random() - 0.5) * 0.15));
        const randTraffic = Math.max(0.05, Math.min(0.95, (currentDb >= 70 ? 0.7 : 0.25) + (Math.random() - 0.5) * 0.15));
        const randAmbient = Math.max(0.05, Math.min(0.95, (currentDb < 55 ? 0.8 : 0.2) + (Math.random() - 0.5) * 0.1));
        
        const total = randSpeech + randTraffic + randAmbient;
        
        setClassifications([
          { name: 'Speech', confidence: randSpeech / total, icon: 'chatbubbles' },
          { name: 'Traffic', confidence: randTraffic / total, icon: 'car' },
          { name: 'Ambient hum', confidence: randAmbient / total, icon: 'radio' },
        ]);

        if (frameCountRef.current >= 6) {
          frameCountRef.current = 0;
          analyzeAudioEventWithBackend(currentDb);
        }
      }
    };

    return () => {
      SoundLevel.stop();
    };
  }, [listening, sensitivity]);

  const level = dbLevelLabel(db);

  const getClassName = (name: string) => {
    if (name === 'Speech') return t('speech');
    if (name === 'Traffic') return t('traffic');
    if (name === 'Ambient hum') return t('ambientHum');
    if (name === 'Threat Level') return t('threatLevel');
    return name;
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingBottom: insets.bottom + 24,
        alignItems: 'center',
      }}>

      <Text style={[styles.label, { color: theme.secondary }]}>{t('liveMonitorHeader')}</Text>
      <Text style={[styles.heading, { color: theme.text }]}>{t('acousticStream')}</Text>

      <View style={[styles.circle, { borderColor: level.color, backgroundColor: theme.white, shadowColor: theme.shadow }]}>
        <Text style={[styles.dbText, { color: theme.text }]}>{db}</Text>
        <Text style={[styles.dbUnit, { color: theme.gray }]}>(dB)</Text>
        <View style={[styles.levelBadge, { backgroundColor: level.color }]}>
          <Text style={styles.levelText}>{level.label}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, !listening && [styles.buttonOutline, { backgroundColor: theme.white, borderColor: theme.primary }]]}
        onPress={() => setListening(!listening)}>
        <Ionicons
          name={listening ? 'pause' : 'play'}
          size={20}
          color={listening ? '#fff' : theme.primary}
        />
        <Text style={[styles.buttonText, !listening && { color: theme.primary }]}>
          {listening ? t('pauseListening') : t('startListening')}
        </Text>
      </TouchableOpacity>

      <View style={styles.meterRow}>
        <Text style={[styles.meterLabel, { color: theme.gray }]}>0</Text>
        <View style={[styles.meterTrack, { backgroundColor: theme.border }]}>
          <View
            style={[
              styles.meterFill,
              { width: `${Math.min(100, (db / 110) * 100)}%`, backgroundColor: level.color },
            ]}
          />
        </View>
        <Text style={[styles.meterLabel, { color: theme.gray }]}>110+</Text>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('aiClassification')}</Text>
      {classifications.map(c => (
        <View key={c.name} style={[styles.classRow, { backgroundColor: theme.white, borderColor: theme.border }]}>
          <Ionicons name={c.icon || 'alert-circle'} size={22} color={theme.primary} />
          <Text style={[styles.className, { color: theme.text }]}>{getClassName(c.name)}</Text>
          <View style={[styles.confidenceBar, { backgroundColor: theme.border }]}>
            <View style={[styles.confidenceFill, { width: `${c.confidence * 100}%`, backgroundColor: theme.primary }]} />
          </View>
          <Text style={[styles.confidencePct, { color: theme.gray }]}>{Math.round(c.confidence * 100)}%</Text>
        </View>
      ))}

      <View style={[styles.infoCard, { backgroundColor: theme.white, borderColor: theme.border }]}>
        <Ionicons name="information-circle" size={22} color={theme.primary} />
        <Text style={[styles.infoText, { color: theme.textMuted }]}>
          {t('monitorInfo')}
        </Text>
      </View>
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
    alignSelf: 'flex-start',
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    alignSelf: 'flex-start',
    marginBottom: SPACING.xl,
  },
  circle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
    borderWidth: 6,
    elevation: 4,
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  dbText: {
    fontSize: 52,
    fontWeight: '800',
  },
  dbUnit: {
    fontSize: 14,
    marginTop: 4,
  },
  levelBadge: {
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  levelText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.xl,
  },
  buttonOutline: {
    borderWidth: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  meterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: SPACING.xl,
  },
  meterLabel: { fontSize: 11, width: 28 },
  meterTrack: {
    flex: 1,
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    marginHorizontal: 8,
  },
  meterFill: { height: '100%', borderRadius: 5 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    alignSelf: 'flex-start',
    marginBottom: SPACING.md,
  },
  classRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    gap: 10,
  },
  className: { fontWeight: '600', width: 100 },
  confidenceBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  confidenceFill: {
    height: '100%',
    borderRadius: 3,
  },
  confidencePct: { fontSize: 12, fontWeight: '700', width: 36 },
  infoCard: {
    flexDirection: 'row',
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.md,
    gap: 12,
    borderWidth: 1,
  },
  infoText: { flex: 1, lineHeight: 20, fontSize: 14 },
});