import React, { useState, useEffect, useRef } from 'react';
import {
  View,                  
  Text,                  
  ScrollView,            
  TouchableOpacity,      
  TextInput,            
  RefreshControl,        
  ActivityIndicator,
  Animated,
  Dimensions,     
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { apiService } from '../services/api';            
import { globalStyles } from '../styles'; 
import { modernTheme } from '../styles/modernTheme';
import { ModernCard, ModernBadge } from '../components/ModernComponents';

const screenHeight = Dimensions.get('window').height; 

interface Cliente {
  _id: string;
  nombre: string;
  correo: string;
}

interface Pedido {
  _id: string;
  numeroPedido: string;
  cliente: Cliente | string | null; // Puede venir null desde el backend
  productos: Array<{
    product: string;
    cantidad: number;
    precioUnitario: number;
  }>;
  fechaEntrega: string;
  observacion?: string;
  motivoDevolucion?: string;
  estado: 'agendado' | 'entregado' | 'cancelado' | 'devuelto';
  total: number;
  createdAt: string;
  updatedAt: string;
}

const estadoOptions = [
  { value: 'agendado', label: '📅 Agendado' },
  { value: 'entregado', label: '✅ Entregado' },
  { value: 'cancelado', label: '❌ Cancelado' },
  { value: 'devuelto', label: '↩️ Devuelto' },
];

const PedidosScreen: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);      
  const [clientes, setClientes] = useState<Cliente[]>([]);      
  const [isLoading, setIsLoading] = useState(true);                  
  const [isRefreshing, setIsRefreshing] = useState(false);           

  // Estados para búsqueda y filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('all'); // 'all' | 'agendado' | 'entregado' | 'cancelado' | 'devuelto'
  const [clienteFilter, setClienteFilter] = useState('');

  useEffect(() => {
    loadPedidos();
    loadClientes();
  }, []);

  const loadPedidos = async () => {
    try {
      const response = await apiService.get<Pedido[]>('/pedidos');
      
      if (response.success && response.data && Array.isArray(response.data)) {
        setPedidos(response.data);
      }
    } catch (error) {
      console.warn('Error cargando pedidos:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const loadClientes = async () => {
    try {
      const response = await apiService.get<Cliente[]>('/clientes');
      if (response.success && response.data && Array.isArray(response.data)) {
        setClientes(response.data);
      }
    } catch (error) {
      console.warn('Error cargando clientes:', error);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadPedidos();
  };

  // Función para filtrar pedidos
  const getFilteredPedidos = () => {
    return pedidos.filter(pedido => {
      // Manejar casos donde cliente puede ser null, string o un objeto sin nombre
      const clienteNombre = (
        pedido.cliente &&
        typeof pedido.cliente === 'object' &&
        'nombre' in pedido.cliente &&
        typeof (pedido.cliente as any).nombre === 'string'
      ) ? (pedido.cliente as any).nombre : '';
      const matchesSearch = searchQuery === '' || 
        clienteNombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pedido.estado.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pedido.numeroPedido?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pedido.observacion?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesEstado = estadoFilter === 'all' || pedido.estado === estadoFilter;
      
      const matchesCliente = clienteFilter === '' || 
        clienteNombre.toLowerCase().includes(clienteFilter.toLowerCase());

      return matchesSearch && matchesEstado && matchesCliente;
    });
  };

  // Función para obtener clientes únicos
  const getUniqueClientes = () => {
    const nombres = pedidos
      .map(pedido => (
        pedido.cliente &&
        typeof pedido.cliente === 'object' &&
        'nombre' in pedido.cliente &&
        typeof (pedido.cliente as any).nombre === 'string'
      ) ? (pedido.cliente as any).nombre : '')
      .filter(Boolean);
    return [...new Set(nombres)].sort();
  };

  const getEstadoLabel = (estado: string) => {
    const estadoOption = estadoOptions.find(option => option.value === estado);
    return estadoOption ? estadoOption.label : estado;
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'agendado':
        return '#ffc107';
      case 'entregado':
        return '#28a745';
      case 'cancelado':
        return '#dc3545';
      case 'devuelto':
        return '#fd7e14';
      default:
        return '#6c757d';
    }
  };

  const PedidoCard: React.FC<{ pedido: Pedido }> = ({ pedido }) => {
    const [fadeAnim] = useState(new Animated.Value(0));
    const [slideAnim] = useState(new Animated.Value(30));

    useEffect(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        })
      ]).start();
    }, []);

    const clienteNombre = (
      pedido.cliente &&
      typeof pedido.cliente === 'object' &&
      'nombre' in pedido.cliente &&
      typeof (pedido.cliente as any).nombre === 'string'
    ) ? (pedido.cliente as any).nombre : 'Cliente no disponible';
    
    return (
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          marginBottom: modernTheme.spacing.md,
        }}
      >
        <ModernCard variant="default">
          <View style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
          }}>
            {/* Avatar del pedido */}
            <View style={{
              width: 64,
              height: 64,
              backgroundColor: getEstadoColor(pedido.estado) + '20',
              borderRadius: modernTheme.radius.full,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: modernTheme.spacing.md,
            }}>
              <Ionicons 
                name="basket" 
                size={28} 
                color={getEstadoColor(pedido.estado)} 
              />
            </View>

            {/* Contenido principal */}
            <View style={{ flex: 1 }}>
              {/* Header con cliente y estado */}
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: modernTheme.spacing.sm,
              }}>
                <Text style={[
                  modernTheme.typography.heading.h4,
                  {
                    color: modernTheme.colors.neutral[800],
                    flex: 1,
                    marginRight: modernTheme.spacing.sm,
                  }
                ]}>
                  {clienteNombre}
                </Text>

                <ModernBadge
                  text={getEstadoLabel(pedido.estado)}
                  variant={
                    pedido.estado === 'entregado' ? 'success' :
                    pedido.estado === 'agendado' ? 'warning' :
                    pedido.estado === 'cancelado' ? 'danger' :
                    pedido.estado === 'devuelto' ? 'neutral' : 'neutral'
                  }
                  size="sm"
                />
              </View>

              {/* Información del pedido */}
              <View style={{ marginBottom: modernTheme.spacing.sm }}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: modernTheme.spacing.xs,
                }}>
                  <Ionicons 
                    name="receipt" 
                    size={16} 
                    color={modernTheme.colors.neutral[500]} 
                    style={{ marginRight: modernTheme.spacing.xs }}
                  />
                  <Text style={[
                    modernTheme.typography.body.medium,
                    { 
                      color: modernTheme.colors.neutral[700],
                      fontWeight: '600'
                    }
                  ]}>
                    {pedido.numeroPedido}
                  </Text>
                </View>

                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: modernTheme.spacing.xs,
                }}>
                  <Ionicons 
                    name="cash" 
                    size={16} 
                    color={modernTheme.colors.success.main} 
                    style={{ marginRight: modernTheme.spacing.xs }}
                  />
                  <Text style={[
                    modernTheme.typography.body.medium,
                    { 
                      color: modernTheme.colors.success.main,
                      fontWeight: '600'
                    }
                  ]}>
                    ${(pedido.total || 0).toLocaleString('es-CO')}
                  </Text>
                </View>

                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: modernTheme.spacing.xs,
                }}>
                  <Ionicons 
                    name="calendar" 
                    size={16} 
                    color={modernTheme.colors.neutral[500]} 
                    style={{ marginRight: modernTheme.spacing.xs }}
                  />
                  <Text style={[
                    modernTheme.typography.body.small,
                    { color: modernTheme.colors.neutral[600] }
                  ]}>
                    Entrega: {new Date(pedido.fechaEntrega).toLocaleDateString()}
                  </Text>
                </View>

                {pedido.observacion && (
                  <View style={{
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    marginTop: modernTheme.spacing.xs,
                  }}>
                    <Ionicons 
                      name="document-text" 
                      size={16} 
                      color={modernTheme.colors.neutral[500]} 
                      style={{ marginRight: modernTheme.spacing.xs, marginTop: 2 }}
                    />
                    <Text style={[
                      modernTheme.typography.body.small,
                      { 
                        color: modernTheme.colors.neutral[600],
                        flex: 1,
                        fontStyle: 'italic'
                      }
                    ]}>
                      {pedido.observacion}
                    </Text>
                  </View>
                )}
              </View>

              {/* Fecha de creación */}
              <Text style={[
                modernTheme.typography.body.small,
                { 
                  color: modernTheme.colors.neutral[500],
                  fontSize: 12,
                }
              ]}>
                Creado: {new Date(pedido.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>

          {/* Divider */}
          <View style={{
            height: 1,
            backgroundColor: modernTheme.colors.neutral[200],
            marginVertical: modernTheme.spacing.md,
          }} />

        </ModernCard>
      </Animated.View>
    );
  };

  if (isLoading && !isRefreshing) {
    return (
      <View style={globalStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#4ECDC4" />
        <Text style={globalStyles.loadingText}>Cargando pedidos...</Text>
      </View>
    );
  }

  const filteredPedidos = getFilteredPedidos();
  const uniqueClientes = getUniqueClientes();

  return (
    <View style={[globalStyles.container, { flex: 1, position: 'relative' }]}>
      {/* Header Glassmorphism */}
      <View style={{
        backgroundColor: '#007BFF', // Azul del tema
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
            <Ionicons name="basket" size={24} color="white" />
          </View>
          <Text style={[
            { fontSize: 20, color: 'white', fontWeight: '700', flex: 1 }
          ]}>
            Pedidos
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
            }}>{filteredPedidos.length}</Text>
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
            placeholder="Buscar pedidos, clientes..."
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
                📋 Todos
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={{
                backgroundColor: estadoFilter === 'agendado' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                marginRight: 10,
                borderWidth: estadoFilter === 'agendado' ? 2 : 1,
                borderColor: 'rgba(255,255,255,0.3)',
              }}
              onPress={() => setEstadoFilter('agendado')}
            >
              <Text style={{ 
                color: 'white', 
                fontWeight: estadoFilter === 'agendado' ? '600' : '400',
                fontSize: 14 
              }}>
                📅 Agendado
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: estadoFilter === 'entregado' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                marginRight: 10,
                borderWidth: estadoFilter === 'entregado' ? 2 : 1,
                borderColor: 'rgba(255,255,255,0.3)',
              }}
              onPress={() => setEstadoFilter('entregado')}
            >
              <Text style={{ 
                color: 'white', 
                fontWeight: estadoFilter === 'entregado' ? '600' : '400',
                fontSize: 14 
              }}>
                ✅ Entregado
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: estadoFilter === 'cancelado' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                marginRight: 10,
                borderWidth: estadoFilter === 'cancelado' ? 2 : 1,
                borderColor: 'rgba(255,255,255,0.3)',
              }}
              onPress={() => setEstadoFilter('cancelado')}
            >
              <Text style={{ 
                color: 'white', 
                fontWeight: estadoFilter === 'cancelado' ? '600' : '400',
                fontSize: 14 
              }}>
                ❌ Cancelado
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: estadoFilter === 'devuelto' ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                marginRight: 10,
                borderWidth: estadoFilter === 'devuelto' ? 2 : 1,
                borderColor: 'rgba(255,255,255,0.3)',
              }}
              onPress={() => setEstadoFilter('devuelto')}
            >
              <Text style={{ 
                color: 'white', 
                fontWeight: estadoFilter === 'devuelto' ? '600' : '400',
                fontSize: 14 
              }}>
                🔄 Devuelto
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      
      {/* Lista principal */}
      <ScrollView
        style={{ flex: 1, backgroundColor: modernTheme.colors.neutral[50] }}
        contentContainerStyle={{
          paddingHorizontal: modernTheme.spacing.lg,
          paddingVertical: modernTheme.spacing.md,
          flexGrow: 1,
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[modernTheme.colors.primary.main]}
            tintColor={modernTheme.colors.primary.main}
          />
        }
      >
        {/* Lista de pedidos */}
        {pedidos.length === 0 ? (
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
              backgroundColor: modernTheme.colors.primary.light,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: modernTheme.spacing.lg,
            }}>
              <Ionicons name="basket-outline" size={36} color={modernTheme.colors.primary.main} />
            </View>
            <Text style={{
              ...modernTheme.typography.heading.h3,
              color: modernTheme.colors.neutral[700],
              marginBottom: modernTheme.spacing.sm,
              textAlign: 'center',
            }}>No hay pedidos</Text>
            <Text style={{
              ...modernTheme.typography.body.medium,
              color: modernTheme.colors.neutral[500],
              textAlign: 'center',
              lineHeight: 24,
            }}>
              No se han creado pedidos aún
            </Text>
          </View>
        ) : filteredPedidos.length === 0 ? (
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
              backgroundColor: modernTheme.colors.warning.light,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: modernTheme.spacing.lg,
            }}>
              <Ionicons name="search-outline" size={36} color={modernTheme.colors.warning.main} />
            </View>
            <Text style={{
              ...modernTheme.typography.heading.h3,
              color: modernTheme.colors.neutral[700],
              marginBottom: modernTheme.spacing.sm,
              textAlign: 'center',
            }}>Sin resultados</Text>
            <Text style={{
              ...modernTheme.typography.body.medium,
              color: modernTheme.colors.neutral[500],
              textAlign: 'center',
              lineHeight: 24,
            }}>
              No se encontraron pedidos que coincidan con los filtros aplicados
            </Text>
          </View>
        ) : (
          filteredPedidos.map((pedido) => (
            <PedidoCard key={pedido._id} pedido={pedido} />
          ))
        )}
      </ScrollView>

    </View>
  );
};

export default PedidosScreen;
