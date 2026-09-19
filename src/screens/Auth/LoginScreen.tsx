import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen({ navigation }: any) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Error', 'Please enter your email and password.');
      return;
    }

    const result = await login(email, password);
    if (!result.ok) {
      Alert.alert('Login failed', result.message);
    }
  };

  return (
    <LinearGradient colors={['#F7F2FF', '#EFE6FF']} style={styles.gradient}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to Sonic Sentinel</Text>

          <View style={styles.card}>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#999"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <TextInput
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry
              style={styles.input}
              value={password}
              onChangeText={setPassword}
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.linkText}>
                Don&apos;t have an account? Create one
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Welcome')}>
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  flex: { flex: 1 },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#7B2FF7',
    textAlign: 'center',
  },
  subtitle: {
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 28,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 28,
    padding: 24,
    elevation: 4,
  },
  input: {
    backgroundColor: '#F7F2FF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    color: '#111',
    borderWidth: 1,
    borderColor: '#E9D8FD',
  },
  button: {
    backgroundColor: '#7B2FF7',
    padding: 16,
    borderRadius: 14,
    marginTop: 8,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  linkText: {
    color: '#7B2FF7',
    textAlign: 'center',
    marginTop: 20,
    fontWeight: '600',
  },
  backText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 16,
  },
});
