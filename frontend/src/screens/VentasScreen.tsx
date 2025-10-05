import React, { useState, useEffect } from 'react';
import {
  View,                  
  Text,                  
  ScrollView,            
  TouchableOpacity,      
  TextInput,            
  RefreshControl,        
  ActivityIndicator,     
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { apiService } from '../services/api';            
import { globalStyles, componentStyles } from '../styles'; 
import { ModernCard, ModernBadge } from '../components/ModernComponents';
import { modernTheme } from '../styles/modernTheme';
import { colors } from '../styles/colors'; 

interface Cliente {
  _id: string;
  nombre: string;
  correo: string;
  esCliente?: boolean;
}

interface Pedido {
  _id: string;
  numeroPedido: string;
  cliente: Cliente | string | null;
  productos: Array<{
    producto: any;
    cantidad: number;
    precioUnitario: number;
  }>;
  total: number;
  fechaEntrega?: string;
  fecha?: string;
  metodoPago?: 'efectivo' | 'tarjeta' | 'transferencia' | 'credito';
  estado: 'agendado' | 'despachado' | 'entregado' | 'cancelado' | 'devuelto';
  montoTotal?: number;
  descuento?: number;
  observaciones?: string;
  createdAt: string;
  updatedAt: string;
}

const metodoPagoOptions = [
  { value: 'efectivo', label: '💵 Efectivo' },
  { value: 'tarjeta', label: '💳 Tarjeta' },
  { value: 'transferencia', label: '🏦 Transferencia' },
  { value: 'credito', label: '📝 Crédito' },
];

const estadoOptions = [
  { value: 'pendiente', label: '⏳ Pendiente' },
  { value: 'completada', label: '✅ Completada' },
  { value: 'completado', label: '✅ Completada' },
  { value: 'anulada', label: '❌ Anulada' },
];

const VentasScreen: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);      
  const [clientes, setClientes] = useState<Cliente[]>([]);      
  const [filteredPedidos, setFilteredPedidos] = useState<Pedido[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);                  
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadPedidos();
    loadClientes();
  }, []);

  useEffect(() => {
    filterPedidos();
  }, [pedidos, searchQuery]);

  const filterPedidos = () => {
    let filtered = [...pedidos];

    if (searchQuery && searchQuery.trim()) {
      filtered = filtered.filter(pedido => {
        const clienteNombre = (pedido.cliente && typeof pedido.cliente === 'object') ? pedido.cliente.nombre : 
                              (typeof pedido.cliente === 'string' ? pedido.cliente : 'Cliente no encontrado');
        return clienteNombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
               pedido.observaciones?.toLowerCase().includes(searchQuery.toLowerCase()) ||
               pedido.numeroPedido?.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    setFilteredPedidos(filtered);
  };

  const loadPedidos = async () => {
    try {
      const response = await apiService.get<Pedido[]>('/pedidos');
      
      if (response.success && response.data && Array.isArray(response.data)) {
        // SOLO mostrar pedidos entregados
        const pedidosEntregados = response.data.filter(pedido => 
          pedido.estado === 'entregado'
        );
        setPedidos(pedidosEntregados);
        setFilteredPedidos(pedidosEntregados);
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
        setClientes(response.data.filter(c => c.esCliente !== false));
      }
    } catch (error) {
      console.warn('Error cargando clientes:', error);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadPedidos();
  };

  const getEstadoLabel = (estado: string) => {
    const estadoOption = estadoOptions.find(option => option.value === estado);
    return estadoOption ? estadoOption.label : estado;
  };

  const getMetodoPagoLabel = (metodoPago?: string) => {
    if (!metodoPago) return 'Sin método de pago';
    const metodoOption = metodoPagoOptions.find(option => option.value === metodoPago);
    return metodoOption ? metodoOption.label : metodoPago;
  };

  const PedidoCard: React.FC<{ pedido: Pedido }> = ({ pedido }) => {
    const clienteNombre = (pedido.cliente && typeof pedido.cliente === 'object') ? pedido.cliente.nombre : 
                          (typeof pedido.cliente === 'string' ? pedido.cliente : 'Cliente no encontrado');
    const montoFinal = (pedido.total || pedido.montoTotal || 0) - (pedido.descuento || 0);
    const fechaEntrega = pedido.fechaEntrega || pedido.fecha || pedido.createdAt;
    
    return (
      <ModernCard style={{ margin: 16, marginBottom: 12 }} variant="glass">
        <View style={{ padding: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            {/* Información principal */}
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <View style={{
                  backgroundColor: modernTheme.colors.success[100],
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}>
                  <Text style={{ fontSize: 18 }}>📦</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '700',
                    color: modernTheme.colors.neutral[800],
                    marginBottom: 4,
                  }}>
                    {clienteNombre}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
                    <ModernBadge 
                      text={getEstadoLabel(pedido.estado)} 
                      variant="success"
                    />
                    <View style={{ marginLeft: 8 }}>
                      <ModernBadge 
                        text={`� ${pedido.numeroPedido}`} 
                        variant="info"
                      />
                    </View>
                  </View>
                </View>
              </View>

              <View style={{ marginLeft: 52 }}>
                <Text style={{
                  fontSize: 18,
                  fontWeight: '700',
                  color: modernTheme.colors.success[600],
                  marginBottom: 8,
                }}>
                  💰 ${(montoFinal || 0).toLocaleString('es-CO')}
                  {pedido.descuento && pedido.descuento > 0 && (
                    <Text style={{ fontSize: 14, color: modernTheme.colors.danger[600] }}>
                      {' '}(Desc: ${(pedido.descuento || 0).toLocaleString('es-CO')})
                    </Text>
                  )}
                </Text>
                
                <Text style={{
                  fontSize: 14,
                  color: modernTheme.colors.neutral[600],
                  marginBottom: 4,
                }}>
                  {getMetodoPagoLabel(pedido.metodoPago)}
                </Text>
                
                <Text style={{
                  fontSize: 14,
                  color: modernTheme.colors.neutral[600],
                  marginBottom: 4,
                }}>
                  📅 {new Date(fechaEntrega).toLocaleDateString()}
                </Text>
                
                {pedido.productos && Array.isArray(pedido.productos) && (
                  <Text style={{
                    fontSize: 14,
                    color: modernTheme.colors.neutral[600],
                    marginBottom: 4,
                  }}>
                    📦 {pedido.productos.length} producto{pedido.productos.length !== 1 ? 's' : ''}
                  </Text>
                )}
                
                {pedido.observaciones && (
                  <Text style={{
                    fontSize: 14,
                    color: modernTheme.colors.neutral[600],
                    marginBottom: 4,
                  }}>
                    📝 {pedido.observaciones}
                  </Text>
                )}
                
                <Text style={{
                  fontSize: 12,
                  color: modernTheme.colors.neutral[400],
                  marginTop: 8,
                }}>
                  Creado: {new Date(pedido.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ModernCard>
    );
  };

  if (isLoading && !isRefreshing) {
    return (
      <View style={globalStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#4ECDC4" />
        <Text style={globalStyles.loadingText}>Cargando pedidos entregados...</Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      {/* Header Moderno */}
      <View style={{
        backgroundColor: modernTheme.colors.primary[600],
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
            <Ionicons name="checkmark-circle" size={24} color="white" />
          </View>
          <Text style={[
            { fontSize: 20, color: 'white', fontWeight: '700', flex: 1 }
          ]}>
            Ventas
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
          marginBottom: 5,
        }}>
          <Ionicons name="search" size={20} color="rgba(255,255,255,0.8)" style={{ marginRight: 10 }} />
          <TextInput
            style={{ flex: 1, color: 'white', fontSize: 16 }}
            placeholder="Buscar por cliente o número de pedido..."
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      
      <ScrollView
        style={globalStyles.screenContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[modernTheme.colors.primary[500]]}
          />
        }
      >
        {filteredPedidos.length === 0 ? (
          <View style={globalStyles.emptyStateContainer}>
            <Text style={globalStyles.titleText}>�</Text>
            <Text style={globalStyles.emptyStateText}>
              {searchQuery ? 'No hay pedidos entregados que coincidan con la búsqueda' : 'No hay pedidos entregados'}
            </Text>
            <Text style={globalStyles.emptyStateSubtext}>
              Aquí aparecerán los pedidos cuando cambien a estado "entregado"
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

export default VentasScreen;