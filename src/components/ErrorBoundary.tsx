import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

type Props = {
  children: ReactNode;
  title?: string;
  onRetry?: () => void;
};

type State = { hasError: boolean; message: string };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary:', error, info.componentStack);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, message: '' });
    this.props.onRetry?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>{this.props.title ?? 'Something went wrong'}</Text>
          <Text style={styles.message}>{this.state.message}</Text>
          <TouchableOpacity style={styles.button} onPress={this.handleRetry}>
            <Text style={styles.buttonText}>Try again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  message: {
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: RADIUS.md,
  },
  buttonText: { color: '#fff', fontWeight: '700' },
});
