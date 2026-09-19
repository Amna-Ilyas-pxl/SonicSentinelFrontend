import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import BottomTabs from './BottomTabs';

export default function RootNavigator() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F7F2FF' }}>
        <ActivityIndicator size="large" color="#7B2FF7" />
      </View>
    );
  }

  return isLoggedIn ? <BottomTabs /> : <AuthNavigator />;
}
