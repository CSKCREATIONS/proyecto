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
import { globalStyles } from '../styles'; 
import CrudActions from '../components/CrudActions';
import { ModernButton, ModernCard, ModernBadge } from '../components/ModernComponents';
import { modernTheme } from '../styles/modernTheme';

interface Proveedor {
  _id: string;
  nombre: string;
  contacto: {
    correo: string;
    telefono: string;
  };
  direccion: {
    calle: string;
    pais: string;
  };
  empresa?: string;
  activo: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const ProveedoresScreen: React.FC = () => {
  const { canEdit, canDelete } = useAuth(); 
  
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);      
  const [isLoading, setIsLoading] = useState(true);                  
  const [isRefreshing, setIsRefreshing] = useState(false);           
  const [isModalVisible, setIsModalVisible] = useState(false);      
  const [editingProveedor, setEditingProveedor] = useState<Proveedor | null>(null);

  // Estados para búsqueda y filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    telefono: '',
    calle: '',
    pais: '',
    empresa: '',
    activo: true,
  });  useEffect(() => {
    loadProveedores();
  }, []);

  const loadProveedores = async () => {
    try {
      const response = await apiService.get<Proveedor[]>('/proveedores');
      
      if (response.success && response.data && Array.isArray(response.data)) {
        setProveedores(response.data);
      }
    } catch (error) {
      console.warn('Error cargando proveedores:', error);
      Alert.alert('Error', 'No se pudieron cargar los proveedores');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const getFilteredProveedores = () => {
    return proveedores.filter((proveedor) => {
      // Filtro por búsqueda
      const matchesSearch = !searchQuery || 
        proveedor.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proveedor.contacto.correo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proveedor.contacto.telefono.includes(searchQuery) ||
        proveedor.empresa?.toLowerCase().includes(searchQuery.toLowerCase());

      // Filtro por estado
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'activo' && proveedor.activo) ||
        (statusFilter === 'inactivo' && !proveedor.activo);

      return matchesSearch && matchesStatus;
    });
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      correo: '',
      telefono: '',
      calle: '',
      pais: '',
      empresa: '',
      activo: true,
    });
    setEditingProveedor(null);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadProveedores();
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalVisible(true);
  };

  const handleEdit = (proveedor: Proveedor) => {
    setEditingProveedor(proveedor);
    setFormData({
      nombre: proveedor.nombre,
      correo: proveedor.contacto.correo,
      telefono: proveedor.contacto.telefono,
      calle: proveedor.direccion.calle,
      pais: proveedor.direccion.pais,
      empresa: proveedor.empresa || '',
      activo: proveedor.activo,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Cambiar estado',
      '¿Estás seguro de que quieres cambiar el estado de este proveedor?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cambiar',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              const response = await apiService.patch(`/proveedores/${id}/toggle-status`);
              if (response.success) {
                await loadProveedores();
                Alert.alert('Éxito', 'Estado del proveedor cambiado correctamente');
              } else {
                Alert.alert('Error', response.message || 'No se pudo cambiar el estado del proveedor');
              }
            } catch (error) {
              console.error('Error al cambiar estado:', error);
              Alert.alert('Error', 'No se pudo cambiar el estado del proveedor');
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
    if (!formData.nombre.trim() || !formData.correo.trim()) {
      Alert.alert('Error', 'El nombre y correo son obligatorios');
      return;
    }

    setIsLoading(true);
    try {
      const proveedorData = {
        nombre: formData.nombre.trim(),
        contacto: {
          correo: formData.correo.trim(),
          telefono: formData.telefono.trim(),
        },
        direccion: {
          calle: formData.calle.trim(),
          pais: formData.pais.trim(),
        },
        empresa: formData.empresa.trim() || undefined,
        activo: formData.activo,
      };

      let response;
      if (editingProveedor) {
        response = await apiService.put(`/proveedores/${editingProveedor._id}`, proveedorData);
      } else {
        response = await apiService.post('/proveedores', proveedorData);
      }

      if (response.success) {
        await loadProveedores();
        closeModal();
        Alert.alert('Éxito', `Proveedor ${editingProveedor ? 'actualizado' : 'creado'} correctamente`);
      } else {
        Alert.alert('Error', response.message || 'Error al guardar el proveedor');
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      Alert.alert('Error', 'No se pudo guardar el proveedor');
    } finally {
      setIsLoading(false);
    }
  };

  const renderProveedorCard = ({ item }: { item: Proveedor }) => {
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
                {item.nombre}
              </Text>
              <ModernBadge
                text={item.activo ? 'Activo' : 'Inactivo'}
                variant={item.activo ? 'success' : 'warning'}
                size="sm"
              />
            </View>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: modernTheme.spacing.xs }}>
              <Ionicons name="mail" size={14} color={modernTheme.colors.primary.main} />
              <Text style={{
                ...modernTheme.typography.body.small,
                color: modernTheme.colors.primary.main,
                marginLeft: modernTheme.spacing.xs,
                flex: 1,
              }}>
                {item.contacto.correo}
              </Text>
            </View>

            {item.contacto.telefono && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: modernTheme.spacing.xs }}>
                <Ionicons name="call" size={14} color={modernTheme.colors.success.main} />
                <Text style={{
                  ...modernTheme.typography.body.small,
                  color: modernTheme.colors.neutral[600],
                  marginLeft: modernTheme.spacing.xs,
                }}>
                  {item.contacto.telefono}
                </Text>
              </View>
            )}

            {item.empresa && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: modernTheme.spacing.xs }}>
                <Ionicons name="business" size={14} color={modernTheme.colors.warning.main} />
                <Text style={{
                  ...modernTheme.typography.body.small,
                  color: modernTheme.colors.neutral[600],
                  marginLeft: modernTheme.spacing.xs,
                }}>
                  {item.empresa}
                </Text>
              </View>
            )}

            {item.direccion && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="location" size={14} color={modernTheme.colors.neutral[500]} />
                <Text style={{
                  ...modernTheme.typography.body.small,
                  color: modernTheme.colors.neutral[500],
                  marginLeft: modernTheme.spacing.xs,
                  flex: 1,
                }}>
                  {item.direccion.calle}, {item.direccion.pais}
                </Text>
              </View>
            )}
          </View>

          <View style={{ alignItems: 'flex-end', marginLeft: modernTheme.spacing.md }}>
            <CrudActions
              canEdit={canEdit()}
              canDelete={canDelete()}
              onEdit={() => handleEdit(item)}
              onDelete={() => handleDelete(item._id)}
            />
          </View>
        </View>
      </ModernCard>
    );
  };

  if (isLoading && !isRefreshing) {
    return (
      <View style={[globalStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={modernTheme.colors.primary.main} />
        <Text style={{
          marginTop: modernTheme.spacing.md,
          color: modernTheme.colors.neutral[600],
          ...modernTheme.typography.body.medium
        }}>Cargando proveedores...</Text>
      </View>
    );
  }

  const filteredProveedores = getFilteredProveedores();

  const renderEmptyState = () => (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: modernTheme.spacing.xl,
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
        <Ionicons name="business-outline" size={40} color={modernTheme.colors.neutral[400]} />
      </View>
      
      <Text style={{
        ...modernTheme.typography.heading.h3,
        color: modernTheme.colors.neutral[700],
        textAlign: 'center',
        marginBottom: modernTheme.spacing.sm,
      }}>
        No se encontraron proveedores
      </Text>
      
      <Text style={{
        ...modernTheme.typography.body.medium,
        color: modernTheme.colors.neutral[500],
        textAlign: 'center',
        lineHeight: 20,
      }}>
        {searchQuery || statusFilter !== 'all'
          ? 'No hay proveedores que coincidan con los filtros aplicados'
          : 'Comienza agregando tu primer proveedor'
        }
      </Text>
    </View>
  );

  const statusOptions = [
    { value: 'all', label: '👥 Todos' },
    { value: 'activo', label: '✅ Activos' },
    { value: 'inactivo', label: '⏸️ Inactivos' },
  ];

  return (
    <View style={[globalStyles.container, { flex: 1, position: 'relative' }]}>
      {/* Header Glassmorphism */}
      <View style={{
        backgroundColor: '#007BFF', // Azul consistente del tema
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        ...modernTheme.shadows.lg,
      }}>
        {/* Title Section */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
          <View style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            padding: 10,
            borderRadius: 12,
            marginRight: 12,
          }}>
            <Ionicons name="business" size={24} color="white" />
          </View>
          <Text style={[
            { fontSize: 20, color: 'white', fontWeight: '700', flex: 1 }
          ]}>
            Proveedores
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
            }}>{filteredProveedores.length}</Text>
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
            placeholder="Buscar por nombre, correo, teléfono..."
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

        {/* Filtros horizontales por estado */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 5 }}>
          <View style={{ flexDirection: 'row', paddingHorizontal: 5 }}>
            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={{
                  backgroundColor: statusFilter === option.value ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  marginRight: 10,
                  borderWidth: statusFilter === option.value ? 2 : 1,
                  borderColor: 'rgba(255,255,255,0.3)',
                }}
                onPress={() => setStatusFilter(option.value)}
              >
                <Text style={{ 
                  color: 'white', 
                  fontWeight: statusFilter === option.value ? '600' : '400',
                  fontSize: 14 
                }}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Content List */}
      {filteredProveedores.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={filteredProveedores}
          keyExtractor={(item) => item._id}
          renderItem={renderProveedorCard}
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
        />
      )}

      {/* Floating Action Button - POSICIÓN CORREGIDA */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 90, // Cambiado de 30 a 90
          right: 30,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: '#007BFF', // Color fijo en lugar de theme
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 8, // Sombra Android
          shadowColor: '#000', // Sombra iOS
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          zIndex: 1000,
        }}
        onPress={openCreateModal}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>

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
              {editingProveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}
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
                placeholder="Nombre del proveedor"
                value={formData.nombre}
                onChangeText={(text) => setFormData({ ...formData, nombre: text })}
              />
            </View>

            {/* Correo */}
            <View style={{ marginBottom: modernTheme.spacing.lg }}>
              <Text style={{
                ...modernTheme.typography.body.medium,
                fontWeight: '600',
                color: modernTheme.colors.neutral[700],
                marginBottom: modernTheme.spacing.sm,
              }}>
                Correo Electrónico *
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: modernTheme.colors.neutral[300],
                  borderRadius: modernTheme.radius.md,
                  padding: modernTheme.spacing.md,
                  backgroundColor: modernTheme.colors.neutral.white,
                }}
                placeholder="proveedor@ejemplo.com"
                value={formData.correo}
                onChangeText={(text) => setFormData({ ...formData, correo: text })}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Teléfono */}
            <View style={{ marginBottom: modernTheme.spacing.lg }}>
              <Text style={{
                ...modernTheme.typography.body.medium,
                fontWeight: '600',
                color: modernTheme.colors.neutral[700],
                marginBottom: modernTheme.spacing.sm,
              }}>
                Teléfono
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: modernTheme.colors.neutral[300],
                  borderRadius: modernTheme.radius.md,
                  padding: modernTheme.spacing.md,
                  backgroundColor: modernTheme.colors.neutral.white,
                }}
                placeholder="+57 300 000 0000"
                value={formData.telefono}
                onChangeText={(text) => setFormData({ ...formData, telefono: text })}
                keyboardType="phone-pad"
              />
            </View>

            {/* Empresa */}
            <View style={{ marginBottom: modernTheme.spacing.lg }}>
              <Text style={{
                ...modernTheme.typography.body.medium,
                fontWeight: '600',
                color: modernTheme.colors.neutral[700],
                marginBottom: modernTheme.spacing.sm,
              }}>
                Empresa
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: modernTheme.colors.neutral[300],
                  borderRadius: modernTheme.radius.md,
                  padding: modernTheme.spacing.md,
                  backgroundColor: modernTheme.colors.neutral.white,
                }}
                placeholder="Nombre de la empresa"
                value={formData.empresa}
                onChangeText={(text) => setFormData({ ...formData, empresa: text })}
              />
            </View>

            {/* Calle */}
            <View style={{ marginBottom: modernTheme.spacing.lg }}>
              <Text style={{
                ...modernTheme.typography.body.medium,
                fontWeight: '600',
                color: modernTheme.colors.neutral[700],
                marginBottom: modernTheme.spacing.sm,
              }}>
                Calle/Dirección
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: modernTheme.colors.neutral[300],
                  borderRadius: modernTheme.radius.md,
                  padding: modernTheme.spacing.md,
                  backgroundColor: modernTheme.colors.neutral.white,
                }}
                placeholder="Calle y número"
                value={formData.calle}
                onChangeText={(text) => setFormData({ ...formData, calle: text })}
              />
            </View>

            {/* País */}
            <View style={{ marginBottom: modernTheme.spacing.lg }}>
              <Text style={{
                ...modernTheme.typography.body.medium,
                fontWeight: '600',
                color: modernTheme.colors.neutral[700],
                marginBottom: modernTheme.spacing.sm,
              }}>
                País
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: modernTheme.colors.neutral[300],
                  borderRadius: modernTheme.radius.md,
                  padding: modernTheme.spacing.md,
                  backgroundColor: modernTheme.colors.neutral.white,
                }}
                placeholder="País del proveedor"
                value={formData.pais}
                onChangeText={(text) => setFormData({ ...formData, pais: text })}
              />
            </View>

            {/* Estado Activo */}
            <View style={{ marginBottom: modernTheme.spacing.xl }}>
              <TouchableOpacity 
                style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center',
                  paddingVertical: modernTheme.spacing.sm,
                }}
                onPress={() => setFormData({ ...formData, activo: !formData.activo })}
              >
                <View style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: formData.activo ? modernTheme.colors.success.main : modernTheme.colors.neutral[300],
                  marginRight: modernTheme.spacing.sm,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  {formData.activo && <Ionicons name="checkmark" size={12} color="white" />}
                </View>
                <Text style={{
                  ...modernTheme.typography.body.medium,
                  color: modernTheme.colors.neutral[700],
                }}>
                  Proveedor activo
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
              title={editingProveedor ? 'Actualizar Proveedor' : 'Crear Proveedor'}
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

export default ProveedoresScreen;