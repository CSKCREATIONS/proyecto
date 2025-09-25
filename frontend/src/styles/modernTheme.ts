export const modernTheme = {
  // Colores principales modernos
  colors: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      light: '#bae6fd',
      main: '#0ea5e9', 
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      900: '#0c4a6e'
    },
    secondary: {
      50: '#fdf4ff',
      100: '#fae8ff',
      200: '#f3e8ff',
      light: '#f3e8ff',
      main: '#a855f7',
      500: '#a855f7', 
      600: '#9333ea',
      700: '#7c3aed'
    },
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      light: '#bbf7d0',
      main: '#22c55e',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d'
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      light: '#fde68a',
      main: '#f59e0b', 
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309'
    },
    danger: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      light: '#fecaca',
      main: '#ef4444',
      500: '#ef4444',
      600: '#dc2626', 
      700: '#b91c1c'
    },
    info: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      light: '#bfdbfe',
      main: '#3b82f6',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8'
    },
    neutral: {
      white: '#ffffff',
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717'
    }
  },

  // Tipografía moderna
  typography: {
    heading: {
      h1: {
        fontSize: 32,
        fontWeight: '800' as const,
        lineHeight: 40,
        letterSpacing: -0.02
      },
      h2: {
        fontSize: 28,
        fontWeight: '700' as const,
        lineHeight: 36,
        letterSpacing: -0.01
      },
      h3: {
        fontSize: 24,
        fontWeight: '600' as const,
        lineHeight: 32
      },
      h4: {
        fontSize: 20,
        fontWeight: '600' as const,
        lineHeight: 28
      }
    },
    body: {
      large: {
        fontSize: 18,
        fontWeight: '400' as const,
        lineHeight: 26
      },
      medium: {
        fontSize: 16,
        fontWeight: '400' as const,
        lineHeight: 24
      },
      small: {
        fontSize: 14,
        fontWeight: '400' as const,
        lineHeight: 20
      }
    },
    // Mantener compatibilidad con el sistema anterior
    h1: {
      fontSize: 32,
      fontWeight: '800' as const,
      lineHeight: 40,
      letterSpacing: -0.02
    },
    h2: {
      fontSize: 28,
      fontWeight: '700' as const,
      lineHeight: 36,
      letterSpacing: -0.01
    },
    h3: {
      fontSize: 24,
      fontWeight: '600' as const,
      lineHeight: 32
    },
    h4: {
      fontSize: 20,
      fontWeight: '600' as const,
      lineHeight: 28
    },
    body1: {
      fontSize: 16,
      fontWeight: '400' as const,
      lineHeight: 24
    },
    body2: {
      fontSize: 14,
      fontWeight: '400' as const,
      lineHeight: 20
    },
    caption: {
      fontSize: 12,
      fontWeight: '400' as const,
      lineHeight: 16
    },
    button: {
      fontSize: 16,
      fontWeight: '600' as const,
      lineHeight: 20
    }
  },

  // Espaciado
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64
  },

  // Radius modernos
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    full: 9999
  },

  // Sombras modernas
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2
    },
    md: {
      shadowColor: '#000', 
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 8
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.15,
      shadowRadius: 24,
      elevation: 12
    }
  },

  // Gradientes modernos
  gradients: {
    primary: ['#667eea', '#764ba2'],
    secondary: ['#f093fb', '#f5576c'],
    success: ['#4facfe', '#00f2fe'],
    warm: ['#fa709a', '#fee140'],
    cool: ['#a8edea', '#fed6e3'],
    dark: ['#2d3748', '#4a5568']
  }
};

// Componentes base modernos
export const modernComponents = {
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    ...modernTheme.shadows.md,
    borderWidth: 1,
    borderColor: modernTheme.colors.neutral[200] + '40'
  },

  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...modernTheme.shadows.lg
  },

  button: {
    primary: {
      backgroundColor: modernTheme.colors.primary[500],
      borderRadius: modernTheme.radius.md,
      paddingVertical: 14,
      paddingHorizontal: 24,
      ...modernTheme.shadows.sm
    },
    secondary: {
      backgroundColor: modernTheme.colors.neutral[100],
      borderRadius: modernTheme.radius.md,
      paddingVertical: 14,
      paddingHorizontal: 24,
      borderWidth: 1,
      borderColor: modernTheme.colors.neutral[300]
    }
  },

  input: {
    backgroundColor: modernTheme.colors.neutral[50],
    borderRadius: modernTheme.radius.md,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: modernTheme.colors.neutral[300],
    fontSize: 16,
    color: modernTheme.colors.neutral[800]
  }
};