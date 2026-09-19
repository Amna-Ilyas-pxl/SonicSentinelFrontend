import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={['#F7F2FF', '#EFE6FF']}
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>

      <Text style={styles.title}>Sonic Sentinel</Text>
      <Text style={styles.subtitle}>
        Your acoustic safety guardian.
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>AI Acoustic Intelligence</Text>

        <Text style={styles.description}>
          Detect gunshots, explosions, dangerous noise,
          and environmental threats in real time.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.outlineButton}
          onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.outlineText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: width * 0.10,
    fontWeight: '800',
    color: '#7B2FF7',
  },
  subtitle: {
    color: '#666',
    marginBottom: 30,
    fontSize: 16,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 25,
    elevation: 6,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 15,
    color: '#1D1B20',
  },
  description: {
    color: '#666',
    lineHeight: 24,
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#7B2FF7',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  outlineButton: {
    borderWidth: 1.5,
    borderColor: '#7B2FF7',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  outlineText: {
    color: '#7B2FF7',
    fontWeight: '700',
  },
});