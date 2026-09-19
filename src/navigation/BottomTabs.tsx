import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

import DashboardScreen from '../screens/DashboardScreen';
import LiveMonitorScreen from '../screens/LiveMonitorScreen';
import AlertsScreen from '../screens/AlertsScreen';
import HealthScreen from '../screens/HealthScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ErrorBoundary from '../components/ErrorBoundary';

import HeatmapScreenBase from '../screens/HeatmapScreen';

function HeatmapScreen() {
  return (
    <ErrorBoundary title="Map failed to load">
      <HeatmapScreenBase />
    </ErrorBoundary>
  );
}

const Tab = createBottomTabNavigator();

const TAB_BAR_HEIGHT = 56;

export default function BottomTabs() {
  const insets = useSafeAreaInsets();
  const bottomInset = Math.max(insets.bottom, Platform.OS === 'android' ? 8 : 0);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none',
        lazy: true,
        tabBarActiveTintColor: '#7B2FF7',
        tabBarInactiveTintColor: '#888',
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginBottom: 2,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
        tabBarStyle: {
          height: TAB_BAR_HEIGHT + bottomInset,
          paddingTop: 6,
          paddingBottom: bottomInset,
          borderTopWidth: 0,
          backgroundColor: '#ffffff',
          elevation: 8,
          shadowOpacity: 0.08,
          shadowOffset: { width: 0, height: -2 },
          shadowRadius: 8,
        },
      }}>

      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Monitor"
        component={LiveMonitorScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="mic" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Heatmap"
        component={HeatmapScreen}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Alerts"
        component={AlertsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="warning" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Health"
        component={HealthScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" color={color} size={size} />
          ),
        }}
      />

    </Tab.Navigator>
  );
}
