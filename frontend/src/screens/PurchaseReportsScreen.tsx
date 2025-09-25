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

interface PurchaseStats {
  totalPurchases: number;
  totalSuppliers: number;
  monthlySpending: number;
  averageOrderValue: number;
  pendingOrders: number;
}

interface SupplierReport {
  _id: string;
  name: string;
  totalOrders: number;
  totalAmount: number;
  averageDeliveryTime: number;
  reliability: number;
}

interface ProductPurchase {
  _id: string;
  name: string;
  supplier: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  lastPurchaseDate: string;
}

interface MonthlySpending {
  month: string;
  amount: number;
  orders: number;
  savings: number;
}

const PurchaseReportsScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<string>('overview');
  const [stats, setStats] = useState<PurchaseStats | null>(null);
  const [supplierReports, setSupplierReports] = useState<SupplierReport[]>([]);
  const [topPurchases, setTopPurchases] = useState<ProductPurchase[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlySpending[]>([]);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      // Simular carga de datos - aquí irían las llamadas reales a la API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Datos simulados
      setStats({
        totalPurchases: 1247,
        totalSuppliers: 34,
        monthlySpending: 2890000,
        averageOrderValue: 185000,
        pendingOrders: 8
      });

      setSupplierReports([
        { _id: '1', name: 'Tecnología del Futuro S.A.S', totalOrders: 145, totalAmount: 1250000, averageDeliveryTime: 3, reliability: 95 },
        { _id: '2', name: 'Distribuidora Nacional', totalOrders: 289, totalAmount: 2100000, averageDeliveryTime: 5, reliability: 92 },
        { _id: '3', name: 'Importaciones XYZ', totalOrders: 78, totalAmount: 890000, averageDeliveryTime: 7, reliability: 88 },
        { _id: '4', name: 'Proveeduría Regional', totalOrders: 156, totalAmount: 1450000, averageDeliveryTime: 4, reliability: 90 },
        { _id: '5', name: 'Global Supply Co.', totalOrders: 234, totalAmount: 1800000, averageDeliveryTime: 6, reliability: 85 }
      ]);

      setTopPurchases([
        { _id: '1', name: 'iPhone 15 Pro', supplier: 'Tecnología del Futuro', quantity: 50, unitCost: 1500000, totalCost: 75000000, lastPurchaseDate: '2024-09-15' },
        { _id: '2', name: 'Laptop Dell XPS', supplier: 'Distribuidora Nacional', quantity: 25, unitCost: 2200000, totalCost: 55000000, lastPurchaseDate: '2024-09-10' },
        { _id: '3', name: 'Monitor Samsung 4K', supplier: 'Importaciones XYZ', quantity: 80, unitCost: 650000, totalCost: 52000000, lastPurchaseDate: '2024-09-08' },
        { _id: '4', name: 'Teclado Mecánico Gamer', supplier: 'Global Supply Co.', quantity: 120, unitCost: 280000, totalCost: 33600000, lastPurchaseDate: '2024-09-12' }
      ]);

      setMonthlyData([
        { month: 'Enero', amount: 2450000, orders: 89, savings: 125000 },
        { month: 'Febrero', amount: 2890000, orders: 102, savings: 180000 },
        { month: 'Marzo', amount: 3200000, orders: 115, savings: 200000 },
        { month: 'Abril', amount: 2750000, orders: 95, savings: 150000 },
        { month: 'Mayo', amount: 3100000, orders: 108, savings: 220000 },
        { month: 'Junio', amount: 2890000, orders: 98, savings: 165000 }
      ]);

    } catch (error) {
      console.error('Error cargando reportes de compras:', error);
      Alert.alert('Error', 'No se pudieron cargar los reportes');
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

  const StatCard = ({ icon, value, label, color = '#007AFF' }: { icon: string; value: string | number; label: string; color?: string }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={styles.statCardContent}>
        <Ionicons name={icon as any} size={24} color={color} />
        <View style={styles.statCardText}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statLabel}>{label}</Text>
        </View>
      </View>
    </View>
  );

  const ReportCard = ({ title, children, badge, badgeColor }: { title: string; children: React.ReactNode; badge?: string; badgeColor?: string }) => (
    <View style={styles.reportCard}>
      <View style={styles.reportCardHeader}>
        <Text style={styles.reportCardTitle}>{title}</Text>
        {badge && (
          <View style={[styles.badge, { backgroundColor: badgeColor || '#34C759' }]}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
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
          <StatCard icon="cart-outline" value={stats?.totalPurchases || 0} label="Total Compras" color="#007AFF" />
        </View>
        <View style={styles.statContainer}>
          <StatCard icon="business-outline" value={stats?.totalSuppliers || 0} label="Proveedores" color="#34C759" />
        </View>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statContainer}>
          <StatCard icon="cash-outline" value={stats?.monthlySpending ? formatCurrency(stats.monthlySpending) : '$0'} label="Gasto Mensual" color="#FF9500" />
        </View>
        <View style={styles.statContainer}>
          <StatCard icon="time-outline" value={stats?.pendingOrders || 0} label="Órdenes Pendientes" color="#FF3B30" />
        </View>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statContainer}>
          <StatCard icon="stats-chart-outline" value={stats?.averageOrderValue ? formatCurrency(stats.averageOrderValue) : '$0'} label="Valor Promedio por Orden" color="#8E8E93" />
        </View>
      </View>
    </View>
  );

  const renderSuppliers = () => (
    <View>
      {supplierReports.map((supplier) => (
        <ReportCard 
          key={supplier._id} 
          title={supplier.name}
          badge={`${supplier.reliability}%`}
          badgeColor={supplier.reliability >= 90 ? '#34C759' : supplier.reliability >= 85 ? '#FF9500' : '#FF3B30'}
        >
          <View style={styles.supplierInfo}>
            <Ionicons name="business-outline" size={20} color="#007AFF" />
            <View style={styles.supplierDetails}>
              <Text style={styles.supplierText}>Órdenes: {supplier.totalOrders}</Text>
              <Text style={styles.supplierSubtext}>Monto Total: {formatCurrency(supplier.totalAmount)}</Text>
              <Text style={styles.supplierSubtext}>Tiempo Entrega: {supplier.averageDeliveryTime} días</Text>
            </View>
            <Ionicons 
              name={supplier.reliability >= 90 ? "trending-up-outline" : "trending-down-outline"} 
              size={24} 
              color={supplier.reliability >= 90 ? '#34C759' : '#FF9500'} 
            />
          </View>
        </ReportCard>
      ))}
    </View>
  );

  const renderTopPurchases = () => (
    <View>
      {topPurchases.map((purchase, index) => (
        <ReportCard key={purchase._id} title={purchase.name} badge={`#${index + 1}`}>
          <View style={styles.purchaseInfo}>
            <View style={styles.purchaseDetails}>
              <Text style={styles.purchaseSupplier}>Proveedor: {purchase.supplier}</Text>
              <Text style={styles.purchaseText}>Cantidad: {purchase.quantity} unidades</Text>
              <Text style={styles.purchaseText}>Costo Unitario: {formatCurrency(purchase.unitCost)}</Text>
              <Text style={styles.purchaseCost}>Total: {formatCurrency(purchase.totalCost)}</Text>
              <Text style={styles.purchaseDate}>Última compra: {purchase.lastPurchaseDate}</Text>
            </View>
            <Ionicons name="cart-outline" size={24} color="#007AFF" />
          </View>
        </ReportCard>
      ))}
    </View>
  );

  const renderMonthlyTrends = () => (
    <View>
      {monthlyData.map((month) => (
        <ReportCard key={month.month} title={`${month.month} 2024`}>
          <View style={styles.monthInfo}>
            <Ionicons name="stats-chart-outline" size={20} color="#007AFF" />
            <View style={styles.monthDetails}>
              <Text style={styles.monthText}>Gasto: {formatCurrency(month.amount)}</Text>
              <Text style={styles.monthSubtext}>Órdenes: {month.orders}</Text>
              <Text style={styles.monthSavings}>Ahorro conseguido: {formatCurrency(month.savings)}</Text>
            </View>
            <Ionicons name="trending-up-outline" size={24} color="#34C759" />
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
          <Text style={styles.loadingText}>Cargando reportes de compras...</Text>
        </View>
      );
    }

    switch (selectedSegment) {
      case 'overview':
        return renderOverview();
      case 'suppliers':
        return renderSuppliers();
      case 'top-purchases':
        return renderTopPurchases();
      case 'trends':
        return renderMonthlyTrends();
      default:
        return renderOverview();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🛒 Reportes de Compras</Text>
      </View>
      
      <View style={styles.segmentContainer}>
        <SegmentButton value="overview" title="General" isActive={selectedSegment === 'overview'} />
        <SegmentButton value="suppliers" title="Proveedores" isActive={selectedSegment === 'suppliers'} />
        <SegmentButton value="top-purchases" title="Top Compras" isActive={selectedSegment === 'top-purchases'} />
        <SegmentButton value="trends" title="Tendencias" isActive={selectedSegment === 'trends'} />
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
    marginHorizontal: 2,
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
  supplierInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  supplierDetails: {
    marginLeft: 10,
    flex: 1,
  },
  supplierText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  supplierSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  purchaseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  purchaseDetails: {
    flex: 1,
  },
  purchaseSupplier: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  purchaseText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  purchaseCost: {
    fontSize: 12,
    color: '#34C759',
    fontWeight: '500',
    marginTop: 2,
  },
  purchaseDate: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
  },
  monthInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthDetails: {
    marginLeft: 10,
    flex: 1,
  },
  monthText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  monthSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  monthSavings: {
    fontSize: 12,
    color: '#34C759',
    fontWeight: '500',
    marginTop: 2,
  },
});

export default PurchaseReportsScreen;