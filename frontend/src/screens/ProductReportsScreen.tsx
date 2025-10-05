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
      // Cargar datos reales de la BD pangea1
      const [productosResponse, categoriesResponse, subcategoriesResponse, ventasResponse] = await Promise.all([
        apiService.get('/products'),
        apiService.get('/categories'),
        apiService.get('/subcategories'),
        apiService.get('/ventas')
      ]);

      const productos = Array.isArray(productosResponse.data) ? productosResponse.data : [];
      const categorias = Array.isArray(categoriesResponse.data) ? categoriesResponse.data : [];
      const subcategorias = Array.isArray(subcategoriesResponse.data) ? subcategoriesResponse.data : [];
      const ventas = Array.isArray(ventasResponse.data) ? ventasResponse.data : [];

      // Calcular estadísticas reales de productos
      const totalProducts = productos.length;
      const totalCategories = categorias.length;
      const totalSubcategories = subcategorias.length;
      
      // Productos con stock bajo (asumiendo que stock menor a 10 es bajo)
      const lowStockProducts = productos.filter((p: any) => {
        const stock = typeof p.stock === 'object' ? p.stock.quantity : p.stock;
        return stock <= 10 && stock > 0;
      }).length;
      
      // Productos sin stock
      const outOfStockProducts = productos.filter((p: any) => {
        const stock = typeof p.stock === 'object' ? p.stock.quantity : p.stock;
        return stock === 0;
      }).length;

      setStats({
        totalProducts,
        totalCategories,
        totalSubcategories,
        lowStockProducts,
        outOfStockProducts
      });

      // Calcular reportes por categoría con datos reales
      const categoryReportsData = categorias.map((categoria: any) => {
        const productosEnCategoria = productos.filter((p: any) => 
          p.category?._id === categoria._id || p.category === categoria._id
        );
        
        const totalValue = productosEnCategoria.reduce((sum: number, p: any) => {
          const stock = typeof p.stock === 'object' ? p.stock.quantity : p.stock;
          return sum + (stock * (p.price || 0));
        }, 0);

        return {
          _id: categoria._id,
          name: categoria.name,
          productCount: productosEnCategoria.length,
          totalValue: totalValue
        };
      }).sort((a, b) => b.productCount - a.productCount);

      setCategoryReports(categoryReportsData);

      // Calcular productos más vendidos basado en ventas reales
      const productSales: { [key: string]: any } = {};
      ventas.forEach((venta: any) => {
        if (venta.productos && Array.isArray(venta.productos)) {
          venta.productos.forEach((item: any) => {
            const productId = item.producto?._id || item.producto;
            if (productId) {
              if (!productSales[productId]) {
                productSales[productId] = {
                  sold: 0,
                  revenue: 0,
                  productInfo: item.producto
                };
              }
              productSales[productId].sold += item.cantidad || 0;
              productSales[productId].revenue += (item.cantidad || 0) * (item.precioUnitario || 0);
            }
          });
        }
      });

      const topProductsData = Object.entries(productSales)
        .map(([productId, data]) => {
          const productInfo = data.productInfo || productos.find((p: any) => p._id === productId);
          const stock = typeof productInfo?.stock === 'object' ? productInfo?.stock.quantity : productInfo?.stock;
          
          return {
            _id: productId,
            name: productInfo?.name || 'Producto Desconocido',
            category: productInfo?.category?.name || 'Sin Categoría',
            subcategory: productInfo?.subcategory?.name || 'Sin Subcategoría',
            stock: stock || 0,
            sold: data.sold,
            revenue: data.revenue
          };
        })
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 4);

      setTopProducts(topProductsData);

      // Calcular productos con stock bajo usando datos reales
      const lowStockProductsData = productos
        .filter((producto: any) => {
          const stock = typeof producto.stock === 'object' ? producto.stock.quantity : producto.stock;
          return stock <= 10; // Stock bajo o sin stock
        })
        .map((producto: any) => {
          const stock = typeof producto.stock === 'object' ? producto.stock.quantity : producto.stock;
          const minStock = typeof producto.stock === 'object' ? producto.stock.minStock : 5;
          
          return {
            _id: producto._id,
            name: producto.name,
            stock: stock,
            minStock: minStock || 5,
            category: producto.category?.name || 'Sin Categoría'
          };
        })
        .sort((a, b) => a.stock - b.stock)
        .slice(0, 10); // Mostrar los 10 con menor stock

      setLowStockProducts(lowStockProductsData);

    } catch (error: any) {
      console.error('Error cargando reportes de productos:', error);
      Alert.alert('Error', 'No se pudieron cargar los reportes de productos: ' + (error?.message || 'Error desconocido'));
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
        <Text style={styles.headerTitle}>📊 REPORTES DE PRODUCTOS BD PANGEA1</Text>
        <Text style={styles.headerSubtitle}>Datos en tiempo real de inventario</Text>
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