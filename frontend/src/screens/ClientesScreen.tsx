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
import { ModernCard, ModernButton, ModernBadge } from '../components/ModernComponents';
import { modernTheme } from '../styles/modernTheme';

interface Cliente {
  _id: string;
  nombre: string;
  ciudad: string;
  direccion: string;
  telefono: string;
  correo: string;
  esCliente: boolean;
  createdAt: string;
  updatedAt: string;
}

const ClientesScreen: React.FC = () => {
  const { canEdit, canDelete } = useAuth();
  
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [clientTypeFilter, setClientTypeFilter] = useState('all');
  
  const [formData, setFormData] = useState({
    nombre: '',
    ciudad: '',
    direccion: '',
    telefono: '',
    correo: '',
    esCliente: true,
  });

  useEffect(() => {
    console.log('ClientesScreen montado, verificando autenticación...');
    console.log('canEdit:', canEdit());
    console.log('canDelete:', canDelete());
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      console.log('Iniciando carga de clientes...');
      console.log('URL completa que se va a llamar:', 'http://192.168.1.7:5000/api/clientes');
      
      const response = await apiService.get<Cliente[]>('/clientes');
      console.log('Respuesta del servidor:', response);
      
      if (response.success && response.data && Array.isArray(response.data)) {
        console.log(`Se cargaron ${response.data.length} clientes`);
        setClientes(response.data);
      } else {
        console.log('La respuesta no tiene el formato esperado:', response);
      }
    } catch (error: any) {
      console.error('Error completo:', error);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error config URL:', error.config?.url);
      Alert.alert('Error', 'No se pudieron cargar los clientes');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const getFilteredClientes = () => {
    return clientes.filter((cliente) => {
      // Filtro por búsqueda
      const matchesSearch = !searchQuery || 
        cliente.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cliente.correo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cliente.telefono.includes(searchQuery) ||
        cliente.ciudad.toLowerCase().includes(searchQuery.toLowerCase());

      // Filtro por tipo de cliente
      let matchesClientType = true;
      if (clientTypeFilter === 'clients') {
        matchesClientType = cliente.esCliente === true;
      } else if (clientTypeFilter === 'potentials') {
        matchesClientType = cliente.esCliente === false;
      }

      return matchesSearch && matchesClientType;
    });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadClientes();
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalVisible(true);
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      ciudad: '',
      direccion: '',
      telefono: '',
      correo: '',
      esCliente: true,
    });
    setEditingCliente(null);
  };

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente);
    setFormData({
      nombre: cliente.nombre,
      ciudad: cliente.ciudad,
      direccion: cliente.direccion,
      telefono: cliente.telefono,
      correo: cliente.correo,
      esCliente: cliente.esCliente,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Cambiar estado',
      '¿Estás seguro de que quieres cambiar el estado de este cliente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Cambiar',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              const response = await apiService.patch(`/clientes/${id}/toggle-status`);
              if (response.success) {
                await loadClientes();
                Alert.alert('Éxito', 'Estado del cliente cambiado correctamente');
              } else {
                Alert.alert('Error', response.message || 'No se pudo cambiar el estado del cliente');
              }
            } catch (error) {
              console.error('Error al cambiar estado:', error);
              Alert.alert('Error', 'No se pudo cambiar el estado del cliente');
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
    if (!formData.nombre || !formData.correo) {
      Alert.alert('Error', 'Nombre y correo son obligatorios');
      return;
    }

    setIsLoading(true);
    try {
      let response;
      if (editingCliente) {
        response = await apiService.put(`/clientes/${editingCliente._id}`, formData);
      } else {
        response = await apiService.post('/clientes', formData);
      }

      if (response.success) {
        await loadClientes();
        closeModal();
        Alert.alert('Éxito', `Cliente ${editingCliente ? 'actualizado' : 'creado'} correctamente`);
      } else {
        Alert.alert('Error', response.message || 'Error al guardar el cliente');
      }
    } catch (error) {
      console.error('Error al guardar:', error);
      Alert.alert('Error', 'No se pudo guardar el cliente');
    } finally {
      setIsLoading(false);
    }
  };

  const renderClienteCard = ({ item }: { item: Cliente }) => {
    return (
      <ModernCard style={{ marginBottom: modernTheme.spacing.md, padding: modernTheme.spacing.lg }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <Text style={{
              ...modernTheme.typography.heading.h4,
              color: modernTheme.colors.neutral[800],
              marginBottom: modernTheme.spacing.xs,
            }}>
              {item.nombre}
            </Text>
            
            {item.correo && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: modernTheme.spacing.xs }}>
                <Ionicons name="mail" size={14} color={modernTheme.colors.neutral[500]} />
                <Text style={{
                  ...modernTheme.typography.body.small,
                  color: modernTheme.colors.neutral[600],
                  marginLeft: modernTheme.spacing.xs,
                }}>
                  {item.correo}
                </Text>
              </View>
            )}

            {item.telefono && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: modernTheme.spacing.xs }}>
                <Ionicons name="call" size={14} color={modernTheme.colors.neutral[500]} />
                <Text style={{
                  ...modernTheme.typography.body.small,
                  color: modernTheme.colors.neutral[600],
                  marginLeft: modernTheme.spacing.xs,
                }}>
                  {item.telefono}
                </Text>
              </View>
            )}

            {item.ciudad && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: modernTheme.spacing.xs }}>
                <Ionicons name="location" size={14} color={modernTheme.colors.neutral[500]} />
                <Text style={{
                  ...modernTheme.typography.body.small,
                  color: modernTheme.colors.neutral[600],
                  marginLeft: modernTheme.spacing.xs,
                }}>
                  {item.ciudad}
                </Text>
              </View>
            )}

            <Text style={{
              ...modernTheme.typography.body.small,
              color: modernTheme.colors.neutral[500],
              marginTop: modernTheme.spacing.xs,
            }}>
              Registrado: {formatearFecha(item.createdAt)}
            </Text>
          </View>

          <View style={{ alignItems: 'flex-end' }}>
            <ModernBadge
              text={item.esCliente ? 'Cliente' : 'Potencial'}
              variant={item.esCliente ? 'success' : 'warning'}
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
            <Ionicons name="people" size={24} color="white" />
          </View>
          <Text style={{
            fontSize: 20,
            color: 'white',
            fontWeight: '700',
            flex: 1
          }}>
            Clientes
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
            }}>{getFilteredClientes().length}</Text>
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
            placeholder="Buscar clientes..."
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

        {/* Filtros horizontales por tipo de cliente */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 5 }}>
          <View style={{ flexDirection: 'row', paddingHorizontal: 5 }}>
            <TouchableOpacity
              style={{
                backgroundColor: clientTypeFilter === 'all' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                marginRight: 10,
                borderWidth: clientTypeFilter === 'all' ? 2 : 1,
                borderColor: 'rgba(255,255,255,0.3)',
              }}
              onPress={() => setClientTypeFilter('all')}
            >
              <Text style={{ 
                color: 'white', 
                fontWeight: clientTypeFilter === 'all' ? '600' : '400',
                fontSize: 14 
              }}>
                👥 Todos
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                backgroundColor: clientTypeFilter === 'clients' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                marginRight: 10,
                borderWidth: clientTypeFilter === 'clients' ? 2 : 1,
                borderColor: 'rgba(255,255,255,0.3)',
              }}
              onPress={() => setClientTypeFilter('clients')}
            >
              <Text style={{ 
                color: 'white', 
                fontWeight: clientTypeFilter === 'clients' ? '600' : '400',
                fontSize: 14 
              }}>
                ✅ Clientes
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: clientTypeFilter === 'potentials' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                marginRight: 10,
                borderWidth: clientTypeFilter === 'potentials' ? 2 : 1,
                borderColor: 'rgba(255,255,255,0.3)',
              }}
              onPress={() => setClientTypeFilter('potentials')}
            >
              <Text style={{ 
                color: 'white', 
                fontWeight: clientTypeFilter === 'potentials' ? '600' : '400',
                fontSize: 14 
              }}>
                🎯 Potenciales
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
          }}>Cargando clientes...</Text>
        </View>
      ) : (
        <FlatList
          data={getFilteredClientes()}
          keyExtractor={(item) => item._id}
          renderItem={renderClienteCard}
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
                <Ionicons name="people-outline" size={40} color={modernTheme.colors.neutral[400]} />
              </View>
              
              <Text style={{
                ...modernTheme.typography.heading.h3,
                color: modernTheme.colors.neutral[700],
                textAlign: 'center',
                marginBottom: modernTheme.spacing.sm,
              }}>
                No se encontraron clientes
              </Text>
              
              <Text style={{
                ...modernTheme.typography.body.medium,
                color: modernTheme.colors.neutral[500],
                textAlign: 'center',
                lineHeight: 20,
              }}>
                {searchQuery || clientTypeFilter !== 'all' 
                  ? 'No hay clientes que coincidan con los filtros aplicados'
                  : 'Comienza agregando tu primer cliente'
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
              {editingCliente ? 'Editar Cliente' : 'Nuevo Cliente'}
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
                placeholder="Nombre completo del cliente"
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
                placeholder="correo@ejemplo.com"
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
                placeholder="Número de teléfono"
                value={formData.telefono}
                onChangeText={(text) => setFormData({ ...formData, telefono: text })}
                keyboardType="phone-pad"
              />
            </View>

            {/* Ciudad */}
            <View style={{ marginBottom: modernTheme.spacing.lg }}>
              <Text style={{
                ...modernTheme.typography.body.medium,
                fontWeight: '600',
                color: modernTheme.colors.neutral[700],
                marginBottom: modernTheme.spacing.sm,
              }}>
                Ciudad
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: modernTheme.colors.neutral[300],
                  borderRadius: modernTheme.radius.md,
                  padding: modernTheme.spacing.md,
                  backgroundColor: modernTheme.colors.neutral.white,
                }}
                placeholder="Ciudad de residencia"
                value={formData.ciudad}
                onChangeText={(text) => setFormData({ ...formData, ciudad: text })}
              />
            </View>

            {/* Dirección */}
            <View style={{ marginBottom: modernTheme.spacing.lg }}>
              <Text style={{
                ...modernTheme.typography.body.medium,
                fontWeight: '600',
                color: modernTheme.colors.neutral[700],
                marginBottom: modernTheme.spacing.sm,
              }}>
                Dirección
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
                placeholder="Dirección completa"
                value={formData.direccion}
                onChangeText={(text) => setFormData({ ...formData, direccion: text })}
                multiline
              />
            </View>

            {/* Tipo de Cliente */}
            <View style={{ marginBottom: modernTheme.spacing.xl }}>
              <Text style={{
                ...modernTheme.typography.body.medium,
                fontWeight: '600',
                color: modernTheme.colors.neutral[700],
                marginBottom: modernTheme.spacing.sm,
              }}>
                Tipo de Cliente
              </Text>
              <TouchableOpacity 
                style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center',
                  paddingVertical: modernTheme.spacing.sm,
                }}
                onPress={() => setFormData({ ...formData, esCliente: !formData.esCliente })}
              >
                <View style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: formData.esCliente ? modernTheme.colors.success.main : modernTheme.colors.warning.main,
                  marginRight: modernTheme.spacing.sm,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Ionicons name="checkmark" size={12} color="white" />
                </View>
                <Text style={{
                  ...modernTheme.typography.body.medium,
                  color: modernTheme.colors.neutral[700],
                }}>
                  {formData.esCliente ? 'Cliente confirmado' : 'Cliente potencial'}
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
              title={editingCliente ? 'Actualizar Cliente' : 'Crear Cliente'}
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

export default ClientesScreen;