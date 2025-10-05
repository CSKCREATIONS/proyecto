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
import { apiService } from '../services/api';

interface SalesStats {
  totalSales: number;
  totalRevenue: number;
  averageOrderValue: number;
  totalCustomers: number;
  completedSales: number;
  returnedSales: number;
  deliveredOrders: number;
  pendingOrders: number;
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

interface DeliveredOrder {
  _id: string;
  numeroPedido: string;
  cliente: string;
  total: number;
  fechaEntrega: string;
  productos: number;
  estado: string;
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
  const [deliveredOrders, setDeliveredOrders] = useState<DeliveredOrder[]>([]);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      // Cargar datos reales de la BD pangea1
      const [ventasResponse, clientesResponse, productosResponse, usersResponse, pedidosResponse] = await Promise.all([
        apiService.get('/ventas'),
        apiService.get('/clientes'),
        apiService.get('/products'),
        apiService.get('/users'),
        apiService.get('/pedidos')
      ]);

      const ventas = Array.isArray(ventasResponse.data) ? ventasResponse.data : [];
      const clientes = Array.isArray(clientesResponse.data) ? clientesResponse.data : [];
      const productos = Array.isArray(productosResponse.data) ? productosResponse.data : [];
      const users = Array.isArray(usersResponse.data) ? usersResponse.data : [];
      const pedidos = Array.isArray(pedidosResponse.data) ? pedidosResponse.data : [];

      // Calcular estadísticas reales de ventas (todas las ventas)
      const totalSales = ventas.length;
      const totalRevenue = ventas.reduce((sum: number, venta: any) => sum + (venta.total || 0), 0);
      const averageOrderValue = totalSales > 0 ? totalRevenue / totalSales : 0;
      const totalCustomers = clientes.length;
      const completedSales = ventas.filter((v: any) => v.estado === 'completado').length;
      const returnedSales = ventas.filter((v: any) => v.estado === 'devuelta').length;
      
      // Calcular estadísticas de pedidos
      const deliveredOrders = pedidos.filter((p: any) => p.estado === 'entregado').length;
      const pendingOrders = pedidos.filter((p: any) => ['agendado', 'despachado'].includes(p.estado)).length;

      setStats({
        totalSales,
        totalRevenue,
        averageOrderValue,
        totalCustomers,
        completedSales,
        returnedSales,
        deliveredOrders,
        pendingOrders
      });

      // Calcular ventas por período (últimos 5 meses)
      const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      const currentDate = new Date();
      const periodSalesData = [];

      for (let i = 4; i >= 0; i--) {
        const periodDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const nextPeriodDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 1);
        
        const periodVentas = ventas.filter((venta: any) => {
          const ventaDate = new Date(venta.fecha);
          return ventaDate >= periodDate && ventaDate < nextPeriodDate;
        });

        const periodRevenue = periodVentas.reduce((sum: number, venta: any) => sum + (venta.total || 0), 0);
        const periodSalesCount = periodVentas.length;
        
        // Calcular crecimiento comparado con período anterior
        const prevPeriodDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i - 1, 1);
        const prevNextPeriodDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const prevPeriodVentas = ventas.filter((venta: any) => {
          const ventaDate = new Date(venta.fecha);
          return ventaDate >= prevPeriodDate && ventaDate < prevNextPeriodDate;
        });
        const prevPeriodRevenue = prevPeriodVentas.reduce((sum: number, venta: any) => sum + (venta.total || 0), 0);
        const growth = prevPeriodRevenue > 0 ? ((periodRevenue - prevPeriodRevenue) / prevPeriodRevenue) * 100 : 0;

