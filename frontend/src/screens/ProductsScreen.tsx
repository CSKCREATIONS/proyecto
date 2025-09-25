import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/authContext';
import { apiService } from '../services/api';
import { Product, Category, Subcategory } from '../services/index';
import { globalStyles } from '../styles';
import CrudActions from '../components/CrudActions';
import { ModernCard, ModernButton, ModernBadge } from '../components/ModernComponents';
import { modernTheme } from '../styles/modernTheme';

const ProductsScreen: React.FC = () => {
  const { canEdit, canDelete, hasPermission } = useAuth();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState<Subcategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    sku: '',
    category: '',
    subcategory: '',
    price: '',
    comparePrice: '',
    cost: '',
    stockQuantity: '',
    minStock: '',
    weight: '',
    length: '',
    width: '',
    height: '',
    isActive: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (formData.category) {
      const filtered = subcategories.filter(sub => 
        typeof sub.category === 'object' 
          ? sub.category._id === formData.category
          : sub.category === formData.category
      );
      setFilteredSubcategories(filtered);
      
      const isValidSubcategory = filtered.some(sub => sub._id === formData.subcategory);
      if (!isValidSubcategory) {
        setFormData(prev => ({ ...prev, subcategory: '' }));
      }
    } else {
      setFilteredSubcategories([]);
      setFormData(prev => ({ ...prev, subcategory: '' }));
    }
  }, [formData.category, subcategories]);

  const loadData = async () => {
    try {
      const [productsResponse, categoriesResponse, subcategoriesResponse] = await Promise.all([
        apiService.get<Product[]>('/products'),
        apiService.get<Category[]>('/categories'),
        apiService.get<Subcategory[]>('/subcategories')
      ]);

      if (productsResponse.success && productsResponse.data && Array.isArray(productsResponse.data)) {
        setProducts(productsResponse.data.filter(product => product && product.name));
      }

      if (categoriesResponse.success && categoriesResponse.data && Array.isArray(categoriesResponse.data)) {
        setCategories(categoriesResponse.data.filter(category => category && category.name));
      }

      if (subcategoriesResponse.success && subcategoriesResponse.data && Array.isArray(subcategoriesResponse.data)) {
        setSubcategories(subcategoriesResponse.data.filter(subcategory => subcategory && subcategory.name));
      }
    } catch (error) {
      console.warn('Error cargando datos:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const getFilteredProducts = () => {
    return products.filter((product) => {
      // Verificar que el producto tenga datos válidos
      if (!product || !product.name) {
        return false;
      }
      
      // Filtro por búsqueda
      const matchesSearch = !searchQuery || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.sku && product.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()));

      // Filtro por estado
      let matchesStatus = true;
      if (statusFilter === 'active') {
        matchesStatus = product.isActive === true;
      } else if (statusFilter === 'inactive') {
        matchesStatus = product.isActive === false;
      } else if (statusFilter === 'low-stock') {
        matchesStatus = product.stock.quantity <= (product.stock.minStock || 0);
      }

      return matchesSearch && matchesStatus;
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      shortDescription: '',
      sku: '',
      category: '',
      subcategory: '',
      price: '',
      comparePrice: '',
      cost: '',
      stockQuantity: '',
      minStock: '',
      weight: '',
      length: '',
      width: '',
      height: '',
      isActive: true,
    });
    setEditingProduct(null);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadData();
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalVisible(true);
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      shortDescription: product.shortDescription || '',
      sku: product.sku || '',
      category: typeof product.category === 'object' ? product.category._id : product.category,
      subcategory: typeof product.subcategory === 'object' ? product.subcategory._id : product.subcategory,
      price: product.price.toString(),
      comparePrice: product.comparePrice?.toString() || '',
      cost: product.cost?.toString() || '',
      stockQuantity: product.stock.quantity.toString(),
      minStock: product.stock.minStock?.toString() || '',
      weight: product.dimensions?.weight?.toString() || '',
      length: product.dimensions?.length?.toString() || '',
      width: product.dimensions?.width?.toString() || '',
      height: product.dimensions?.height?.toString() || '',
      isActive: product.isActive,
    });
    setIsModalVisible(true);
  };

  const handleToggleStatus = async (product: Product) => {
    const action = product.isActive ? 'inactivar' : 'activar';
    Alert.alert(
      `Confirmar ${action}`,
      `¿Estás seguro de que quieres ${action} este producto?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: action.charAt(0).toUpperCase() + action.slice(1),
          style: product.isActive ? 'destructive' : 'default',
          onPress: async () => {
            setIsLoading(true);
            try {
              const response = await apiService.patch(`/products/${product._id}/toggle-status`);
              if (response.success) {
                await loadData();
                Alert.alert('Éxito', `Producto ${action}do correctamente`);
              } else {
                Alert.alert('Error', response.message || `No se pudo ${action} el producto`);
              }
            } catch (error) {
              console.error(`Error al ${action}:`, error);
              Alert.alert('Error', `No se pudo ${action} el producto`);
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const closeModal = () => {
    setIsModalVisible(false);
    resetForm();
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.category || !formData.subcategory || !formData.price) {
      Alert.alert('Error', 'Nombre, categoría, subcategoría y precio son obligatorios');
      return;
    }

    setIsLoading(true);
    try {
      const productData = {
        ...formData,
        name: formData.name.trim(),
        description: formData.description.trim(),
        shortDescription: formData.shortDescription.trim(),
        sku: formData.sku.trim(),
        price: parseFloat(formData.price),
        comparePrice: formData.comparePrice ? parseFloat(formData.comparePrice) : undefined,
        cost: formData.cost ? parseFloat(formData.cost) : undefined,
        stock: {
          quantity: parseInt(formData.stockQuantity) || 0,
          minStock: formData.minStock ? parseInt(formData.minStock) : 0,
          trackStock: true,
        },
        dimensions: {
          weight: formData.weight ? parseFloat(formData.weight) : undefined,
          length: formData.length ? parseFloat(formData.length) : undefined,
          width: formData.width ? parseFloat(formData.width) : undefined,
          height: formData.height ? parseFloat(formData.height) : undefined,
        },
      };

      let response;
      if (editingProduct) {
        response = await apiService.put(`/products/${editingProduct._id}`, productData);
      } else {
        response = await apiService.post('/products', productData);
      }

      if (response.success) {
        await loadData();
        closeModal();
        Alert.alert('Éxito', `Producto ${editingProduct ? 'actualizado' : 'creado'} correctamente`);
      } else {
        Alert.alert('Error', response.message || 'Error al guardar el producto');
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      Alert.alert('Error', 'No se pudo guardar el producto');
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryName = (categoryData: string | Category) => {
    if (!categoryData) {
      return 'Sin categoría';
    }
    
    if (typeof categoryData === 'object' && categoryData && categoryData.name) {
      return categoryData.name;
    }
    
    const category = categories.find(c => c._id === categoryData);
    return category ? category.name : 'Categoría desconocida';
  };

  const getSubcategoryName = (subcategoryData: string | Subcategory) => {
    if (!subcategoryData) {
      return 'Sin subcategoría';
    }
    
    if (typeof subcategoryData === 'object' && subcategoryData && subcategoryData.name) {
      return subcategoryData.name;
    }
    
    const subcategory = subcategories.find(s => s._id === subcategoryData);
    return subcategory ? subcategory.name : 'Subcategoría desconocida';
  };

  const getStockStatus = (current: number, min?: number) => {
    if (min && current <= min) return 'danger';
    if (current <= 5) return 'warning';
    return 'success';
  };

  const renderProductCard = ({ item }: { item: Product }) => {
    const stockStatus = getStockStatus(item.stock.quantity, item.stock.minStock);
    
    return (
      <ModernCard style={{ marginBottom: modernTheme.spacing.md, padding: modernTheme.spacing.lg }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: modernTheme.spacing.xs }}>
              <Text style={{
                ...modernTheme.typography.heading.h4,
                color: modernTheme.colors.neutral[800],
                flex: 1,
              }}>
                {item.name}
              </Text>
              <ModernBadge
                text={item.isActive ? 'Activo' : 'Inactivo'}
                variant={item.isActive ? 'success' : 'danger'}
                size="sm"
              />
            </View>
            
            {item.sku && (
              <Text style={{
                ...modernTheme.typography.body.small,
                color: modernTheme.colors.neutral[500],
                marginBottom: modernTheme.spacing.xs,
                fontFamily: 'monospace',
              }}>
                SKU: {item.sku}
              </Text>
            )}

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: modernTheme.spacing.xs }}>
              <Ionicons name="folder" size={14} color="#007BFF" />
              <Text style={{
                ...modernTheme.typography.body.small,
                color: "#007BFF",
                marginLeft: modernTheme.spacing.xs,
                fontWeight: '600'
              }}>
                {getCategoryName(item.category)}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: modernTheme.spacing.xs }}>
              <Ionicons name="layers" size={14} color="#6B7280" />
              <Text style={{
                ...modernTheme.typography.body.small,
                color: "#6B7280",
                marginLeft: modernTheme.spacing.xs,
              }}>
                {getSubcategoryName(item.subcategory)}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: modernTheme.spacing.sm }}>
              <Text style={{
                ...modernTheme.typography.heading.h4,
                color: modernTheme.colors.primary.main,
              }}>
                {formatPrice(item.price)}
              </Text>
              
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="cube" size={14} color={stockStatus === 'danger' ? '#EF4444' : stockStatus === 'warning' ? '#F59E0B' : '#10B981'} />
                <Text style={{
                  ...modernTheme.typography.body.small,
                  color: stockStatus === 'danger' ? '#EF4444' : stockStatus === 'warning' ? '#F59E0B' : '#10B981',
                  marginLeft: modernTheme.spacing.xs,
                  fontWeight: '600'
                }}>
                  Stock: {item.stock.quantity}
                </Text>
              </View>
            </View>

            <Text style={{
              ...modernTheme.typography.body.small,
              color: modernTheme.colors.neutral[500],
              marginTop: modernTheme.spacing.xs,
            }}>
              Creado: {formatearFecha(item.createdAt)}
            </Text>
          </View>

          <View style={{ marginLeft: modernTheme.spacing.md }}>
            <CrudActions
              canEdit={hasPermission('productos.editar')}
              canDelete={hasPermission('productos.eliminar')}
              onEdit={() => handleEdit(item)}
              onDelete={() => handleToggleStatus(item)}
            />
          </View>
        </View>
      </ModernCard>
    );
  };

  return (
    <View style={[globalStyles.container, { flex: 1, position: 'relative' }]}>
      {/* Header Glassmorphism */}
      <View style={{
        backgroundColor: '#007BFF',
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        ...modernTheme.shadows.lg,
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
          <View style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            padding: 10,
            borderRadius: 12,
            marginRight: 12,
          }}>
            <Ionicons name="cube" size={24} color="white" />
          </View>
          <Text style={{
            fontSize: 20,
            color: 'white',
            fontWeight: '700',
            flex: 1
          }}>
            Productos
          </Text>
          
          <View style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <Ionicons name="list" size={14} color="white" />
            <Text style={{
              fontSize: 12,
              fontWeight: '600',
              color: 'white',
              marginLeft: 4,
            }}>{getFilteredProducts().length}</Text>
          </View>
        </View>

        {/* Barra de búsqueda */}
        <View style={{
          flexDirection: 'row',
          backgroundColor: 'rgba(255,255,255,0.15)',
          borderRadius: 15,
          paddingHorizontal: 15,
          paddingVertical: 12,
          marginBottom: 15,
        }}>
          <Ionicons name="search" size={20} color="rgba(255,255,255,0.8)" style={{ marginRight: 10 }} />
          <TextInput
            style={{ flex: 1, color: 'white', fontSize: 16 }}
            placeholder="Buscar productos, SKU..."
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity 
              onPress={() => setSearchQuery('')}
              style={{ padding: 2 }}
            >
              <Ionicons name="close-circle" size={18} color="rgba(255,255,255,0.8)" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Filtros de estado */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 5 }}>
          <View style={{ flexDirection: 'row', paddingHorizontal: 5 }}>
            <TouchableOpacity
              style={{
                backgroundColor: statusFilter === 'all' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 15,
                marginRight: 8,
                borderWidth: statusFilter === 'all' ? 1.5 : 1,
                borderColor: 'rgba(255,255,255,0.4)',
              }}
              onPress={() => setStatusFilter('all')}
            >
              <Text style={{ 
                color: 'white', 
                fontWeight: statusFilter === 'all' ? '600' : '400',
                fontSize: 12 
              }}>
                ⭕ Todos
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: statusFilter === 'active' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255,255,255,0.1)',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 15,
                marginRight: 8,
                borderWidth: statusFilter === 'active' ? 1.5 : 1,
                borderColor: statusFilter === 'active' ? 'rgba(34, 197, 94, 0.6)' : 'rgba(255,255,255,0.4)',
              }}
              onPress={() => setStatusFilter('active')}
            >
              <Text style={{ 
                color: 'white', 
                fontWeight: statusFilter === 'active' ? '600' : '400',
                fontSize: 12 
              }}>
                ✅ Activos
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: statusFilter === 'inactive' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(255,255,255,0.1)',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 15,
                marginRight: 8,
                borderWidth: statusFilter === 'inactive' ? 1.5 : 1,
                borderColor: statusFilter === 'inactive' ? 'rgba(239, 68, 68, 0.6)' : 'rgba(255,255,255,0.4)',
              }}
              onPress={() => setStatusFilter('inactive')}
            >
              <Text style={{ 
                color: 'white', 
                fontWeight: statusFilter === 'inactive' ? '600' : '400',
                fontSize: 12 
              }}>
                ❌ Inactivos
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: statusFilter === 'low-stock' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(255,255,255,0.1)',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 15,
                marginRight: 8,
                borderWidth: statusFilter === 'low-stock' ? 1.5 : 1,
                borderColor: statusFilter === 'low-stock' ? 'rgba(245, 158, 11, 0.6)' : 'rgba(255,255,255,0.4)',
              }}
              onPress={() => setStatusFilter('low-stock')}
            >
              <Text style={{ 
                color: 'white', 
                fontWeight: statusFilter === 'low-stock' ? '600' : '400',
                fontSize: 12 
              }}>
                ⚠️ Stock Bajo
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* Content */}
      {isLoading && !isRefreshing ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={modernTheme.colors.primary.main} />
          <Text style={{
            marginTop: modernTheme.spacing.md,
            color: modernTheme.colors.neutral[600],
            ...modernTheme.typography.body.medium
          }}>Cargando productos...</Text>
        </View>
      ) : (
        <FlatList
          data={getFilteredProducts()}
          keyExtractor={(item) => item._id}
          renderItem={renderProductCard}
          style={{
            flex: 1,
            paddingHorizontal: modernTheme.spacing.lg,
            marginTop: modernTheme.spacing.md,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[modernTheme.colors.primary.main]}
            />
          }
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={() => (
            <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: modernTheme.spacing.xl,
              paddingTop: 100,
            }}>
              <View style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: modernTheme.colors.neutral[100],
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: modernTheme.spacing.lg,
              }}>
                <Ionicons name="cube-outline" size={40} color={modernTheme.colors.neutral[400]} />
              </View>
              
              <Text style={{
                ...modernTheme.typography.heading.h3,
                color: modernTheme.colors.neutral[700],
                textAlign: 'center',
                marginBottom: modernTheme.spacing.sm,
              }}>
                No se encontraron productos
              </Text>
              
              <Text style={{
                ...modernTheme.typography.body.medium,
                color: modernTheme.colors.neutral[500],
                textAlign: 'center',
                lineHeight: 20,
              }}>
                {searchQuery || statusFilter !== 'all'
                  ? 'No hay productos que coincidan con los filtros aplicados'
                  : 'Agrega tu primer producto para empezar'
                }
              </Text>
            </View>
          )}
        />
      )}

      {/* Modal para crear/editar */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: modernTheme.colors.neutral.white }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: modernTheme.spacing.lg,
            borderBottomWidth: 1,
            borderBottomColor: modernTheme.colors.neutral[200],
          }}>
            <Text style={{
              ...modernTheme.typography.heading.h2,
              color: modernTheme.colors.neutral[800],
            }}>
              {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
            </Text>
            <TouchableOpacity onPress={closeModal}>
              <Ionicons name="close" size={24} color={modernTheme.colors.neutral[600]} />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ flex: 1, padding: modernTheme.spacing.lg }}>
            {/* Información básica */}
            <Text style={{
              ...modernTheme.typography.heading.h3,
              color: modernTheme.colors.neutral[800],
              marginBottom: modernTheme.spacing.md,
            }}>
              Información Básica
            </Text>

            {/* Nombre */}
            <View style={{ marginBottom: modernTheme.spacing.lg }}>
              <Text style={{
                ...modernTheme.typography.body.medium,
                fontWeight: '600',
                color: modernTheme.colors.neutral[700],
                marginBottom: modernTheme.spacing.sm,
              }}>
                Nombre *
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: modernTheme.colors.neutral[300],
                  borderRadius: modernTheme.radius.md,
                  padding: modernTheme.spacing.md,
                  backgroundColor: modernTheme.colors.neutral.white,
                }}
                placeholder="Nombre del producto"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />
            </View>

            {/* SKU */}
            <View style={{ marginBottom: modernTheme.spacing.lg }}>
              <Text style={{
                ...modernTheme.typography.body.medium,
                fontWeight: '600',
                color: modernTheme.colors.neutral[700],
                marginBottom: modernTheme.spacing.sm,
              }}>
                SKU
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: modernTheme.colors.neutral[300],
                  borderRadius: modernTheme.radius.md,
                  padding: modernTheme.spacing.md,
                  backgroundColor: modernTheme.colors.neutral.white,
                  fontFamily: 'monospace',
                }}
                placeholder="Código único del producto"
                value={formData.sku}
                onChangeText={(text) => setFormData({ ...formData, sku: text })}
              />
            </View>

            {/* Categoría */}
            <View style={{ marginBottom: modernTheme.spacing.lg }}>
              <Text style={{
                ...modernTheme.typography.body.medium,
                fontWeight: '600',
                color: modernTheme.colors.neutral[700],
                marginBottom: modernTheme.spacing.sm,
              }}>
                Categoría *
              </Text>
              <View style={{
                borderWidth: 1,
                borderColor: modernTheme.colors.neutral[300],
                borderRadius: modernTheme.radius.md,
                backgroundColor: modernTheme.colors.neutral.white,
              }}>
                <Picker
                  selectedValue={formData.category}
                  style={{ height: 50 }}
                  onValueChange={(itemValue) => setFormData({ ...formData, category: itemValue })}
                >
                  <Picker.Item label="Selecciona una categoría" value="" />
                  {categories.filter(category => category && category.name).map((category) => (
                    <Picker.Item 
                      key={category._id} 
                      label={category.name} 
                      value={category._id} 
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Subcategoría */}
            <View style={{ marginBottom: modernTheme.spacing.lg }}>
              <Text style={{
                ...modernTheme.typography.body.medium,
                fontWeight: '600',
                color: modernTheme.colors.neutral[700],
                marginBottom: modernTheme.spacing.sm,
              }}>
                Subcategoría *
              </Text>
              <View style={{
                borderWidth: 1,
                borderColor: modernTheme.colors.neutral[300],
                borderRadius: modernTheme.radius.md,
                backgroundColor: modernTheme.colors.neutral.white,
              }}>
                <Picker
                  selectedValue={formData.subcategory}
                  style={{ height: 50 }}
                  onValueChange={(itemValue) => setFormData({ ...formData, subcategory: itemValue })}
                  enabled={filteredSubcategories.length > 0}
                >
                  <Picker.Item 
                    label={formData.category ? "Selecciona una subcategoría" : "Primero selecciona una categoría"} 
                    value="" 
                  />
                  {filteredSubcategories.filter(subcategory => subcategory && subcategory.name).map((subcategory) => (
                    <Picker.Item 
                      key={subcategory._id} 
                      label={subcategory.name} 
                      value={subcategory._id} 
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Descripción */}
            <View style={{ marginBottom: modernTheme.spacing.lg }}>
              <Text style={{
                ...modernTheme.typography.body.medium,
                fontWeight: '600',
                color: modernTheme.colors.neutral[700],
                marginBottom: modernTheme.spacing.sm,
              }}>
                Descripción
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: modernTheme.colors.neutral[300],
                  borderRadius: modernTheme.radius.md,
                  padding: modernTheme.spacing.md,
                  backgroundColor: modernTheme.colors.neutral.white,
                  textAlignVertical: 'top',
                  minHeight: 80,
                }}
                placeholder="Descripción detallada del producto"
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                multiline
              />
            </View>

            {/* Precios */}
            <Text style={{
              ...modernTheme.typography.heading.h3,
              color: modernTheme.colors.neutral[800],
              marginBottom: modernTheme.spacing.md,
            }}>
              Precios e Inventario
            </Text>

            {/* Precio */}
            <View style={{ marginBottom: modernTheme.spacing.lg }}>
              <Text style={{
                ...modernTheme.typography.body.medium,
                fontWeight: '600',
                color: modernTheme.colors.neutral[700],
                marginBottom: modernTheme.spacing.sm,
              }}>
                Precio *
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: modernTheme.colors.neutral[300],
                  borderRadius: modernTheme.radius.md,
                  padding: modernTheme.spacing.md,
                  backgroundColor: modernTheme.colors.neutral.white,
                }}
                placeholder="0.00"
                value={formData.price}
                onChangeText={(text) => setFormData({ ...formData, price: text })}
                keyboardType="numeric"
              />
            </View>

            {/* Stock */}
            <View style={{ marginBottom: modernTheme.spacing.lg }}>
              <Text style={{
                ...modernTheme.typography.body.medium,
                fontWeight: '600',
                color: modernTheme.colors.neutral[700],
                marginBottom: modernTheme.spacing.sm,
              }}>
                Cantidad en Stock
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: modernTheme.colors.neutral[300],
                  borderRadius: modernTheme.radius.md,
                  padding: modernTheme.spacing.md,
                  backgroundColor: modernTheme.colors.neutral.white,
                }}
                placeholder="0"
                value={formData.stockQuantity}
                onChangeText={(text) => setFormData({ ...formData, stockQuantity: text })}
                keyboardType="numeric"
              />
            </View>

            {/* Estado Activo */}
            <View style={{ marginBottom: modernTheme.spacing.xl }}>
              <Text style={{
                ...modernTheme.typography.body.medium,
                fontWeight: '600',
                color: modernTheme.colors.neutral[700],
                marginBottom: modernTheme.spacing.sm,
              }}>
                Estado
              </Text>
              <TouchableOpacity 
                style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center',
                  paddingVertical: modernTheme.spacing.sm,
                }}
                onPress={() => setFormData({ ...formData, isActive: !formData.isActive })}
              >
                <View style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: formData.isActive ? modernTheme.colors.success.main : modernTheme.colors.neutral[300],
                  marginRight: modernTheme.spacing.sm,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  {formData.isActive && <Ionicons name="checkmark" size={12} color="white" />}
                </View>
                <Text style={{
                  ...modernTheme.typography.body.medium,
                  color: modernTheme.colors.neutral[700],
                }}>
                  Producto activo
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={{
            padding: modernTheme.spacing.lg,
            borderTopWidth: 1,
            borderTopColor: modernTheme.colors.neutral[200],
            backgroundColor: modernTheme.colors.neutral.white,
          }}>
            <ModernButton
              title={editingProduct ? 'Actualizar Producto' : 'Crear Producto'}
              onPress={handleSave}
              disabled={isLoading}
              loading={isLoading}
            />
          </View>
        </SafeAreaView>
      </Modal>

      {/* Floating Action Button - NUEVO */}
      {hasPermission('productos.crear') && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 90,
            right: 30,
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: '#007BFF',
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            zIndex: 1000,
          }}
          onPress={openCreateModal}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ProductsScreen;