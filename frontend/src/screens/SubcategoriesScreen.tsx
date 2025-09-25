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
import { Subcategory, Category } from '../services/index';
import { globalStyles } from '../styles';
import CrudActions from '../components/CrudActions';
import { ModernCard, ModernButton, ModernBadge } from '../components/ModernComponents';
import { modernTheme } from '../styles/modernTheme';

const SubcategoriasScreen: React.FC = () => {
  const { canEdit, canDelete, hasPermission } = useAuth();
  
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    isActive: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [subcategoriesResponse, categoriesResponse] = await Promise.all([
        apiService.get<Subcategory[]>('/subcategories'),
        apiService.get<Category[]>('/categories')
      ]);

      if (subcategoriesResponse.success && subcategoriesResponse.data && Array.isArray(subcategoriesResponse.data)) {
        setSubcategories(subcategoriesResponse.data);
      }

      if (categoriesResponse.success && categoriesResponse.data && Array.isArray(categoriesResponse.data)) {
        setCategories(categoriesResponse.data);
      }
    } catch (error) {
      console.warn('Error cargando datos:', error);
      Alert.alert('Error', 'No se pudieron cargar los datos');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const getFilteredSubcategories = () => {
    return subcategories.filter((subcategory) => {
      // Filtro por búsqueda
      const matchesSearch = !searchQuery || 
        subcategory.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (subcategory.description && subcategory.description.toLowerCase().includes(searchQuery.toLowerCase()));

      // Filtro por categoría
      let matchesCategory = true;
      if (selectedCategory) {
        const categoryId = typeof subcategory.category === 'object' 
          ? subcategory.category._id 
          : subcategory.category;
        matchesCategory = categoryId === selectedCategory;
      }

      // Filtro por estado
      let matchesStatus = true;
      if (statusFilter === 'active') {
        matchesStatus = subcategory.isActive === true;
      } else if (statusFilter === 'inactive') {
        matchesStatus = subcategory.isActive === false;
      }

      return matchesSearch && matchesCategory && matchesStatus;
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      isActive: true,
    });
    setEditingSubcategory(null);
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

  const handleEdit = (subcategory: Subcategory) => {
    setEditingSubcategory(subcategory);
    setFormData({
      name: subcategory.name,
      description: subcategory.description || '',
      category: typeof subcategory.category === 'object' ? subcategory.category._id : subcategory.category,
      isActive: subcategory.isActive,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Cambiar estado',
      '¿Estás seguro de que quieres cambiar el estado de esta subcategoría?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cambiar',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              const response = await apiService.patch(`/subcategories/${id}/toggle-status`);
              if (response.success) {
                await loadData();
                Alert.alert('Éxito', 'Estado de subcategoría cambiado correctamente');
              } else {
                Alert.alert('Error', response.message || 'No se pudo cambiar el estado de la subcategoría');
              }
            } catch (error) {
              console.error('Error al cambiar estado:', error);
              Alert.alert('Error', 'No se pudo cambiar el estado de la subcategoría');
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
    if (!formData.name.trim() || !formData.category) {
      Alert.alert('Error', 'El nombre y la categoría son obligatorios');
      return;
    }

    setIsLoading(true);
    try {
      const subcategoryData = {
        ...formData,
        name: formData.name.trim(),
        description: formData.description.trim(),
      };

      let response;
      if (editingSubcategory) {
        response = await apiService.put(`/subcategories/${editingSubcategory._id}`, subcategoryData);
      } else {
        response = await apiService.post('/subcategories', subcategoryData);
      }

      if (response.success) {
        await loadData();
        closeModal();
        Alert.alert('Éxito', `Subcategoría ${editingSubcategory ? 'actualizada' : 'creada'} correctamente`);
      } else {
        Alert.alert('Error', response.message || 'Error al guardar la subcategoría');
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      Alert.alert('Error', 'No se pudo guardar la subcategoría');
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryName = (categoryData: string | Category) => {
    if (typeof categoryData === 'object' && categoryData.name) {
      return categoryData.name;
    }
    
    const category = categories.find(c => c._id === categoryData);
    return category ? category.name : 'Categoría desconocida';
  };

  const renderSubcategoryCard = ({ item }: { item: Subcategory }) => {
    return (
      <ModernCard style={{ marginBottom: modernTheme.spacing.md, padding: modernTheme.spacing.lg }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <Text style={{
              ...modernTheme.typography.heading.h4,
              color: modernTheme.colors.neutral[800],
              marginBottom: modernTheme.spacing.xs,
            }}>
              {item.name}
            </Text>
            
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
            
            {item.description && (
              <Text style={{
                ...modernTheme.typography.body.small,
                color: modernTheme.colors.neutral[600],
                marginBottom: modernTheme.spacing.sm,
              }}>
                {item.description}
              </Text>
            )}

            <Text style={{
              ...modernTheme.typography.body.small,
              color: modernTheme.colors.neutral[500],
            }}>
              Creada: {formatearFecha(item.createdAt)}
            </Text>
          </View>

          <View style={{ alignItems: 'flex-end' }}>
            <ModernBadge
              text={item.isActive ? 'Activa' : 'Inactiva'}
              variant={item.isActive ? 'success' : 'danger'}
              size="sm"
            />
            
            <View style={{ marginTop: modernTheme.spacing.sm }}>
              <CrudActions
                canEdit={hasPermission('subcategorias.editar')}
                canDelete={hasPermission('subcategorias.eliminar')}
                onEdit={() => handleEdit(item)}
                onDelete={() => handleDelete(item._id)}
              />
            </View>
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
            <Ionicons name="layers" size={24} color="white" />
          </View>
          <Text style={{
            fontSize: 20,
            color: 'white',
            fontWeight: '700',
            flex: 1
          }}>
            Subcategorías
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
            }}>{getFilteredSubcategories().length}</Text>
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
            placeholder="Buscar subcategorías..."
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

        {/* Filtros horizontales */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 5 }}>
          <View style={{ flexDirection: 'row', paddingHorizontal: 5 }}>
            {/* Filtro de categorías */}
            <TouchableOpacity
              style={{
                backgroundColor: !selectedCategory ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                marginRight: 10,
                borderWidth: !selectedCategory ? 2 : 1,
                borderColor: 'rgba(255,255,255,0.3)',
              }}
              onPress={() => setSelectedCategory('')}
            >
              <Text style={{ 
                color: 'white', 
                fontWeight: !selectedCategory ? '600' : '400',
                fontSize: 14 
              }}>
                📁 Todas las categorías
              </Text>
            </TouchableOpacity>

            {categories.map((category) => (
              <TouchableOpacity
                key={category._id}
                style={{
                  backgroundColor: selectedCategory === category._id ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  marginRight: 10,
                  borderWidth: selectedCategory === category._id ? 2 : 1,
                  borderColor: 'rgba(255,255,255,0.3)',
                }}
                onPress={() => setSelectedCategory(category._id)}
              >
                <Text style={{ 
                  color: 'white', 
                  fontWeight: selectedCategory === category._id ? '600' : '400',
                  fontSize: 14 
                }}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Filtros de estado */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10, marginBottom: 5 }}>
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
                ⭕ Todas
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
                ✅ Activas
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
                ❌ Inactivas
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
          }}>Cargando subcategorías...</Text>
        </View>
      ) : (
        <FlatList
          data={getFilteredSubcategories()}
          keyExtractor={(item) => item._id}
          renderItem={renderSubcategoryCard}
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
                <Ionicons name="layers-outline" size={40} color={modernTheme.colors.neutral[400]} />
              </View>
              
              <Text style={{
                ...modernTheme.typography.heading.h3,
                color: modernTheme.colors.neutral[700],
                textAlign: 'center',
                marginBottom: modernTheme.spacing.sm,
              }}>
                No se encontraron subcategorías
              </Text>
              
              <Text style={{
                ...modernTheme.typography.body.medium,
                color: modernTheme.colors.neutral[500],
                textAlign: 'center',
                lineHeight: 20,
              }}>
                {searchQuery || selectedCategory || statusFilter !== 'all'
                  ? 'No hay subcategorías que coincidan con los filtros aplicados'
                  : 'Comienza agregando tu primera subcategoría'
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
              {editingSubcategory ? 'Editar Subcategoría' : 'Nueva Subcategoría'}
            </Text>
            <TouchableOpacity onPress={closeModal}>
              <Ionicons name="close" size={24} color={modernTheme.colors.neutral[600]} />
            </TouchableOpacity>
          </View>

          <ScrollView style={{ flex: 1, padding: modernTheme.spacing.lg }}>
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
                placeholder="Nombre de la subcategoría"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
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
                  {categories.map((category) => (
                    <Picker.Item 
                      key={category._id} 
                      label={category.name} 
                      value={category._id} 
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
                placeholder="Descripción de la subcategoría"
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
                multiline
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
                  Subcategoría activa
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
              title={editingSubcategory ? 'Actualizar Subcategoría' : 'Crear Subcategoría'}
              onPress={handleSave}
              disabled={isLoading}
              loading={isLoading}
            />
          </View>
        </SafeAreaView>
      </Modal>

      {/* Floating Action Button - NUEVO */}
      {hasPermission('subcategorias.crear') && (
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

export default SubcategoriasScreen;