        periodSalesData.push({
          period: monthNames[periodDate.getMonth()],
          sales: periodSalesCount,
          revenue: periodRevenue,
          growth: growth
        });
      }

      setPeriodSales(periodSalesData);

      // Calcular productos más vendidos basado en ventas reales
      const productSales: { [key: string]: any } = {};
      ventas.forEach((venta: any) => {
        if (venta.productos && Array.isArray(venta.productos)) {
          venta.productos.forEach((item: any) => {
            const productId = item.producto?._id || item.producto;
            if (productId) {
              if (!productSales[productId]) {
                productSales[productId] = {
                  unitsSold: 0,
                  revenue: 0,
                  productInfo: item.producto
                };
              }
              productSales[productId].unitsSold += item.cantidad || 0;
              productSales[productId].revenue += (item.cantidad || 0) * (item.precioUnitario || 0);
            }
          });
        }
      });

      const topProductsData = Object.entries(productSales)
        .map(([productId, data]) => {
          const productInfo = data.productInfo || productos.find((p: any) => p._id === productId);
          return {
            _id: productId,
            name: productInfo?.name || 'Producto Desconocido',
            unitsSold: data.unitsSold,
            revenue: data.revenue,
            category: productInfo?.category?.name || 'Sin Categoría'
          };
        })
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 4);

      setTopProducts(topProductsData);

      // Calcular mejores clientes basado en ventas reales
      const customerStats: { [key: string]: any } = {};
      ventas.forEach((venta: any) => {
        const clienteId = venta.cliente?._id || venta.cliente;
        if (clienteId) {
          if (!customerStats[clienteId]) {
            customerStats[clienteId] = {
              totalPurchases: 0,
              totalSpent: 0,
              lastPurchase: venta.fecha,
              clienteInfo: venta.cliente
            };
          }
          customerStats[clienteId].totalPurchases++;
          customerStats[clienteId].totalSpent += venta.total || 0;
          if (new Date(venta.fecha) > new Date(customerStats[clienteId].lastPurchase)) {
            customerStats[clienteId].lastPurchase = venta.fecha;
          }
        }
      });

      const topCustomersData = Object.entries(customerStats)
        .map(([clienteId, data]) => {
          const clienteInfo = data.clienteInfo || clientes.find((c: any) => c._id === clienteId);
          return {
            _id: clienteId,
            name: clienteInfo?.nombre || clienteInfo?.name || 'Cliente Desconocido',
            totalPurchases: data.totalPurchases,
            totalSpent: data.totalSpent,
            lastPurchase: data.lastPurchase
          };
        })
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, 4);

      setTopCustomers(topCustomersData);

      // Calcular rendimiento de vendedores basado en usuarios con rol de vendedor
      const vendedores = users.filter((user: any) => 
        user.role?.name?.toLowerCase().includes('vendedor') || 
        user.role?.name?.toLowerCase().includes('ventas') ||
        user.role?.name?.toLowerCase().includes('seller')
      );

      const sellerPerformanceData = vendedores.map((vendedor: any) => {
        const vendedorVentas = ventas.filter((venta: any) => 
          venta.vendedor === vendedor._id || 
          venta.createdBy === vendedor._id
        );
        
        const salesCount = vendedorVentas.length;
        const revenue = vendedorVentas.reduce((sum: number, venta: any) => sum + (venta.total || 0), 0);
        const averageOrderValue = salesCount > 0 ? revenue / salesCount : 0;

        return {
          sellerId: vendedor._id,
          sellerName: vendedor.nombre || vendedor.name || 'Vendedor',
          salesCount,
          revenue,
          averageOrderValue
        };
      }).sort((a, b) => b.revenue - a.revenue);

      setSellerPerformance(sellerPerformanceData);

      // Calcular pedidos entregados más recientes
      const deliveredOrdersData = pedidos
        .filter((pedido: any) => pedido.estado === 'entregado')
        .map((pedido: any) => ({
          _id: pedido._id,
          numeroPedido: pedido.numeroPedido || `PED-${pedido._id.slice(-6)}`,
          cliente: pedido.cliente?.nombre || pedido.cliente?.name || 'Cliente Desconocido',
          total: pedido.total || 0,
          fechaEntrega: pedido.fechaEntrega || pedido.updatedAt,
          productos: pedido.productos?.length || 0,
          estado: pedido.estado
        }))
        .sort((a: any, b: any) => new Date(b.fechaEntrega).getTime() - new Date(a.fechaEntrega).getTime())
        .slice(0, 10); // Mostrar los 10 más recientes

      setDeliveredOrders(deliveredOrdersData);

    } catch (error) {
      console.error('Error cargando reportes de ventas:', error);
      const errorMessage = (error instanceof Error && error.message) ? error.message : String(error);
      Alert.alert('Error', 'No se pudieron cargar los reportes de ventas: ' + errorMessage);
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
      <View style={styles.statsRow}>
        <View style={styles.statContainer}>
          <StatCard icon="cube-outline" value={stats?.deliveredOrders || 0} label="Pedidos Entregados" color="#3498DB" />
        </View>
        <View style={styles.statContainer}>
          <StatCard icon="time-outline" value={stats?.pendingOrders || 0} label="Pedidos Pendientes" color="#F39C12" />
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

  const renderOrders = () => (
    <View>
      {deliveredOrders.map((order, index) => (
        <ReportCard key={order._id} title={order.numeroPedido} badge="Entregado">
          <View style={styles.orderInfo}>
            <View style={styles.orderDetails}>
              <Text style={styles.orderClient}>Cliente: {order.cliente}</Text>
              <Text style={styles.orderProducts}>Productos: {order.productos} items</Text>
              <Text style={styles.orderTotal}>Total: {formatCurrency(order.total)}</Text>
              <Text style={styles.orderDate}>Fecha entrega: {formatDate(order.fechaEntrega)}</Text>
            </View>
            <View style={styles.orderStatus}>
              <Ionicons name="checkmark-circle" size={24} color="#27AE60" />
              <Text style={styles.orderStatusText}>Entregado</Text>
            </View>
          </View>
        </ReportCard>
      ))}
      {deliveredOrders.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="cube-outline" size={48} color="#999" />
          <Text style={styles.emptyStateText}>No hay pedidos entregados</Text>
        </View>
      )}
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
      case 'orders':
        return renderOrders();
      default:
        return renderOverview();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>💰 REPORTES DE VENTAS BD PANGEA1</Text>
        <Text style={styles.headerSubtitle}>Datos en tiempo real de la base de datos</Text>
      </View>
      
      <View style={styles.segmentContainer}>
        <SegmentButton value="overview" title="General" isActive={selectedSegment === 'overview'} />
        <SegmentButton value="periods" title="Períodos" isActive={selectedSegment === 'periods'} />
        <SegmentButton value="top-products" title="Top Productos" isActive={selectedSegment === 'top-products'} />
        <SegmentButton value="customers" title="Clientes" isActive={selectedSegment === 'customers'} />
        <SegmentButton value="orders" title="Pedidos" isActive={selectedSegment === 'orders'} />
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
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
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
  orderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderDetails: {
    flex: 1,
  },
  orderClient: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  orderProducts: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  orderTotal: {
    fontSize: 12,
    color: '#34C759',
    fontWeight: '500',
    marginTop: 2,
  },
  orderDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  orderStatus: {
    alignItems: 'center',
  },
  orderStatusText: {
    fontSize: 11,
    color: '#27AE60',
    fontWeight: '500',
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
});

export default SalesReportsScreen;