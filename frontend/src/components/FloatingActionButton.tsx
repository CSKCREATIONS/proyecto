import React from 'react';
import {
  TouchableOpacity,
  Text,
  Animated,
  ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon?: string;
  label?: string;
  color?: string;
  size?: number;
  style?: ViewStyle;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  icon = "add",
  label,
  color = "#4ECDC4",
  size = 56,
  style,
}) => {
  const scaleValue = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      tension: 100,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          bottom: 90, // Cambiado de 20 a 90 para evitar oclusión
          right: 20,
          transform: [{ scale: scaleValue }],
        },
        style,
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
          flexDirection: label ? 'row' : 'column',
          paddingHorizontal: label ? 16 : 0,
          minWidth: label ? 'auto' : size,
        }}
        activeOpacity={0.8}
      >
        <Ionicons 
          name={icon as any} 
          size={24} 
          color="white" 
        />
        {label && (
          <Text
            style={{
              color: 'white',
              fontSize: 16,
              fontWeight: '600',
              marginLeft: 8,
            }}
          >
            {label}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default FloatingActionButton;