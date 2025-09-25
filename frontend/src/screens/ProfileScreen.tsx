
import React, { useState, useEffect } from 'react';
import {
  View,          
  Text,           
  ScrollView,    
  TouchableOpacity, 
  Alert,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../contexts/authContext';      
import { colors } from '../styles';

const { width } = Dimensions.get('window');

const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  
  // Animaciones
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  useEffect(() => {
    // Animaciones de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',                    
      '¿Estás seguro que deseas cerrar sesión?', 
      [
        { text: 'Cancelar', style: 'cancel' }, 
        { 
          text: 'Salir', 
          style: 'destructive',             
          onPress: logout                   
        },
      ]
    );
  };

  const handleChangePassword = () => {
    Alert.alert('Cambiar Contraseña', 'Esta función estará disponible próximamente');
  };

  const handleEditProfile = () => {
    Alert.alert('Editar Perfil', 'Esta función estará disponible próximamente');
  };

  const handleNotifications = () => {
    Alert.alert('Notificaciones', 'Configuración de notificaciones próximamente');
  };

  const handlePrivacy = () => {
    Alert.alert('Privacidad', 'Configuración de privacidad próximamente');
  };

  const ActionButton: React.FC<{ 
    icon: string; 
    title: string; 
    subtitle?: string;
    onPress: () => void; 
    color?: string;
    isDestructive?: boolean;
  }> = ({ icon, title, subtitle, onPress, color = colors.primary, isDestructive = false }) => (
    <TouchableOpacity
      style={[styles.actionButton, isDestructive && styles.actionButtonDestructive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.actionButtonIcon, { backgroundColor: isDestructive ? '#FFF5F5' : color + '15' }]}>
        <Ionicons 
          name={icon as any} 
          size={22} 
          color={isDestructive ? '#EF4444' : color} 
        />
      </View>
      <View style={styles.actionButtonContent}>
        <Text style={[styles.actionButtonTitle, isDestructive && styles.actionButtonTitleDestructive]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={styles.actionButtonSubtitle}>{subtitle}</Text>
        )}
      </View>
      <Ionicons 
        name="chevron-forward" 
        size={18} 
        color={isDestructive ? '#EF4444' : '#9CA3AF'} 
      />
    </TouchableOpacity>
  );

  const getUserInitials = () => {
    const firstName = user?.firstName || user?.username || 'U';
    const lastName = user?.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRoleInfo = () => {
    if (typeof user?.role === 'object' && user.role.name) {
      switch (user.role.name) {
        case 'Administrador':
          return { label: '👑 Administrador', color: '#8B5CF6', description: 'Acceso completo al sistema' };
        case 'Vendedor':
          return { label: '💼 Vendedor', color: '#10B981', description: 'Gestión de ventas y clientes' };
        case 'Jefe de compras':
          return { label: '📦 Jefe de Compras', color: '#F59E0B', description: 'Gestión de compras y proveedores' };
        case 'Encargado de inventario':
          return { label: '📊 Encargado de Inventario', color: '#06B6D4', description: 'Control de productos e inventario' };
        case 'Gerente':
          return { label: '🏢 Gerente', color: '#EC4899', description: 'Supervisión y reportes ejecutivos' };
        case 'Venta':
          return { label: '🛍️ Ventas', color: '#34D399', description: 'Operaciones de venta' };
        default:
          return { label: '📋 ' + user.role.name, color: '#6B7280', description: 'Usuario del sistema' };
      }
    }
    return { label: '📋 Usuario', color: '#6B7280', description: 'Acceso básico' };
  };

  const roleInfo = getRoleInfo();

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <SafeAreaView style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Header con información del usuario */}
          <Animated.View 
            style={[
              styles.profileHeader,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {/* Avatar */}
            <View style={styles.avatarContainer}>
              <View style={[styles.avatar, { backgroundColor: roleInfo.color + '20' }]}>
                <Text style={[styles.avatarText, { color: roleInfo.color }]}>
                  {getUserInitials()}
                </Text>
              </View>
              <View style={[styles.avatarBadge, { backgroundColor: roleInfo.color }]}>
                <Ionicons name="checkmark" size={12} color="white" />
              </View>
            </View>

            {/* Información del usuario */}
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {user?.firstName && user?.lastName 
                  ? `${user.firstName} ${user.lastName}`
                  : user?.username || 'Usuario'
                }
              </Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
              
              <View style={[styles.roleContainer, { backgroundColor: roleInfo.color + '15' }]}>
                <Text style={[styles.roleText, { color: roleInfo.color }]}>
                  {roleInfo.label}
                </Text>
              </View>
              <Text style={styles.roleDescription}>{roleInfo.description}</Text>
            </View>
          </Animated.View>

          {/* Sección de Cuenta */}
          <Animated.View 
            style={[
              styles.section,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Text style={styles.sectionTitle}>Cuenta</Text>
            <View style={styles.sectionContent}>
              <ActionButton
                icon="person-outline"
                title="Editar Perfil"
                subtitle="Actualiza tu información personal"
                onPress={handleEditProfile}
                color="#8B5CF6"
              />
              <ActionButton
                icon="lock-closed-outline"
                title="Cambiar Contraseña"
                subtitle="Mantén tu cuenta segura"
                onPress={handleChangePassword}
                color="#06B6D4"
              />
            </View>
          </Animated.View>

          {/* Sección de Configuración */}
          <Animated.View 
            style={[
              styles.section,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Text style={styles.sectionTitle}>Configuración</Text>
            <View style={styles.sectionContent}>
              <ActionButton
                icon="notifications-outline"
                title="Notificaciones"
                subtitle="Gestiona tus alertas"
                onPress={handleNotifications}
                color="#10B981"
              />
              <ActionButton
                icon="shield-outline"
                title="Privacidad"
                subtitle="Configuración de privacidad"
                onPress={handlePrivacy}
                color="#F59E0B"
              />
            </View>
          </Animated.View>

          {/* Información de la App */}
          <Animated.View 
            style={[
              styles.infoSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.infoCard}>
              <View style={styles.infoHeader}>
                <Ionicons name="information-circle-outline" size={24} color="#6B7280" />
                <Text style={styles.infoTitle}>Información de la App</Text>
              </View>
              <Text style={styles.infoText}>
                Sistema de gestión integral que permite administrar productos, 
                ventas, compras y clientes con diferentes niveles de acceso según tu rol.
              </Text>
              <View style={styles.infoFooter}>
                <Text style={styles.versionText}>Versión 1.0.0</Text>
                <Text style={styles.buildText}>Build 2025.09.21</Text>
              </View>
            </View>
          </Animated.View>

          {/* Botón de Cerrar Sesión */}
          <Animated.View 
            style={[
              styles.logoutSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <ActionButton
              icon="log-out-outline"
              title="Cerrar Sesión"
              subtitle="Salir de tu cuenta"
              onPress={handleLogout}
              isDestructive={true}
            />
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    margin: 16,
    padding: 24,
    alignItems: 'center' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 12,
  },
  avatarContainer: {
    position: 'relative' as const,
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderWidth: 4,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarText: {
    fontSize: 42,
    fontWeight: '800' as const,
  },
  avatarBadge: {
    position: 'absolute' as const,
    bottom: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderWidth: 3,
    borderColor: 'white',
  },
  userInfo: {
    alignItems: 'center' as const,
  },
  userName: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: '#1a1a1a',
    marginBottom: 8,
    textAlign: 'center' as const,
  },
  userEmail: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
    textAlign: 'center' as const,
  },
  roleContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 12,
  },
  roleText: {
    fontSize: 16,
    fontWeight: '700' as const,
  },
  roleDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center' as const,
    maxWidth: 240,
  },
  section: {
    margin: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800' as const,
    color: '#1a1a1a',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  actionButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  actionButtonDestructive: {
    borderBottomWidth: 0,
  },
  actionButtonIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 16,
  },
  actionButtonContent: {
    flex: 1,
  },
  actionButtonTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#374151',
    marginBottom: 4,
  },
  actionButtonTitleDestructive: {
    color: '#EF4444',
  },
  actionButtonSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  infoSection: {
    margin: 16,
    marginTop: 8,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  infoHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#374151',
    marginLeft: 12,
  },
  infoText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#6B7280',
    marginBottom: 16,
  },
  infoFooter: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  versionText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#374151',
  },
  buildText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  logoutSection: {
    margin: 16,
    marginTop: 8,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
};

export default ProfileScreen;
