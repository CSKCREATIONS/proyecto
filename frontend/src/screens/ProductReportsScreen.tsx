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

interface ProductStats {
  totalProducts: number;
  totalCategories: number;
  totalSubcategories: number;
  lowStockProducts: number;
  outOfStockProducts: number;
}

interface CategoryReport {
  _id: string;
  name: string;
  productCount: number;
  totalValue: number;
}

interface ProductReport {
  _id: string;
  name: string;
  category: string;
  subcategory: string;
  stock: number;
  sold: number;
  revenue: number;
}

interface LowStockProduct {
  _id: string;
  name: string;
  stock: number;
  minStock: number;
  category: string;
}

const ProductReportsScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<string>('overview');
  const [stats, setStats] = useState<ProductStats | null>(null);
  const [categoryReports, setCategoryReports] = useState<CategoryReport[]>([]);
  const [topProducts, setTopProducts] = useState<ProductReport[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      // Simular carga de datos - aquí irían las llamadas reales a la API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Datos simulados
      setStats({
        totalProducts: 245,
        totalCategories: 15,
        totalSubcategories: 48,
        lowStockProducts: 12,
        outOfStockProducts: 3
      });

      setCategoryReports([
        { _id: '1', name: 'Electrónicos', productCount: 45, totalValue: 125000 },
        { _id: '2', name: 'Ropa', productCount: 78, totalValue: 89000 },
        { _id: '3', name: 'Hogar', productCount: 32, totalValue: 56000 },
        { _id: '4', name: 'Deportes', productCount: 28, totalValue: 34000 },
        { _id: '5', name: 'Libros', productCount: 62, totalValue: 18000 }
      ]);

      setTopProducts([
        { _id: '1', name: 'iPhone 15', category: 'Electrónicos', subcategory: 'Smartphones', stock: 25, sold: 45, revenue: 67500 },
        { _id: '2', name: 'Camiseta Nike', category: 'Ropa', subcategory: 'Deportiva', stock: 120, sold: 89, revenue: 4450 },
        { _id: '3', name: 'Laptop HP', category: 'Electrónicos', subcategory: 'Computadoras', stock: 8, sold: 23, revenue: 34500 },
        { _id: '4', name: 'Zapatillas Adidas', category: 'Ropa', subcategory: 'Calzado', stock: 45, sold: 67, revenue: 10050 }
      ]);

      setLowStockProducts([
        { _id: '1', name: 'MacBook Pro', stock: 2, minStock: 5, category: 'Electrónicos' },
        { _id: '2', name: 'Samsung TV', stock: 1, minStock: 3, category: 'Electrónicos' },
        { _id: '3', name: 'Sofá 3 plazas', stock: 0, minStock: 2, category: 'Hogar' }
      ]);

    } catch (error) {
      console.error('Error cargando reportes:', error);
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
          <StatCard icon="cube-outline" value={stats?.totalProducts || 0} label="Total Productos" color="#007AFF" />
        </View>
        <View style={styles.statContainer}>
          <StatCard icon="folder-outline" value={stats?.totalCategories || 0} label="Categorías" color="#34C759" />
        </View>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statContainer}>
          <StatCard icon="bar-chart-outline" value={stats?.totalSubcategories || 0} label="Subcategorías" color="#FF9500" />
        </View>
        <View style={styles.statContainer}>
          <StatCard icon="alert-circle-outline" value={stats?.lowStockProducts || 0} label="Stock Bajo" color="#FF3B30" />
        </View>
      </View>
    </View>
  );

  const renderCategories = () => (
    <View>
      {categoryReports.map((category) => (
        <ReportCard key={category._id} title={category.name}>
          <View style={styles.categoryInfo}>
            <Ionicons name="cube-outline" size={20} color="#007AFF" />
            <View style={styles.categoryDetails}>
              <Text style={styles.categoryText}>Productos: {category.productCount}</Text>
              <Text style={styles.categorySubtext}>Valor Total: {formatCurrency(category.totalValue)}</Text>
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
              <Text style={styles.productCategory}>{product.category} / {product.subcategory}</Text>
              <Text style={styles.productText}>Stock: {product.stock} | Vendidos: {product.sold}</Text>
              <Text style={styles.productRevenue}>Ingresos: {formatCurrency(product.revenue)}</Text>
            </View>
            <Ionicons name="trending-up-outline" size={24} color="#34C759" />
          </View>
        </ReportCard>
      ))}
    </View>
  );

  const renderLowStock = () => (
    <View>
      {lowStockProducts.map((product) => (
        <ReportCard key={product._id} title={product.name}>
          <View style={[styles.lowStockCard, { backgroundColor: product.stock === 0 ? '#FFEBEE' : '#FFF8E1' }]}>
            <Ionicons 
              name="alert-circle-outline" 
              size={20} 
              color={product.stock === 0 ? '#F44336' : '#FF9800'} 
            />
            <View style={styles.lowStockDetails}>
              <Text style={styles.lowStockCategory}>{product.category}</Text>
              <Text style={styles.lowStockText}>Stock Actual: {product.stock}</Text>
              <Text style={styles.lowStockText}>Mínimo Requerido: {product.minStock}</Text>
              {product.stock === 0 && <Text style={styles.outOfStock}>¡SIN STOCK!</Text>}
            </View>
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
          <Text style={styles.loadingText}>Cargando reportes...</Text>
        </View>
      );
    }

    switch (selectedSegment) {
      case 'overview':
        return renderOverview();
      case 'categories':
        return renderCategories();
      case 'top-products':
        return renderTopProducts();
      case 'low-stock':
        return renderLowStock();
      default:
        return renderOverview();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📊 Reportes de Productos</Text>
      </View>
      
      <View style={styles.segmentContainer}>
        <SegmentButton value="overview" title="General" isActive={selectedSegment === 'overview'} />
        <SegmentButton value="categories" title="Categorías" isActive={selectedSegment === 'categories'} />
        <SegmentButton value="top-products" title="Top Productos" isActive={selectedSegment === 'top-products'} />
        <SegmentButton value="low-stock" title="Stock Bajo" isActive={selectedSegment === 'low-stock'} />
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
    paddingHorizontal: 12,
    marginHorizontal: 2,
    borderRadius: 8,
    alignItems: 'center',
  },
  segmentButtonActive: {
    backgroundColor: '#007AFF',
  },
  segmentButtonText: {
    fontSize: 12,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
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
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDetails: {
    marginLeft: 10,
    flex: 1,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  categorySubtext: {
    fontSize: 12,
    color: '#666',
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
  lowStockCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
  },
  lowStockDetails: {
    marginLeft: 10,
    flex: 1,
  },
  lowStockCategory: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  lowStockText: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  outOfStock: {
    fontSize: 12,
    color: '#F44336',
    fontWeight: 'bold',
    marginTop: 4,
  },
});

export default ProductReportsScreen;