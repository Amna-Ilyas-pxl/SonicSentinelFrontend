import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS, SPACING } from '../constants/theme';

type Props = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightPress?: () => void;
};

export default function ScreenHeader({
  title,
  subtitle,
  onBack,
  rightIcon,
  onRightPress,
}: Props) {
  return (
    <View style={styles.wrap}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} style={styles.backBtn} hitSlop={12}>
          <Ionicons name="chevron-back" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      ) : (
        <View style={styles.backPlaceholder} />
      )}
      <View style={styles.textBlock}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {rightIcon && onRightPress ? (
        <TouchableOpacity onPress={onRightPress} style={styles.backBtn}>
          <Ionicons name={rightIcon} size={22} color={COLORS.primary} />
        </TouchableOpacity>
      ) : (
        <View style={styles.backPlaceholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  backPlaceholder: { width: 40 },
  textBlock: { flex: 1, paddingHorizontal: SPACING.sm },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginTop: 4,
  },
});
