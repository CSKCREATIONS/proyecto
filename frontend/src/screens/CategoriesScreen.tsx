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
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/authContext';
import { apiService } from '../services/api';
import { Category } from '../services/index';
import { globalStyles } from '../styles';
import CrudActions from '../components/CrudActions';
import { ModernCard, ModernButton, ModernBadge } from '../components/ModernComponents';
import { modernTheme } from '../styles/modernTheme';

const CategoriasScreen: React.FC = () => {
  const { canEdit, canDelete } = useAuth();
  
  const [categorias, setCategorias] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategoria, setEditingCategoria] = useState<Category | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
  });

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      const response = await apiService.get<Category[]>('/categories');
      
      if (response.success && response.data && Array.isArray(response.data)) {
        setCategorias(response.data);
      }
    } catch (error) {
      console.warn('Error cargando categorías:', error);
      Alert.alert('Error', 'No se pudieron cargar las categorías');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const getFilteredCategorias = () => {
    return categorias.filter((categoria) => {
      const matchesSearch = !searchQuery || 
        categoria.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (categoria.description && categoria.description.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchesStatus = true;
      if (statusFilter === 'active') {
        matchesStatus = categoria.isActive === true;
      } else if (statusFilter === 'inactive') {
        matchesStatus = categoria.isActive === false;
      }

      return matchesSearch && matchesStatus;
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      isActive: true,
    });
    setEditingCategoria(null);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadCategorias();
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

  const handleEdit = (categoria: Category) => {
    setEditingCategoria(categoria);
    setFormData({
      name: categoria.name,
      description: categoria.description || '',
      isActive: categoria.isActive,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Cambiar estado',
      '¿Estás seguro de que quieres cambiar el estado de esta categoría?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cambiar',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              const response = await apiService.patch(`/categories/${id}/toggle-status`);
              if (response.success) {
                await loadCategorias();
                Alert.alert('Éxito', 'Estado de categoría cambiado correctamente');
              } else {
                Alert.alert('Error', response.message || 'No se pudo cambiar el estado de la categoría');
              }
            } catch (error) {
              console.error('Error al cambiar estado:', error);
              Alert.alert('Error', 'No se pudo cambiar el estado de la categoría');
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
    if (!formData.name.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }

    setIsLoading(true);
    try {
      const categoriaData = {
        ...formData,
        name: formData.name.trim(),
        description: formData.description.trim(),
      };

      let response;
      if (editingCategoria) {
        response = await apiService.put(`/categories/${editingCategoria._id}`, categoriaData);
      } else {
        response = await apiService.post('/categories', categoriaData);
      }

      if (response.success) {
        await loadCategorias();
        closeModal();
        Alert.alert('Éxito', `Categoría ${editingCategoria ? 'actualizada' : 'creada'} correctamente`);
      } else {
        Alert.alert('Error', response.message || 'Error al guardar la categoría');
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      Alert.alert('Error', 'No se pudo guardar la categoría');
    } finally {
      setIsLoading(false);
    }
  };

  const renderCategoriaCard = ({ item }: { item: Category }) => {
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
                canEdit={canEdit()}
                canDelete={canDelete()}
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
            <Ionicons name="grid" size={24} color="white" />
          </View>
          <Text style={{
            fontSize: 20,
            color: 'white',
            fontWeight: '700',
            flex: 1
          }}>
            Categorías
          </Text>
          <View style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: 10,
          }}>
            <Ionicons name="list" size={14} color="white" />
            <Text style={{
              fontSize: 12,
              fontWeight: '600',
              color: 'white',
              marginLeft: 4,
            }}>{getFilteredCategorias().length}</Text>
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
            placeholder="Buscar categorías..."
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
            <TouchableOpacity
              style={{
                backgroundColor: statusFilter === 'all' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                marginRight: 10,
                borderWidth: statusFilter === 'all' ? 2 : 1,
                borderColor: 'rgba(255,255,255,0.3)',
              }}
              onPress={() => setStatusFilter('all')}
            >
              <Text style={{ 
                color: 'white', 
                fontWeight: statusFilter === 'all' ? '600' : '400',
                fontSize: 14 
              }}>
                📁 Todas
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                backgroundColor: statusFilter === 'active' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                marginRight: 10,
                borderWidth: statusFilter === 'active' ? 2 : 1,
                borderColor: 'rgba(255,255,255,0.3)',
              }}
              onPress={() => setStatusFilter('active')}
            >
              <Text style={{ 
                color: 'white', 
                fontWeight: statusFilter === 'active' ? '600' : '400',
                fontSize: 14 
              }}>
                ✅ Activas
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: statusFilter === 'inactive' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                marginRight: 10,
                borderWidth: statusFilter === 'inactive' ? 2 : 1,
                borderColor: 'rgba(255,255,255,0.3)',
              }}
              onPress={() => setStatusFilter('inactive')}
            >
              <Text style={{ 
                color: 'white', 
                fontWeight: statusFilter === 'inactive' ? '600' : '400',
                fontSize: 14 
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
          }}>Cargando categorías...</Text>
        </View>
      ) : (
        <FlatList
          data={getFilteredCategorias()}
          keyExtractor={(item) => item._id}
          renderItem={renderCategoriaCard}
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
                <Ionicons name="grid-outline" size={40} color={modernTheme.colors.neutral[400]} />
              </View>
              
              <Text style={{
                ...modernTheme.typography.heading.h3,
                color: modernTheme.colors.neutral[700],
                textAlign: 'center',
                marginBottom: modernTheme.spacing.sm,
              }}>
                No se encontraron categorías
              </Text>
              
              <Text style={{
                ...modernTheme.typography.body.medium,
                color: modernTheme.colors.neutral[500],
                textAlign: 'center',
                lineHeight: 20,
              }}>
                {searchQuery || statusFilter !== 'all' 
                  ? 'No hay categorías que coincidan con los filtros aplicados'
                  : 'Comienza agregando tu primera categoría'
                }
              </Text>
            </View>
          )}
        />
      )}

      {/* Floating Action Button - POSICIÓN CORREGIDA */}
      {canEdit() && ( // Restauramos la condición original
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: 90, // Cambiado de 30 a 90 para evitar oclusión
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
              {editingCategoria ? 'Editar Categoría' : 'Nueva Categoría'}
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
                placeholder="Nombre de la categoría"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />
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
                placeholder="Descripción de la categoría"
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
                  Categoría activa
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
              title={editingCategoria ? 'Actualizar Categoría' : 'Crear Categoría'}
              onPress={handleSave}
              disabled={isLoading}
              loading={isLoading}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default CategoriasScreen;