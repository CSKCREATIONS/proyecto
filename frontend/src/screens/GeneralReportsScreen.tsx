import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { apiService } from '../services/api';

const { width } = Dimensions.get('window');

interface GeneralStats {
  totalVentas: number;
  ingresosTotales: number;
  totalProductos: number;
  totalClientes: number;
  ventasHoy: number;
  ingresosHoy: number;
  productosStockBajo: number;
  clientesActivos: number;
}

interface TopPerformer {
  type: 'product' | 'customer' | 'category';
  name: string;
  value: number;
  metric: string;
}

interface MonthlyTrend {
  month: string;
  ventas: number;
  ingresos: number;
  productos: number;
  crecimiento: number;
}

const GeneralReportsScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('mes');
  const [stats, setStats] = useState<GeneralStats | null>(null);
  const [topPerformers, setTopPerformers] = useState<TopPerformer[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<MonthlyTrend[]>([]);

  useEffect(() => {
    loadGeneralReports();
  }, [selectedPeriod]);

  const loadGeneralReports = async () => {
    try {
      // Cargar todos los datos necesarios de la BD pangea1
      const [ventasResponse, productosResponse, clientesResponse, categoriesResponse] = await Promise.all([
        apiService.get('/ventas'),
        apiService.get('/products'),
        apiService.get('/clientes'),
        apiService.get('/categories')
      ]);

      const ventas = Array.isArray(ventasResponse.data) ? ventasResponse.data : [];
      const productos = Array.isArray(productosResponse.data) ? productosResponse.data : [];
      const clientes = Array.isArray(clientesResponse.data) ? clientesResponse.data : [];
      const categorias = Array.isArray(categoriesResponse.data) ? categoriesResponse.data : [];

      // Calcular estadísticas generales
      const totalVentas = ventas.length;
      const ingresosTotales = ventas.reduce((sum: number, venta: any) => sum + (venta.total || 0), 0);
      const totalProductos = productos.length;
      const totalClientes = clientes.length;

      // Ventas e ingresos de hoy
      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
      
      const ventasHoy = ventas.filter((venta: any) => {
        const ventaDate = new Date(venta.fecha);
        return ventaDate >= startOfDay && ventaDate < endOfDay;
      });
      
      const ventasHoyCount = ventasHoy.length;
      const ingresosHoy = ventasHoy.reduce((sum: number, venta: any) => sum + (venta.total || 0), 0);

      // Productos con stock bajo
      const productosStockBajo = productos.filter((p: any) => {
        const stock = typeof p.stock === 'object' ? p.stock.quantity : p.stock;
        return stock <= 10 && stock > 0;
      }).length;

      // Clientes activos (con compras en los últimos 30 días)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const clientesActivosIds = new Set(
        ventas
          .filter((venta: any) => new Date(venta.fecha) >= thirtyDaysAgo)
          .map((venta: any) => venta.cliente?._id || venta.cliente)
      );
      const clientesActivos = clientesActivosIds.size;

      setStats({
        totalVentas,
        ingresosTotales,
        totalProductos,
        totalClientes,
        ventasHoy: ventasHoyCount,
        ingresosHoy,
        productosStockBajo,
        clientesActivos
      });

      // Calcular top performers
      const performers: TopPerformer[] = [];

      // Top producto por ventas
      const productSales: { [key: string]: any } = {};
      ventas.forEach((venta: any) => {
        if (venta.productos && Array.isArray(venta.productos)) {
          venta.productos.forEach((item: any) => {
            const productId = item.producto?._id || item.producto;
            if (productId) {
              if (!productSales[productId]) {
                productSales[productId] = {
                  revenue: 0,
                  productInfo: item.producto
                };
              }
              productSales[productId].revenue += (item.cantidad || 0) * (item.precioUnitario || 0);
            }
          });
        }
      });

      const topProduct = Object.entries(productSales)
        .map(([productId, data]) => ({
          id: productId,
          revenue: data.revenue,
          info: data.productInfo || productos.find((p: any) => p._id === productId)
        }))
        .sort((a, b) => b.revenue - a.revenue)[0];

      if (topProduct) {
        performers.push({
          type: 'product',
          name: topProduct.info?.name || 'Producto Desconocido',
          value: topProduct.revenue,
          metric: 'ingresos'
        });
      }

      // Top cliente por gastos
      const customerStats: { [key: string]: any } = {};
      ventas.forEach((venta: any) => {
        const clienteId = venta.cliente?._id || venta.cliente;
        if (clienteId) {
          if (!customerStats[clienteId]) {
            customerStats[clienteId] = {
              totalSpent: 0,
              clienteInfo: venta.cliente
            };
          }
          customerStats[clienteId].totalSpent += venta.total || 0;
        }
      });

      const topCustomer = Object.entries(customerStats)
        .map(([clienteId, data]) => ({
          id: clienteId,
          totalSpent: data.totalSpent,
          info: data.clienteInfo || clientes.find((c: any) => c._id === clienteId)
        }))
        .sort((a, b) => b.totalSpent - a.totalSpent)[0];

      if (topCustomer) {
        performers.push({
          type: 'customer',
          name: topCustomer.info?.nombre || topCustomer.info?.name || 'Cliente Desconocido',
          value: topCustomer.totalSpent,
          metric: 'gastos'
        });
      }

      // Top categoría por productos
      const topCategory = categorias
        .map((categoria: any) => ({
          ...categoria,
          productCount: productos.filter((p: any) => 
            p.category?._id === categoria._id || p.category === categoria._id
          ).length
        }))
        .sort((a, b) => b.productCount - a.productCount)[0];

      if (topCategory) {
        performers.push({
          type: 'category',
          name: topCategory.name,
          value: topCategory.productCount,
          metric: 'productos'
        });
      }

      setTopPerformers(performers);

      // Calcular tendencias mensuales
      const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const currentDate = new Date();
      const trendsData = [];

      for (let i = 5; i >= 0; i--) {
        const periodDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const nextPeriodDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 1);
        
        const periodVentas = ventas.filter((venta: any) => {
          const ventaDate = new Date(venta.fecha);
          return ventaDate >= periodDate && ventaDate < nextPeriodDate;
        });

        const periodIngresos = periodVentas.reduce((sum: number, venta: any) => sum + (venta.total || 0), 0);
        
        // Productos creados en el período
        const periodProductos = productos.filter((producto: any) => {
          const createDate = new Date(producto.createdAt || producto.fechaCreacion);
          return createDate >= periodDate && createDate < nextPeriodDate;
        }).length;

        // Calcular crecimiento
        const prevPeriodDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i - 1, 1);
        const prevNextPeriodDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const prevPeriodVentas = ventas.filter((venta: any) => {
          const ventaDate = new Date(venta.fecha);
          return ventaDate >= prevPeriodDate && ventaDate < prevNextPeriodDate;
        });
        const prevPeriodIngresos = prevPeriodVentas.reduce((sum: number, venta: any) => sum + (venta.total || 0), 0);
        const crecimiento = prevPeriodIngresos > 0 ? ((periodIngresos - prevPeriodIngresos) / prevPeriodIngresos) * 100 : 0;

        trendsData.push({
          month: monthNames[periodDate.getMonth()],
          ventas: periodVentas.length,
          ingresos: periodIngresos,
          productos: periodProductos,
          crecimiento: crecimiento
        });
      }

      setMonthlyTrends(trendsData);

    } catch (error: any) {
      console.error('Error cargando reportes generales:', error);
      Alert.alert('Error', 'No se pudieron cargar los reportes: ' + (error?.message || 'Error desconocido'));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadGeneralReports();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const StatCard = ({ 
    icon, 
    value, 
    label, 
    color = '#007AFF', 
    trend, 
    size = 'normal' 
  }: { 
    icon: string; 
    value: string | number; 
    label: string; 
    color?: string; 
    trend?: number;
    size?: 'normal' | 'large';
  }) => (
    <View style={[
      styles.statCard, 
      { borderLeftColor: color },
      size === 'large' && styles.statCardLarge
    ]}>
      <View style={styles.statCardContent}>
        <Ionicons name={icon as any} size={size === 'large' ? 32 : 24} color={color} />
        <View style={styles.statCardText}>
          <Text style={[styles.statValue, size === 'large' && styles.statValueLarge]}>
            {value}
          </Text>
          <Text style={styles.statLabel}>{label}</Text>
          {trend !== undefined && (
            <View style={styles.trendContainer}>
              <Ionicons 
                name={trend >= 0 ? "trending-up" : "trending-down"} 
                size={12} 
                color={trend >= 0 ? "#34C759" : "#FF3B30"} 
              />
              <Text style={[styles.trendText, { color: trend >= 0 ? "#34C759" : "#FF3B30" }]}>
                {trend > 0 ? '+' : ''}{trend.toFixed(1)}%
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const PerformerCard = ({ performer }: { performer: TopPerformer }) => (
    <View style={styles.performerCard}>
      <View style={styles.performerHeader}>
        <Ionicons 
          name={
            performer.type === 'product' ? 'cube-outline' :
            performer.type === 'customer' ? 'person-outline' : 'folder-outline'
          } 
          size={20} 
          color="#007AFF" 
        />
        <Text style={styles.performerType}>
          {performer.type === 'product' ? 'Producto' :
           performer.type === 'customer' ? 'Cliente' : 'Categoría'}
        </Text>
      </View>
      <Text style={styles.performerName} numberOfLines={2}>{performer.name}</Text>
      <Text style={styles.performerValue}>
        {performer.metric === 'ingresos' || performer.metric === 'gastos' 
          ? formatCurrency(performer.value)
          : `${performer.value} ${performer.metric}`
        }
      </Text>
    </View>
  );

  const TrendCard = ({ trend }: { trend: MonthlyTrend }) => (
    <View style={styles.trendCard}>
      <View style={styles.trendHeader}>
        <Text style={styles.trendMonth}>{trend.month}</Text>
        <View style={styles.trendGrowth}>
          <Ionicons 
            name={trend.crecimiento >= 0 ? "trending-up" : "trending-down"} 
            size={16} 
            color={trend.crecimiento >= 0 ? "#34C759" : "#FF3B30"} 
          />
          <Text style={[
            styles.trendGrowthText, 
            { color: trend.crecimiento >= 0 ? "#34C759" : "#FF3B30" }
          ]}>
            {trend.crecimiento > 0 ? '+' : ''}{trend.crecimiento.toFixed(1)}%
          </Text>
        </View>
      </View>
      <View style={styles.trendMetrics}>
        <Text style={styles.trendMetric}>Ventas: {trend.ventas}</Text>
        <Text style={styles.trendMetric}>Ingresos: {formatCurrency(trend.ingresos)}</Text>
        <Text style={styles.trendMetric}>Productos: +{trend.productos}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Cargando reportes generales...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📈 DASHBOARD GENERAL BD PANGEA1</Text>
        <Text style={styles.headerSubtitle}>Datos en tiempo real</Text>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Métricas principales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen Ejecutivo</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statsRow}>
              <StatCard 
                icon="receipt-outline" 
                value={stats?.totalVentas || 0} 
                label="Total Ventas" 
                color="#007AFF"
                size="large"
              />
              <StatCard 
                icon="cash-outline" 
                value={formatCurrency(stats?.ingresosTotales || 0)} 
                label="Ingresos Totales" 
                color="#34C759"
                size="large"
              />
            </View>
            <View style={styles.statsRow}>
              <StatCard 
                icon="today-outline" 
                value={stats?.ventasHoy || 0} 
                label="Ventas Hoy" 
                color="#FF9500"
              />
              <StatCard 
                icon="card-outline" 
                value={formatCurrency(stats?.ingresosHoy || 0)} 
                label="Ingresos Hoy" 
                color="#8E44AD"
              />
            </View>
            <View style={styles.statsRow}>
              <StatCard 
                icon="cube-outline" 
                value={stats?.totalProductos || 0} 
                label="Total Productos" 
                color="#27AE60"
              />
              <StatCard 
                icon="people-outline" 
                value={stats?.totalClientes || 0} 
                label="Total Clientes" 
                color="#E67E22"
              />
            </View>
            <View style={styles.statsRow}>
              <StatCard 
                icon="alert-circle-outline" 
                value={stats?.productosStockBajo || 0} 
                label="Stock Bajo" 
                color="#E74C3C"
              />
              <StatCard 
                icon="checkmark-circle-outline" 
                value={stats?.clientesActivos || 0} 
                label="Clientes Activos" 
                color="#16A085"
              />
            </View>
          </View>
        </View>

        {/* Top Performers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mejores Resultados</Text>
          <View style={styles.performersGrid}>
            {topPerformers.map((performer, index) => (
              <PerformerCard key={index} performer={performer} />
            ))}
          </View>
        </View>

        {/* Tendencias mensuales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tendencias Últimos 6 Meses</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.trendsContainer}>
              {monthlyTrends.map((trend, index) => (
                <TrendCard key={index} trend={trend} />
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  section: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  statsGrid: {
    gap: 10,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statCardLarge: {
    padding: 20,
  },
  statCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statCardText: {
    marginLeft: 12,
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statValueLarge: {
    fontSize: 20,
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '500',
    marginLeft: 2,
  },
  performersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  performerCard: {
    width: (width - 50) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  performerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  performerType: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
    marginLeft: 5,
  },
  performerName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  performerValue: {
    fontSize: 16,
    color: '#34C759',
    fontWeight: 'bold',
  },
  trendsContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 5,
  },
  trendCard: {
    width: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  trendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  trendMonth: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  trendGrowth: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendGrowthText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  trendMetrics: {
    gap: 3,
  },
  trendMetric: {
    fontSize: 12,
    color: '#666',
  },
});

export default GeneralReportsScreen;