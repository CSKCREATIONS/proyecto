import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  FlatList,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { apiService } from '../services/api';
import { globalStyles } from '../styles';
import { ModernCard, ModernBadge } from '../components/ModernComponents';
import { modernTheme } from '../styles/modernTheme';

interface Proveedor {
  _id: string;
  nombre: string;
  correo: string;
  activo?: boolean;
}

interface Compra {
  _id: string;
  proveedor: Proveedor | string;
  numeroCompra: string;
  fechaCompra: string;
  fechaEntrega?: string;
  estado: 'pendiente' | 'confirmada' | 'recibida' | 'cancelada';
  montoTotal: number;
  observaciones?: string;
  createdAt?: string;
  updatedAt?: string;
}

const estadoOptions = [
  { value: 'pendiente', label: '⏳ Pendiente' },
  { value: 'confirmada', label: '✅ Confirmada' },
  { value: 'recibida', label: '📦 Recibida' },
  { value: 'cancelada', label: '❌ Cancelada' },
];

const ComprasScreen: React.FC = () => {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Estados para búsqueda y filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('all');
  const [proveedorFilter, setProveedorFilter] = useState('');

  useEffect(() => {
    loadCompras();
    loadProveedores();
  }, []);

  const loadCompras = async () => {
    try {
      const response = await apiService.get<Compra[]>('/compras');
      
      if (response.success && response.data && Array.isArray(response.data)) {
        setCompras(response.data);
      }
    } catch (error) {
      console.warn('Error cargando compras:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const loadProveedores = async () => {
    try {
      const response = await apiService.get<Proveedor[]>('/proveedores');
      if (response.success && response.data && Array.isArray(response.data)) {
        setProveedores(response.data);
      }
    } catch (error) {
      console.warn('Error cargando proveedores:', error);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadCompras();
  };

  // Función para filtrar compras
  const getFilteredCompras = () => {
    return compras.filter((compra) => {
      // Filtro por búsqueda
      const matchesSearch = !searchQuery || 
        compra.numeroCompra.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (typeof compra.proveedor === 'object' && compra.proveedor.nombre.toLowerCase().includes(searchQuery.toLowerCase()));

      // Filtro por estado
      const matchesEstado = estadoFilter === 'all' || compra.estado === estadoFilter;

      // Filtro por proveedor
      const matchesProveedor = !proveedorFilter || 
        (typeof compra.proveedor === 'object' ? compra.proveedor._id === proveedorFilter : compra.proveedor === proveedorFilter);

      return matchesSearch && matchesEstado && matchesProveedor;
    });
  };

  const formatearFecha = (fecha: string) => {
    if (!fecha) return 'No especificada';
    const date = new Date(fecha);
    if (isNaN(date.getTime())) return 'Fecha inválida';
    
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getEstadoLabel = (estado: string) => {
    const estadoOption = estadoOptions.find(option => option.value === estado);
    return estadoOption ? estadoOption.label : estado;
  };

  if (isLoading && !isRefreshing) {
    return (
      <View style={[globalStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={modernTheme.colors.primary.main} />
        <Text style={{
          marginTop: modernTheme.spacing.md,
          color: modernTheme.colors.neutral[600],
          ...modernTheme.typography.body.medium
        }}>Cargando compras...</Text>
      </View>
    );
  }

  const filteredCompras = getFilteredCompras();

  return (
    <View style={[globalStyles.container, { flex: 1 }]}>
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
            <Ionicons name="basket" size={24} color="white" />
          </View>
          <Text style={{
            fontSize: 20,
            color: 'white',
            fontWeight: '700',
            flex: 1
          }}>
            Compras
          </Text>
          <View style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <Ionicons name="receipt" size={14} color="white" />
            <Text style={{
              fontSize: 12,
              fontWeight: '600',
              color: 'white',
              marginLeft: 4,
            }}>{filteredCompras.length}</Text>
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
            placeholder="Buscar compras..."
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

        {/* Filtros por estado */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 5 }}>
          <View style={{ flexDirection: 'row', paddingHorizontal: 5 }}>
            <TouchableOpacity
              style={{
                backgroundColor: estadoFilter === 'all' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                marginRight: 10,
                borderWidth: estadoFilter === 'all' ? 2 : 1,
                borderColor: 'rgba(255,255,255,0.3)',
              }}
              onPress={() => setEstadoFilter('all')}
            >
              <Text style={{ 
                color: 'white', 
                fontWeight: estadoFilter === 'all' ? '600' : '400',
                fontSize: 14 
              }}>
                📋 Todas
              </Text>
            </TouchableOpacity>

            {estadoOptions.map((estado) => (
              <TouchableOpacity
                key={estado.value}
                style={{
                  backgroundColor: estadoFilter === estado.value ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  marginRight: 10,
                  borderWidth: estadoFilter === estado.value ? 2 : 1,
                  borderColor: 'rgba(255,255,255,0.3)',
                }}
                onPress={() => setEstadoFilter(estado.value)}
              >
                <Text style={{ 
                  color: 'white', 
                  fontWeight: estadoFilter === estado.value ? '600' : '400',
                  fontSize: 14 
                }}>
                  {estado.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Filtros por proveedor */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10, marginBottom: 5 }}>
          <View style={{ flexDirection: 'row', paddingHorizontal: 5 }}>
            <TouchableOpacity
              style={{
                backgroundColor: !proveedorFilter ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 15,
                marginRight: 8,
                borderWidth: !proveedorFilter ? 1.5 : 1,
                borderColor: 'rgba(255,255,255,0.4)',
              }}
              onPress={() => setProveedorFilter('')}
            >
              <Text style={{ 
                color: 'white', 
                fontWeight: !proveedorFilter ? '600' : '400',
                fontSize: 12 
              }}>
                🏢 Todos los proveedores
              </Text>
            </TouchableOpacity>
            
            {proveedores.map((proveedor) => (
              <TouchableOpacity
                key={proveedor._id}
                style={{
                  backgroundColor: proveedorFilter === proveedor._id ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255,255,255,0.1)',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 15,
                  marginRight: 8,
                  borderWidth: proveedorFilter === proveedor._id ? 1.5 : 1,
                  borderColor: proveedorFilter === proveedor._id ? 'rgba(34, 197, 94, 0.6)' : 'rgba(255,255,255,0.4)',
                }}
                onPress={() => setProveedorFilter(proveedor._id)}
              >
                <Text style={{ 
                  color: 'white', 
                  fontWeight: proveedorFilter === proveedor._id ? '600' : '400',
                  fontSize: 12 
                }}>
                  {proveedor.nombre}
                </Text>
              </TouchableOpacity>
            ))}
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
          }}>Cargando compras...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredCompras}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <ModernCard style={{ 
              marginBottom: modernTheme.spacing.md, 
              padding: modernTheme.spacing.lg,
              marginHorizontal: modernTheme.spacing.lg 
            }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: modernTheme.spacing.xs }}>
                    <Ionicons name="receipt-outline" size={16} color="#007BFF" />
                    <Text style={{
                      ...modernTheme.typography.heading.h4,
                      color: modernTheme.colors.neutral[800],
                      marginLeft: modernTheme.spacing.xs,
                      fontWeight: '700'
                    }}>
                      {item.numeroCompra}
                    </Text>
                  </View>
                  
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: modernTheme.spacing.sm }}>
                    <Ionicons name="business" size={14} color="#28a745" />
                    <Text style={{
                      ...modernTheme.typography.body.medium,
                      color: "#28a745",
                      marginLeft: modernTheme.spacing.xs,
                      fontWeight: '600'
                    }}>
                      {typeof item.proveedor === 'object' ? item.proveedor.nombre : 'Proveedor no encontrado'}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: modernTheme.spacing.xs }}>
                    <Ionicons name="calendar" size={14} color={modernTheme.colors.neutral[500]} />
                    <Text style={{
                      ...modernTheme.typography.body.small,
                      color: modernTheme.colors.neutral[600],
                      marginLeft: modernTheme.spacing.xs,
                    }}>
                      Compra: {formatearFecha(item.fechaCompra)}
                    </Text>
                  </View>

                  {item.fechaEntrega && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: modernTheme.spacing.xs }}>
                      <Ionicons name="car" size={14} color={modernTheme.colors.neutral[500]} />
                      <Text style={{
                        ...modernTheme.typography.body.small,
                        color: modernTheme.colors.neutral[600],
                        marginLeft: modernTheme.spacing.xs,
                      }}>
                        Entrega: {formatearFecha(item.fechaEntrega)}
                      </Text>
                    </View>
                  )}

                  {item.observaciones && (
                    <Text style={{
                      ...modernTheme.typography.body.small,
                      color: modernTheme.colors.neutral[500],
                      marginTop: modernTheme.spacing.xs,
                      fontStyle: 'italic'
                    }}>
                      {item.observaciones}
                    </Text>
                  )}
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                  <View style={{ 
                    backgroundColor: '#f8f9fa',
                    paddingHorizontal: modernTheme.spacing.md,
                    paddingVertical: modernTheme.spacing.sm,
                    borderRadius: modernTheme.radius.md,
                    marginBottom: modernTheme.spacing.sm
                  }}>
                    <Text style={{ 
                      ...modernTheme.typography.body.small,
                      color: modernTheme.colors.neutral[600],
                      textAlign: 'center'
                    }}>
                      Total
                    </Text>
                    <Text style={{ 
                      fontSize: 18,
                      fontWeight: '700', 
                      color: '#28a745',
                      textAlign: 'center'
                    }}>
                      ${item.montoTotal?.toLocaleString() || '0.00'}
                    </Text>
                  </View>
                  
                  <ModernBadge 
                    text={getEstadoLabel(item.estado)}
                    variant={
                      item.estado === 'recibida' ? 'success' : 
                      item.estado === 'confirmada' ? 'info' :
                      item.estado === 'cancelada' ? 'danger' : 'warning'
                    }
                    size="sm"
                  />
                </View>
              </View>
            </ModernCard>
          )}
          style={{ flex: 1, marginTop: modernTheme.spacing.md }}
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
                <Ionicons name="basket-outline" size={40} color={modernTheme.colors.neutral[400]} />
              </View>
              
              <Text style={{
                ...modernTheme.typography.heading.h3,
                color: modernTheme.colors.neutral[700],
                textAlign: 'center',
                marginBottom: modernTheme.spacing.sm,
              }}>
                No se encontraron compras
              </Text>
              
              <Text style={{
                ...modernTheme.typography.body.medium,
                color: modernTheme.colors.neutral[500],
                textAlign: 'center',
                lineHeight: 20,
              }}>
                {searchQuery || estadoFilter !== 'all' || proveedorFilter
                  ? 'No hay compras que coincidan con los filtros aplicados'
                  : 'No hay compras registradas en el sistema'
                }
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default ComprasScreen;
