import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { modernTheme } from '../styles/modernTheme';

interface ModernCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  variant?: 'default' | 'glass' | 'gradient';
  onPress?: () => void;
}

export const ModernCard: React.FC<ModernCardProps> = ({
  children,
  style,
  variant = 'default',
  onPress,
}) => {
  const [scaleAnim] = React.useState(new Animated.Value(1));

  const handlePressIn = () => {
    if (onPress) {
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 3,
        useNativeDriver: true,
      }).start();
    }
  };

  const getCardStyle = () => {
    switch (variant) {
      case 'glass':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          borderRadius: 24,
          padding: 24,
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.2)',
          ...modernTheme.shadows.lg,
        };
      case 'gradient':
        return {
          borderRadius: 24,
          padding: 24,
          ...modernTheme.shadows.lg,
        };
      default:
        return {
          backgroundColor: '#ffffff',
          borderRadius: 20,
          padding: 20,
          ...modernTheme.shadows.md,
          borderWidth: 1,
          borderColor: modernTheme.colors.neutral[200] + '40',
        };
    }
  };

  const CardComponent = onPress ? TouchableOpacity : View;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      {onPress ? (
        <TouchableOpacity
          style={[getCardStyle(), style]}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
        >
          {children}
        </TouchableOpacity>
      ) : (
        <View style={[getCardStyle(), style]}>
          {children}
        </View>
      )}
    </Animated.View>
  );
};

interface ModernButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export const ModernButton: React.FC<ModernButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  disabled = false,
  loading = false,
  style,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: modernTheme.radius.md,
    };

    // Size variations
    switch (size) {
      case 'sm':
        baseStyle.paddingVertical = 10;
        baseStyle.paddingHorizontal = 16;
        break;
      case 'lg':
        baseStyle.paddingVertical = 18;
        baseStyle.paddingHorizontal = 32;
        break;
      default:
        baseStyle.paddingVertical = 14;
        baseStyle.paddingHorizontal = 24;
    }

    // Variant styles
    switch (variant) {
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: modernTheme.colors.neutral[100],
          borderWidth: 1,
          borderColor: modernTheme.colors.neutral[300],
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: modernTheme.colors.primary[500],
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: modernTheme.colors.primary[500],
          ...modernTheme.shadows.sm,
        };
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontSize: size === 'sm' ? 14 : size === 'lg' ? 18 : 16,
      fontWeight: '600',
      marginLeft: icon ? 8 : 0,
    };

    switch (variant) {
      case 'secondary':
        return { ...baseStyle, color: modernTheme.colors.neutral[700] };
      case 'outline':
        return { ...baseStyle, color: modernTheme.colors.primary[500] };
      case 'ghost':
        return { ...baseStyle, color: modernTheme.colors.primary[500] };
      default:
        return { ...baseStyle, color: '#ffffff' };
    }
  };

  return (
    <TouchableOpacity
      style={[
        getButtonStyle(),
        disabled && { opacity: 0.5 },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {icon && (
        <Ionicons
          name={icon as any}
          size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18}
          color={getTextStyle().color}
        />
      )}
      <Text style={getTextStyle()}>{title}</Text>
    </TouchableOpacity>
  );
};

interface ModernBadgeProps {
  text: string;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
}

export const ModernBadge: React.FC<ModernBadgeProps> = ({
  text,
  variant = 'neutral',
  size = 'md',
}) => {
  const getColor = () => {
    switch (variant) {
      case 'success':
        return {
          bg: modernTheme.colors.success[50],
          text: modernTheme.colors.success[700],
          border: modernTheme.colors.success[200],
        };
      case 'warning':
        return {
          bg: modernTheme.colors.warning[50],
          text: modernTheme.colors.warning[700],
          border: modernTheme.colors.warning[200],
        };
      case 'danger':
        return {
          bg: modernTheme.colors.danger[50],
          text: modernTheme.colors.danger[700],
          border: modernTheme.colors.danger[200],
        };
      case 'info':
        return {
          bg: modernTheme.colors.primary[50],
          text: modernTheme.colors.primary[700],
          border: modernTheme.colors.primary[200],
        };
      default:
        return {
          bg: modernTheme.colors.neutral[100],
          text: modernTheme.colors.neutral[700],
          border: modernTheme.colors.neutral[300],
        };
    }
  };

  const colors = getColor();
  const padding = size === 'sm' ? { paddingVertical: 4, paddingHorizontal: 8 } :
                 size === 'lg' ? { paddingVertical: 8, paddingHorizontal: 16 } :
                 { paddingVertical: 6, paddingHorizontal: 12 };

  return (
    <View
      style={[
        {
          backgroundColor: colors.bg,
          borderRadius: modernTheme.radius.full,
          borderWidth: 1,
          borderColor: colors.border,
          alignSelf: 'flex-start',
        },
        padding,
      ]}
    >
      <Text
        style={{
          color: colors.text,
          fontSize: size === 'sm' ? 12 : size === 'lg' ? 16 : 14,
          fontWeight: '600',
        }}
      >
        {text}
      </Text>
    </View>
  );
};