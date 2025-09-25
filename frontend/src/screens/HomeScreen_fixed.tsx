import React, { useEffect, useState } from 'react';
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
import { useNavigation } from '@react-navigation/native'; 
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../types/navigation';
import { apiService } from '../services/api';

const { width } = Dimensions.get('window');
type NavigationProp = StackNavigationProp<RootStackParamList>;

interface StatData {
  value: number;
  label: string;
  icon: string;
  color: string;
  loading?: boolean;
}

interface DashboardStats {
  users: StatData;
  categories: StatData;
  subcategories: StatData;
  products: StatData;
  clients: StatData;
  suppliers: StatData;
  sales: StatData;
  purchases: StatData;
}

const HomeScreen: React.FC = () => {
  const { user, hasPermission } = useAuth();
  const navigation = useNavigation<NavigationProp>();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  
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

    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Simular carga de datos - usando números hardcoded
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Datos simulados con números específicos
      const statsData: any = {
        users: { value: 8, label: 'Usuarios', icon: 'people-outline', color: '#8B5CF6' },
        categories: { value: 15, label: 'Categorías', icon: 'apps-outline', color: '#06B6D4' },
        subcategories: { value: 48, label: 'Subcategorías', icon: 'grid-outline', color: '#10B981' },
        products: { value: 245, label: 'Productos', icon: 'cube-outline', color: '#F59E0B' },
        clients: { value: 32, label: 'Clientes', icon: 'person-outline', color: '#EC4899' },
        suppliers: { value: 18, label: 'Proveedores', icon: 'business-outline', color: '#3B82F6' },
        sales: { value: 156, label: 'Ventas', icon: 'trending-up-outline', color: '#EF4444' },
        purchases: { value: 89, label: 'Compras', icon: 'bag-outline', color: '#84CC16' }
      };

      setStats(getStatsForRole(statsData));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      Alert.alert('Error', 'No se pudieron cargar las estadísticas');
    } finally {
      setLoading(false);
    }
  };

  const getStatLabel = (key: string): string => {
    const labels: { [key: string]: string } = {
      users: 'Usuarios',
      categories: 'Categorías',
      subcategories: 'Subcategorías', 
      products: 'Productos',
      clients: 'Clientes',
      suppliers: 'Proveedores',
      sales: 'Ventas',
      purchases: 'Compras'
    };
    return labels[key] || key;
  };

  const getStatIcon = (key: string): string => {
    const icons: { [key: string]: string } = {
      users: 'people-outline',
      categories: 'apps-outline',
      subcategories: 'grid-outline',
      products: 'cube-outline',
      clients: 'person-outline',
      suppliers: 'business-outline',
      sales: 'trending-up-outline',
      purchases: 'bag-outline'
    };
    return icons[key] || 'information-circle-outline';
  };

  const getStatColor = (key: string): string => {
    const colorMap: { [key: string]: string } = {
      users: '#8B5CF6',
      categories: '#06B6D4',
      subcategories: '#10B981',
      products: '#F59E0B',
      clients: '#EC4899',
      suppliers: '#3B82F6',
      sales: '#EF4444',
      purchases: '#84CC16'
    };
    return colorMap[key] || '#6B7280';
  };

  const getStatsForRole = (data: any): DashboardStats => {
    return {
      users: data.users || { value: 0, label: 'Usuarios', icon: 'people-outline', color: '#8B5CF6' },
      categories: data.categories || { value: 0, label: 'Categorías', icon: 'apps-outline', color: '#06B6D4' },
      subcategories: data.subcategories || { value: 0, label: 'Subcategorías', icon: 'grid-outline', color: '#10B981' },
      products: data.products || { value: 0, label: 'Productos', icon: 'cube-outline', color: '#F59E0B' },
      clients: data.clients || { value: 0, label: 'Clientes', icon: 'person-outline', color: '#EC4899' },
      suppliers: data.suppliers || { value: 0, label: 'Proveedores', icon: 'business-outline', color: '#3B82F6' },
      sales: data.sales || { value: 0, label: 'Ventas', icon: 'trending-up-outline', color: '#EF4444' },
      purchases: data.purchases || { value: 0, label: 'Compras', icon: 'bag-outline', color: '#84CC16' },
    };
  };

  const getResumenTitle = (): string => {
    if (typeof user?.role === 'object' && user.role?.name) {
      switch (user.role.name) {
        case 'Administrador':
          return 'Panel de Administración';
        case 'Vendedor':
          return 'Panel de Ventas';
        case 'Jefe de compras':
          return 'Panel de Compras';
        case 'Encargado de inventario':
          return 'Panel de Inventario';
        case 'Gerente':
          return 'Panel Ejecutivo';
        case 'Venta':
          return 'Panel de Ventas';
        default:
          return 'Panel de Control';
      }
    }
    return 'Dashboard';
  };

  const getWelcomeMessage = (): string => {
    const hour = new Date().getHours();
    let greeting = 'Buen día';
    
    if (hour < 12) greeting = 'Buenos días';
    else if (hour < 18) greeting = 'Buenas tardes';
    else greeting = 'Buenas noches';

    const name = user?.firstName || user?.username || 'Usuario';
    return `${greeting}, ${name}`;
  };

  const StatCard: React.FC<{ stat: StatData; index: number }> = ({ stat, index }) => (
    <Animated.View
      style={[
        styles.statCard,
        {
          opacity: fadeAnim,
          transform: [{
            translateY: slideAnim.interpolate({
              inputRange: [0, 50],
              outputRange: [0, 50 + (index * 10)],
              extrapolate: 'clamp'
            })
          }]
        }
      ]}
    >
      <View style={[styles.statIconContainer, { backgroundColor: stat.color + '15' }]}>
        <Ionicons name={stat.icon as any} size={28} color={stat.color} />
      </View>
      <View style={styles.statContent}>
        <Text style={[styles.statValue, { color: stat.color }]}>
          {loading ? '...' : stat.value.toLocaleString()}
        </Text>
        <Text style={styles.statLabel}>{stat.label}</Text>
      </View>
      <View style={[styles.statIndicator, { backgroundColor: stat.color }]} />
    </Animated.View>
  );

  const MenuSection: React.FC<{
    title: string;
    items: Array<{ title: string; screen: string; icon: string; }>
  }> = ({ title, items }) => (
    <Animated.View 
      style={[
        styles.menuSection,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <Text style={styles.menuSectionTitle}>{title}</Text>
      <View style={styles.menuSectionContent}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={item.screen}
            style={[styles.menuItem, index === items.length - 1 && { borderBottomWidth: 0 }]}
            onPress={() => navigation.navigate(item.screen as keyof RootStackParamList)}
            activeOpacity={0.7}
          >
            <Ionicons name={item.icon as any} size={20} color="#6B7280" />
            <Text style={styles.menuItemText}>{item.title}</Text>
            <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );

  const renderStats = () => {
    if (!stats) return null;

    // Mostrar todas las estadísticas siempre
    const allStats = [
      ['users', stats.users],
      ['categories', stats.categories], 
      ['subcategories', stats.subcategories],
      ['products', stats.products],
      ['clients', stats.clients],
      ['suppliers', stats.suppliers],
      ['sales', stats.sales],
      ['purchases', stats.purchases]
    ];

    return allStats.map(([key, stat], index) => (
      <StatCard key={key as string} stat={stat as StatData} index={index} />
    ));
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <SafeAreaView style={styles.container}>
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Header de Bienvenida */}
          <Animated.View 
            style={[
              styles.welcomeHeader,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.welcomeContent}>
              <Text style={styles.welcomeMessage}>{getWelcomeMessage()}</Text>
              <Text style={styles.dashboardTitle}>{getResumenTitle()}</Text>
            </View>
            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={loadDashboardData}
              activeOpacity={0.7}
            >
              <Ionicons name="refresh-outline" size={24} color="#6B7280" />
            </TouchableOpacity>
          </Animated.View>

          {/* Estadísticas */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Resumen General</Text>
            <View style={styles.statsGrid}>
              {renderStats()}
            </View>
          </View>

          {/* Menú de Navegación */}
          <View style={styles.navigationSection}>
            <Text style={styles.sectionTitle}>Navegación</Text>
            
            {/* Usuarios - Solo para administradores y gerentes */}
            {hasPermission('usuarios.ver') && (
              <MenuSection
                title="Usuarios"
                items={[
                  { title: "Lista de Usuarios", screen: "Users", icon: "people" },
                ]}
              />
            )}

            {/* Productos */}
            {(hasPermission('productos.ver') || hasPermission('categorias.ver') || hasPermission('subcategorias.ver')) && (
              <MenuSection
                title="Productos"
                items={[
                  { title: "Categorías", screen: "Categories", icon: "folder" },
                  { title: "Subcategorías", screen: "Subcategories", icon: "albums" },
                  { title: "Lista de productos", screen: "Products", icon: "cube" },
                  { title: "Reportes de productos", screen: "ProductReports", icon: "bar-chart" }
                ].filter(item => {
                  switch (item.screen) {
                    case 'Categories': return hasPermission('categorias.ver');
                    case 'Subcategories': return hasPermission('subcategorias.ver');
                    case 'Products':
                    case 'ProductReports': return hasPermission('productos.ver');
                    default: return true;
                  }
                })}
              />
            )}

            {/* Compras */}
            {(hasPermission('compras.ver') || hasPermission('proveedores.ver')) && (
              <MenuSection
                title="Compras"
                items={[
                  { title: "Historial de compras", screen: "Compras", icon: "time" },
                  { title: "Lista de proveedores", screen: "Proveedores", icon: "business" },
                  { title: "Reportes de compras", screen: "PurchaseReports", icon: "document-text" }
                ].filter(item => {
                  switch (item.screen) {
                    case 'Compras':
                    case 'PurchaseReports': return hasPermission('compras.ver');
                    case 'Proveedores': return hasPermission('proveedores.ver');
                    default: return true;
                  }
                })}
              />
            )}

            {/* Ventas */}
            {(hasPermission('ventas.ver') || hasPermission('cotizaciones.ver') || hasPermission('pedidos.ver')) && (
              <MenuSection
                title="Ventas"
                items={[
                  { title: "Lista de cotizaciones", screen: "Cotizaciones", icon: "list" },
                  { title: "Lista de pedidos", screen: "Pedidos", icon: "cube" },
                  { title: "Lista de ventas", screen: "Ventas", icon: "receipt" },
                  { title: "Reportes de ventas", screen: "SalesReports", icon: "bar-chart" }
                ].filter(item => {
                  switch (item.screen) {
                    case 'Cotizaciones': return hasPermission('cotizaciones.ver');
                    case 'Pedidos': return hasPermission('pedidos.ver');
                    case 'Ventas':
                    case 'SalesReports': return hasPermission('ventas.ver');
                    default: return true;
                  }
                })}
              />
            )}

            {/* Clientes */}
            {hasPermission('clientes.ver') && (
              <MenuSection
                title="Clientes"
                items={[
                  { title: "Lista de clientes", screen: "Clientes", icon: "person-circle" }
                ]}
              />
            )}
          </View>

          {/* Información adicional */}
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
                <Text style={styles.infoTitle}>Centro de Control</Text>
              </View>
              <Text style={styles.infoText}>
                Desde aquí puedes acceder a todas las funciones del sistema según tu nivel de acceso. 
                Los módulos se actualizan en tiempo real.
              </Text>
            </View>
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
  welcomeHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    backgroundColor: '#ffffff',
    margin: 16,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  welcomeContent: {
    flex: 1,
  },
  welcomeMessage: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
  },
  dashboardTitle: {
    fontSize: 24,
    fontWeight: '800' as const,
    color: '#1a1a1a',
  },
  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  statsSection: {
    margin: 16,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800' as const,
    color: '#1a1a1a',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  statsGrid: {
    gap: 12,
  },
  statCard: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    position: 'relative' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 16,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800' as const,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500' as const,
  },
  statIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    position: 'absolute' as const,
    right: 20,
  },
  navigationSection: {
    margin: 16,
    marginTop: 0,
  },
  menuSection: {
    marginBottom: 16,
  },
  menuSectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#374151',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  menuSectionContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden' as const,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  menuItemText: {
    flex: 1,
    fontSize: 15,
    color: '#374151',
    marginLeft: 12,
  },
  infoSection: {
    margin: 16,
    marginTop: 0,
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
    marginBottom: 12,
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
  },
};

export default HomeScreen;