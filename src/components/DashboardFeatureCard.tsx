import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

type Props = {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  colors: [string, string];
  badge?: string;
  onPress: () => void;
  style?: ViewStyle;
};

export default function DashboardFeatureCard({
  title,
  description,
  icon,
  colors,
  badge,
  onPress,
  style,
}: Props) {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={style}>
      <LinearGradient colors={colors} style={styles.card} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <View style={styles.topRow}>
          <View style={styles.iconWrap}>
            <Ionicons name={icon} size={26} color={COLORS.white} />
          </View>
          {badge ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ) : null}
          <Ionicons name="arrow-forward-circle" size={28} color="rgba(255,255,255,0.9)" />
        </View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    minHeight: 130,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 'auto',
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 8,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 6,
  },
  description: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.92)',
    lineHeight: 20,
  },
});
