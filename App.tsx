import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PermissionsAndroid, Platform, Alert } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import { PreferencesProvider } from './src/context/PreferencesContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {

  // Function to ask the Android system for Microphone access safely
  const requestMicrophonePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
        );

        if (hasPermission) {
          console.log("🎤 Microphone permission already granted.");
          return;
        }

        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission Required',
            message: 'Sonic Sentinel requires microphone access to actively analyze surrounding sound environments.',
            buttonPositive: 'Allow Access',
            buttonNegative: 'Deny',
          }
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            "Permissions Denied", 
            "Without microphone access, the real-time noise mapping capabilities will be restricted."
          );
        }
      } catch (err) {
        console.warn("Permission handling exception:", err);
      }
    }
  };

  // Trigger the permission dialog window immediately when the application launches
  useEffect(() => {
    requestMicrophonePermission();
  }, []);

  return (
    <SafeAreaProvider>
      <PreferencesProvider>
        <AuthProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </AuthProvider>
      </PreferencesProvider>
    </SafeAreaProvider>
  );
}