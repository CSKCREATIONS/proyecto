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
      
      // Hacer consultas reales a la API para obtener estadísticas
      const requests: Promise<any>[] = [];
      
      if (hasPermission('usuarios.ver')) {
        requests.push(apiService.get('/users/stats'));
      } else {
        requests.push(Promise.resolve({ data: { data: { total: 0 } } }));
      }
      
      if (hasPermission('categorias.ver')) {
        requests.push(apiService.get('/categories/stats'));
      } else {
        requests.push(Promise.resolve({ data: { data: { count: 0 } } }));
      }
      
      if (hasPermission('subcategorias.ver')) {
        requests.push(apiService.get('/subcategories/stats'));
      } else {
        requests.push(Promise.resolve({ data: { data: { count: 0 } } }));
      }
      
      if (hasPermission('productos.ver')) {
        requests.push(apiService.get('/products/stats'));
      } else {
        requests.push(Promise.resolve({ data: { data: { count: 0 } } }));
      }
      
      if (hasPermission('clientes.ver')) {
        requests.push(apiService.get('/clientes/stats'));
      } else {
        requests.push(Promise.resolve({ data: { data: { count: 0 } } }));
      }
      
      if (hasPermission('proveedores.ver')) {
        requests.push(apiService.get('/proveedores/stats'));
      } else {
        requests.push(Promise.resolve({ data: { data: { count: 0 } } }));
      }
      
      if (hasPermission('ventas.ver')) {
        requests.push(apiService.get('/ventas/stats'));
      } else {
        requests.push(Promise.resolve({ data: { data: { count: 0 } } }));
      }
      
      if (hasPermission('compras.ver')) {
        requests.push(apiService.get('/compras/stats'));
      } else {
        requests.push(Promise.resolve({ data: { data: { count: 0 } } }));
      }

      const [
        usersResponse,
        categoriesResponse, 
        subcategoriesResponse,
        productsResponse,
        clientsResponse,
        suppliersResponse,
        salesResponse,
        purchasesResponse
      ] = await Promise.allSettled(requests);

      // Procesar respuestas
      const getCount = (response: any) => {
        if (response.status === 'fulfilled' && response.value?.data?.data) {
          const data = response.value.data.data;
          return data.count || data.total || data.totalUsers || 0;
        }
        return 0;
      };

      const statsData: any = {
        users: { 
          value: getCount(usersResponse), 
          label: 'Usuarios', 
          icon: 'people-outline', 
          color: '#3B82F6' 
        },
        categories: { 
          value: getCount(categoriesResponse), 
          label: 'Categorías', 
          icon: 'apps-outline', 
          color: '#3B82F6' 
        },
        subcategories: { 
          value: getCount(subcategoriesResponse), 
          label: 'Subcategorías', 
          icon: 'grid-outline', 
          color: '#3B82F6' 
        },
        products: { 
          value: getCount(productsResponse), 
          label: 'Productos', 
          icon: 'cube-outline', 
          color: '#3B82F6' 
        },
        clients: { 
          value: getCount(clientsResponse), 
          label: 'Clientes', 
          icon: 'person-outline', 
          color: '#3B82F6' 
        },
        suppliers: { 
          value: getCount(suppliersResponse), 
          label: 'Proveedores', 
          icon: 'business-outline', 
          color: '#3B82F6' 
        },
        sales: { 
          value: getCount(salesResponse), 
          label: 'Ventas', 
          icon: 'trending-up-outline', 
          color: '#3B82F6' 
        },
        purchases: { 
          value: getCount(purchasesResponse), 
          label: 'Compras', 
          icon: 'trending-down-outline', 
          color: '#3B82F6' 
        }
      };

      console.log('📊 Estadísticas cargadas:', statsData);
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
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 50],
                outputRange: [0, 50 + (index * 10)],
                extrapolate: 'clamp'
              })
            },
            {
              scale: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
                extrapolate: 'clamp'
              })
            }
          ]
        }
      ]}
    >
      <View style={styles.statCardBackground}>
        <View style={[styles.statIconContainer, { backgroundColor: stat.color }]}>
          <Ionicons name={stat.icon as any} size={32} color="#FFFFFF" />
          <View style={[styles.iconGlow, { backgroundColor: stat.color + '30' }]} />
        </View>
        <View style={styles.statContent}>
          <Text style={[styles.statValue, { color: stat.color }]}>
            {loading ? '...' : stat.value.toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>{stat.label}</Text>
          <View style={[styles.statTrend, { backgroundColor: stat.color + '15' }]}>
            <Ionicons name="trending-up" size={14} color={stat.color} />
            <Text style={[styles.trendText, { color: stat.color }]}>+12%</Text>
          </View>
        </View>
        <View style={[styles.statIndicator, { backgroundColor: stat.color }]} />
        <View style={[styles.cardAccent, { borderColor: stat.color }]} />
      </View>
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
          transform: [
            { translateY: slideAnim },
            {
              scale: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.95, 1],
                extrapolate: 'clamp'
              })
            }
          ]
        }
      ]}
    >
      <View style={styles.menuSectionHeader}>
        <Text style={styles.menuSectionTitle}>{title}</Text>
        <View style={styles.sectionAccent} />
      </View>
      <View style={styles.menuSectionContent}>
        {items.map((item, index) => (
          <TouchableOpacity
            key={item.screen}
            style={[
              styles.menuItem, 
              index === items.length - 1 && { borderBottomWidth: 0 },
              index === 0 && styles.firstMenuItem
            ]}
            onPress={() => navigation.navigate(item.screen as keyof RootStackParamList)}
            activeOpacity={0.6}
          >
            <View style={styles.menuItemIconContainer}>
              <Ionicons name={item.icon as any} size={24} color="#8B5CF6" />
            </View>
            <View style={styles.menuItemContent}>
              <Text style={styles.menuItemText}>{item.title}</Text>
              <Text style={styles.menuItemSubtext}>Gestionar {item.title.toLowerCase()}</Text>
            </View>
            <View style={styles.chevronContainer}>
              <Ionicons name="chevron-forward" size={20} color="#FF6B6B" />
            </View>
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
      <StatusBar barStyle="dark-content" backgroundColor="#FAFBFC" />
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
                transform: [
                  { translateY: slideAnim },
                  {
                    scale: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1],
                      extrapolate: 'clamp'
                    })
                  }
                ]
              }
            ]}
          >
            <View style={styles.welcomeContent}>
              <Text style={styles.welcomeMessage}>{getWelcomeMessage()}</Text>
              <Text style={styles.dashboardTitle}>{getResumenTitle()}</Text>
              <View style={styles.welcomeAccent} />
            </View>
            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={loadDashboardData}
              activeOpacity={0.7}
            >
              <Ionicons name="refresh-outline" size={28} color="#3B82F6" />
            </TouchableOpacity>
          </Animated.View>

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
                transform: [
                  { translateY: slideAnim },
                  {
                    scale: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.95, 1],
                      extrapolate: 'clamp'
                    })
                  }
                ]
              }
            ]}
          >
            <View style={styles.infoCard}>
              <View style={styles.infoAccent} />
              <View style={styles.infoHeader}>
                <View style={styles.infoIconContainer}>
                  <Ionicons name="information-circle-outline" size={30} color="#FF6B6B" />
                </View>
                <Text style={styles.infoTitle}>Centro de Control</Text>
              </View>
              <Text style={styles.infoText}>
                Desde aquí puedes acceder a todas las funciones del sistema según tu nivel de acceso. 
                Las estadísticas se actualizan en tiempo real para ofrecerte la información más actual.
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
    backgroundColor: '#FAFBFC', // Fondo blanco muy suave
  },
  scrollView: {
    flex: 1,
  },
  headerGradient: {
    padding: 0,
    margin: 0,
  },
  welcomeHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    backgroundColor: '#FFFFFF', // Fondo blanco puro
    margin: 16,
    padding: 28,
    borderRadius: 28,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 25,
    elevation: 15,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  welcomeContent: {
    flex: 1,
  },
  welcomeAccent: {
    width: 80,
    height: 6,
    backgroundColor: '#3B82F6', // Azul vibrante
    borderRadius: 3,
    marginTop: 12,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  welcomeMessage: {
    fontSize: 18,
    color: '#64748B', // Gris suave
    marginBottom: 8,
    fontWeight: '600' as const,
    letterSpacing: 0.5,
  },
  dashboardTitle: {
    fontSize: 32,
    fontWeight: '900' as const,
    color: '#1E293B', // Gris muy oscuro
    letterSpacing: -0.8,
  },
  refreshButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EFF6FF', // Azul muy claro
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#DBEAFE',
  },
  statsSection: {
    margin: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '900' as const,
    color: '#1E293B',
    marginBottom: 24,
    paddingHorizontal: 8,
    letterSpacing: -0.5,
  },
  statsGrid: {
    gap: 20,
  },
  statCard: {
    borderRadius: 24,
    overflow: 'hidden' as const,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 10,
  },
  statCardBackground: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: '#FFFFFF', // Fondo blanco
    padding: 28,
    position: 'relative' as const,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    position: 'relative' as const,
  },
  iconGlow: {
    position: 'absolute' as const,
    top: -12,
    left: -12,
    right: -12,
    bottom: -12,
    borderRadius: 48,
    opacity: 0.4,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 36,
    fontWeight: '900' as const,
    marginBottom: 8,
    letterSpacing: -1,
  },
  statLabel: {
    fontSize: 18,
    color: '#64748B',
    fontWeight: '700' as const,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  statTrend: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start' as const,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  trendText: {
    fontSize: 14,
    fontWeight: '800' as const,
    marginLeft: 6,
  },
  statIndicator: {
    width: 8,
    height: 60,
    borderRadius: 4,
    position: 'absolute' as const,
    right: 28,
    top: 28,
  },
  cardAccent: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    borderTopWidth: 6,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  navigationSection: {
    margin: 16,
    marginTop: 8,
  },
  menuSection: {
    marginBottom: 24,
  },
  menuSectionHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 20,
  },
  menuSectionTitle: {
    fontSize: 24,
    fontWeight: '900' as const,
    color: '#1E293B',
    paddingHorizontal: 8,
    letterSpacing: -0.5,
  },
  sectionAccent: {
    flex: 1,
    height: 4,
    backgroundColor: '#E2E8F0',
    marginLeft: 20,
    borderRadius: 2,
  },
  menuSectionContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden' as const,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  menuItem: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  firstMenuItem: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  menuItemIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EFF6FF', // Azul muy claro
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 20,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemText: {
    fontSize: 19,
    color: '#1E293B',
    fontWeight: '700' as const,
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  menuItemSubtext: {
    fontSize: 15,
    color: '#64748B',
    fontWeight: '600' as const,
    letterSpacing: 0.2,
  },
  chevronContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoSection: {
    margin: 16,
    marginTop: 8,
    marginBottom: 60,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 28,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    position: 'relative' as const,
  },
  infoAccent: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: '#3B82F6',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  infoHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: 20,
  },
  infoIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: 16,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  infoTitle: {
    fontSize: 24,
    fontWeight: '900' as const,
    color: '#1E293B',
    marginLeft: 16,
    letterSpacing: -0.5,
  },
  infoText: {
    fontSize: 18,
    lineHeight: 28,
    color: '#475569',
    fontWeight: '600' as const,
    letterSpacing: 0.3,
  },
};

export default HomeScreen;