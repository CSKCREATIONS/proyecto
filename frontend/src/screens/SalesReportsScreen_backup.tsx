import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

interface SalesStats {
  totalSales: number;
  totalRevenue: number;
  averageOrderValue: number;
  totalCustomers: number;
  completedSales: number;
  returnedSales: number;
}

interface PeriodSales {
  period: string;
  sales: number;
  revenue: number;
  growth: number;
}

interface TopProduct {
  _id: string;
  name: string;
  unitsSold: number;
  revenue: number;
  category: string;
}

interface CustomerStats {
  _id: string;
  name: string;
  totalPurchases: number;
  totalSpent: number;
  lastPurchase: string;
}

interface SellerPerformance {
  sellerId: string;
  sellerName: string;
  salesCount: number;
  revenue: number;
  averageOrderValue: number;
}

const SalesReportsScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<string>('overview');
  const [stats, setStats] = useState<SalesStats | null>(null);
  const [periodSales, setPeriodSales] = useState<PeriodSales[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [topCustomers, setTopCustomers] = useState<CustomerStats[]>([]);
  const [sellerPerformance, setSellerPerformance] = useState<SellerPerformance[]>([]);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      // Simular carga de datos - aquí irían las llamadas reales a la API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Datos simulados específicos para ventas - VERSIÓN COMPLETA
      setStats({
        totalSales: 1248,
        totalRevenue: 24567800,
        averageOrderValue: 196800,
        totalCustomers: 456,
        completedSales: 1180,
        returnedSales: 68
      });

      setPeriodSales([
        { period: 'Enero', sales: 98, revenue: 1980000, growth: 12.5 },
        { period: 'Febrero', sales: 112, revenue: 2340000, growth: 18.2 },
        { period: 'Marzo', sales: 134, revenue: 2890000, growth: 23.5 },
        { period: 'Abril', sales: 156, revenue: 3120000, growth: 16.4 },
        { period: 'Mayo', sales: 143, revenue: 2845000, growth: -8.8 }
      ]);

      setTopProducts([
        { _id: '1', name: 'iPhone 15 Pro', unitsSold: 45, revenue: 67500000, category: 'Electrónicos' },
        { _id: '2', name: 'MacBook Pro M3', unitsSold: 23, revenue: 34500000, category: 'Electrónicos' },
        { _id: '3', name: 'Samsung Galaxy S24', unitsSold: 67, revenue: 40200000, category: 'Electrónicos' },
        { _id: '4', name: 'iPad Air', unitsSold: 34, revenue: 17000000, category: 'Electrónicos' }
      ]);

      setTopCustomers([
        { _id: '1', name: 'Empresa ABC S.A.S', totalPurchases: 23, totalSpent: 4560000, lastPurchase: '2025-09-20' },
        { _id: '2', name: 'Juan Pérez', totalPurchases: 15, totalSpent: 2890000, lastPurchase: '2025-09-19' },
        { _id: '3', name: 'María González', totalPurchases: 12, totalSpent: 2340000, lastPurchase: '2025-09-18' },
        { _id: '4', name: 'Corporación XYZ', totalPurchases: 8, totalSpent: 1980000, lastPurchase: '2025-09-17' }
      ]);

      setSellerPerformance([
        { sellerId: '1', sellerName: 'Carlos Rodríguez', salesCount: 156, revenue: 8900000, averageOrderValue: 570500 },
        { sellerId: '2', sellerName: 'Ana Martínez', salesCount: 134, revenue: 7650000, averageOrderValue: 571000 },
        { sellerId: '3', sellerName: 'Luis García', salesCount: 98, revenue: 5420000, averageOrderValue: 553000 },
        { sellerId: '4', sellerName: 'Sandra López', salesCount: 87, revenue: 4890000, averageOrderValue: 562000 }
      ]);

    } catch (error) {
      console.error('Error cargando reportes de ventas:', error);
      Alert.alert('Error', 'No se pudieron cargar los reportes de ventas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadReports();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO');
  };

  const StatCard = ({ icon, value, label, color = '#007AFF', growth }: { 
    icon: string; 
    value: string | number; 
    label: string; 
    color?: string; 
    growth?: number;
  }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statCardContent}>
        <Ionicons name={icon as any} size={24} color={color} />
        <View style={styles.statCardText}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statLabel}>{label}</Text>
          {growth !== undefined && (
            <View style={styles.growthContainer}>
              <Ionicons 
                name={growth >= 0 ? "trending-up" : "trending-down"} 
                size={12} 
                color={growth >= 0 ? "#34C759" : "#FF3B30"} 
              />
              <Text style={[styles.growthText, { color: growth >= 0 ? "#34C759" : "#FF3B30" }]}>
                {growth > 0 ? '+' : ''}{growth.toFixed(1)}%
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );

  const ReportCard = ({ title, children, badge }: { title: string; children: React.ReactNode; badge?: string }) => (
    <View style={styles.reportCard}>
      <View style={styles.reportCardHeader}>
        <Text style={styles.reportCardTitle}>{title}</Text>
        {badge && <View style={styles.badge}><Text style={styles.badgeText}>{badge}</Text></View>}
      </View>
      <View style={styles.reportCardContent}>
        {children}
      </View>
    </View>
  );

  const renderOverview = () => (
    <View style={styles.overviewContainer}>
      <View style={styles.statsRow}>
        <View style={styles.statContainer}>
          <StatCard icon="receipt-outline" value={stats?.totalSales || 0} label="Total Ventas" color="#007AFF" />
        </View>
        <View style={styles.statContainer}>
          <StatCard icon="cash-outline" value={formatCurrency(stats?.totalRevenue || 0)} label="Ingresos Totales" color="#34C759" />
        </View>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statContainer}>
          <StatCard icon="calculator-outline" value={formatCurrency(stats?.averageOrderValue || 0)} label="Venta Promedio" color="#FF9500" />
        </View>
        <View style={styles.statContainer}>
          <StatCard icon="people-outline" value={stats?.totalCustomers || 0} label="Clientes" color="#8E44AD" />
        </View>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statContainer}>
          <StatCard icon="checkmark-circle-outline" value={stats?.completedSales || 0} label="Completadas" color="#27AE60" />
        </View>
        <View style={styles.statContainer}>
          <StatCard icon="return-up-back-outline" value={stats?.returnedSales || 0} label="Devoluciones" color="#E74C3C" />
        </View>
      </View>
    </View>
  );

  const renderPeriods = () => (
    <View>
      {periodSales.map((period) => (
        <ReportCard key={period.period} title={period.period}>
          <View style={styles.periodInfo}>
            <View style={styles.periodDetails}>
              <Text style={styles.periodText}>Ventas: {period.sales}</Text>
              <Text style={styles.periodRevenue}>Ingresos: {formatCurrency(period.revenue)}</Text>
            </View>
            <View style={styles.growthContainer}>
              <Ionicons 
                name={period.growth >= 0 ? "trending-up" : "trending-down"} 
                size={20} 
                color={period.growth >= 0 ? "#34C759" : "#FF3B30"} 
              />
              <Text style={[styles.growthText, { color: period.growth >= 0 ? "#34C759" : "#FF3B30" }]}>
                {period.growth > 0 ? '+' : ''}{period.growth}%
              </Text>
            </View>
          </View>
        </ReportCard>
      ))}
    </View>
  );

  const renderTopProducts = () => (
    <View>
      {topProducts.map((product, index) => (
        <ReportCard key={product._id} title={product.name} badge={`#${index + 1}`}>
          <View style={styles.productInfo}>
            <View style={styles.productDetails}>
              <Text style={styles.productCategory}>{product.category}</Text>
              <Text style={styles.productText}>Unidades vendidas: {product.unitsSold}</Text>
              <Text style={styles.productRevenue}>Ingresos: {formatCurrency(product.revenue)}</Text>
            </View>
            <Ionicons name="trophy-outline" size={24} color="#FFD700" />
          </View>
        </ReportCard>
      ))}
    </View>
  );

  const renderTopCustomers = () => (
    <View>
      {topCustomers.map((customer, index) => (
        <ReportCard key={customer._id} title={customer.name} badge={`#${index + 1}`}>
          <View style={styles.customerInfo}>
            <View style={styles.customerDetails}>
              <Text style={styles.customerText}>Compras: {customer.totalPurchases}</Text>
              <Text style={styles.customerRevenue}>Total gastado: {formatCurrency(customer.totalSpent)}</Text>
              <Text style={styles.customerDate}>Última compra: {formatDate(customer.lastPurchase)}</Text>
            </View>
            <Ionicons name="person-circle-outline" size={24} color="#8E44AD" />
          </View>
        </ReportCard>
      ))}
    </View>
  );

  const renderSellers = () => (
    <View>
      {sellerPerformance.map((seller, index) => (
        <ReportCard key={seller.sellerId} title={seller.sellerName} badge={`#${index + 1}`}>
          <View style={styles.sellerInfo}>
            <View style={styles.sellerDetails}>
              <Text style={styles.sellerText}>Ventas realizadas: {seller.salesCount}</Text>
              <Text style={styles.sellerRevenue}>Ingresos generados: {formatCurrency(seller.revenue)}</Text>
              <Text style={styles.sellerAverage}>Venta promedio: {formatCurrency(seller.averageOrderValue)}</Text>
            </View>
            <Ionicons name="medal-outline" size={24} color="#E67E22" />
          </View>
        </ReportCard>
      ))}
    </View>
  );

  const SegmentButton = ({ value, title, isActive }: { value: string; title: string; isActive: boolean }) => (
    <TouchableOpacity
      style={[styles.segmentButton, isActive && styles.segmentButtonActive]}
      onPress={() => setSelectedSegment(value)}
    >
      <Text style={[styles.segmentButtonText, isActive && styles.segmentButtonTextActive]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Cargando reportes de ventas...</Text>
        </View>
      );
    }

    switch (selectedSegment) {
      case 'overview':
        return renderOverview();
      case 'periods':
        return renderPeriods();
      case 'top-products':
        return renderTopProducts();
      case 'customers':
        return renderTopCustomers();
      case 'sellers':
        return renderSellers();
      default:
        return renderOverview();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>💰 REPORTES DE VENTAS COMPLETO</Text>
      </View>
      
      <View style={styles.segmentContainer}>
        <SegmentButton value="overview" title="General" isActive={selectedSegment === 'overview'} />
        <SegmentButton value="periods" title="Períodos" isActive={selectedSegment === 'periods'} />
        <SegmentButton value="top-products" title="Top Productos" isActive={selectedSegment === 'top-products'} />
        <SegmentButton value="customers" title="Clientes" isActive={selectedSegment === 'customers'} />
        <SegmentButton value="sellers" title="Vendedores" isActive={selectedSegment === 'sellers'} />
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {renderContent()}
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
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    marginHorizontal: 1,
    borderRadius: 8,
    alignItems: 'center',
  },
  segmentButtonActive: {
    backgroundColor: '#007AFF',
  },
  segmentButtonText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  segmentButtonTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  overviewContainer: {
    paddingVertical: 10,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  statContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  statCard: {
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
  statCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statCardText: {
    marginLeft: 10,
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  growthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  growthText: {
    fontSize: 11,
    fontWeight: '500',
    marginLeft: 2,
  },
  reportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reportCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  reportCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  badge: {
    backgroundColor: '#34C759',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  reportCardContent: {
    padding: 15,
  },
  periodInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  periodDetails: {
    flex: 1,
  },
  periodText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  periodRevenue: {
    fontSize: 12,
    color: '#34C759',
    fontWeight: '500',
    marginTop: 2,
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productDetails: {
    flex: 1,
  },
  productCategory: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  productText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  productRevenue: {
    fontSize: 12,
    color: '#34C759',
    fontWeight: '500',
    marginTop: 2,
  },
  customerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customerDetails: {
    flex: 1,
  },
  customerText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  customerRevenue: {
    fontSize: 12,
    color: '#34C759',
    fontWeight: '500',
    marginTop: 2,
  },
  customerDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sellerDetails: {
    flex: 1,
  },
  sellerText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  sellerRevenue: {
    fontSize: 12,
    color: '#34C759',
    fontWeight: '500',
    marginTop: 2,
  },
  sellerAverage: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});

export default SalesReportsScreen;