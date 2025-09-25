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

interface Venta {
  _id: string;
  cliente: Cliente | string;
  productos: string[];
  fechaVenta: string;
  metodoPago: 'efectivo' | 'tarjeta' | 'transferencia' | 'credito';
  estado: 'pendiente' | 'completada' | 'anulada';
  montoTotal: number;
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
  { value: 'anulada', label: '❌ Anulada' },
];

const VentasScreen: React.FC = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);      
  const [clientes, setClientes] = useState<Cliente[]>([]);      
  const [filteredVentas, setFilteredVentas] = useState<Venta[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEstado, setSelectedEstado] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);                  
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadVentas();
    loadClientes();
  }, []);

  useEffect(() => {
    filterVentas();
  }, [ventas, searchQuery, selectedEstado]);

  const filterVentas = () => {
    let filtered = [...ventas];

    if (searchQuery && searchQuery.trim()) {
      filtered = filtered.filter(venta => {
        const clienteNombre = typeof venta.cliente === 'object' ? venta.cliente.nombre : 'Cliente';
        return clienteNombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
               venta.observaciones?.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    if (selectedEstado) {
      filtered = filtered.filter(venta => venta.estado === selectedEstado);
    }

    setFilteredVentas(filtered);
  };

  const loadVentas = async () => {
    try {
      const response = await apiService.get<Venta[]>('/ventas');
      
      if (response.success && response.data && Array.isArray(response.data)) {
        setVentas(response.data);
        setFilteredVentas(response.data);
      }
    } catch (error) {
      console.warn('Error cargando ventas:', error);
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
    loadVentas();
  };

  const getEstadoLabel = (estado: string) => {
    const estadoOption = estadoOptions.find(option => option.value === estado);
    return estadoOption ? estadoOption.label : estado;
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return '#ffc107';
      case 'completada':
        return '#28a745';
      case 'anulada':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const getMetodoPagoLabel = (metodoPago: string) => {
    const metodoOption = metodoPagoOptions.find(option => option.value === metodoPago);
    return metodoOption ? metodoOption.label : metodoPago;
  };

  const VentaCard: React.FC<{ venta: Venta }> = ({ venta }) => {
    const clienteNombre = typeof venta.cliente === 'object' ? venta.cliente.nombre : 'Cliente no encontrado';
    const montoFinal = (venta.montoTotal || 0) - (venta.descuento || 0);
    
    return (
      <ModernCard style={{ margin: 16, marginBottom: 12 }} variant="glass">
        <View style={{ padding: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            {/* Información principal */}
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <View style={{
                  backgroundColor: modernTheme.colors.primary[100],
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}>
                  <Text style={{ fontSize: 18 }}>👤</Text>
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
                  <ModernBadge 
                    text={getEstadoLabel(venta.estado)} 
                    variant={
                      venta.estado === 'completada' ? 'success' :
                      venta.estado === 'anulada' ? 'danger' : 'warning'
                    }
                  />
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
                  {venta.descuento && venta.descuento > 0 && (
                    <Text style={{ fontSize: 14, color: modernTheme.colors.danger[600] }}>
                      {' '}(Desc: ${(venta.descuento || 0).toLocaleString('es-CO')})
                    </Text>
                  )}
                </Text>
                
                <Text style={{
                  fontSize: 14,
                  color: modernTheme.colors.neutral[600],
                  marginBottom: 4,
                }}>
                  {getMetodoPagoLabel(venta.metodoPago)}
                </Text>
                
                <Text style={{
                  fontSize: 14,
                  color: modernTheme.colors.neutral[600],
                  marginBottom: 4,
                }}>
                  📅 {new Date(venta.fechaVenta).toLocaleDateString()}
                </Text>
                
                {venta.observaciones && (
                  <Text style={{
                    fontSize: 14,
                    color: modernTheme.colors.neutral[600],
                    marginBottom: 4,
                  }}>
                    📝 {venta.observaciones}
                  </Text>
                )}
                
                <Text style={{
                  fontSize: 12,
                  color: modernTheme.colors.neutral[400],
                  marginTop: 8,
                }}>
                  Creada: {new Date(venta.createdAt).toLocaleDateString()}
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
        <Text style={globalStyles.loadingText}>Cargando ventas...</Text>
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
            <Ionicons name="cash" size={24} color="white" />
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
            }}>{filteredVentas.length}</Text>
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
            placeholder="Buscar por cliente..."
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filtros horizontales por estado */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 5 }}>
          <View style={{ flexDirection: 'row', paddingHorizontal: 5 }}>
            <TouchableOpacity
              style={{
                backgroundColor: !selectedEstado ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                marginRight: 10,
                borderWidth: !selectedEstado ? 2 : 1,
                borderColor: 'rgba(255,255,255,0.3)',
              }}
              onPress={() => setSelectedEstado('')}
            >
              <Text style={{ 
                color: 'white', 
                fontWeight: !selectedEstado ? '600' : '400',
                fontSize: 14 
              }}>
                💰 Todas
              </Text>
            </TouchableOpacity>
            
            {estadoOptions.map((estado) => (
              <TouchableOpacity
                key={estado.value}
                style={{
                  backgroundColor: selectedEstado === estado.value ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  marginRight: 10,
                  borderWidth: selectedEstado === estado.value ? 2 : 1,
                  borderColor: 'rgba(255,255,255,0.3)',
                }}
                onPress={() => setSelectedEstado(selectedEstado === estado.value ? '' : estado.value)}
              >
                <Text style={{ 
                  color: 'white', 
                  fontWeight: selectedEstado === estado.value ? '600' : '400',
                  fontSize: 14 
                }}>
                  {estado.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
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
        {filteredVentas.length === 0 ? (
          <View style={globalStyles.emptyStateContainer}>
            <Text style={globalStyles.titleText}>💰</Text>
            <Text style={globalStyles.emptyStateText}>
              {searchQuery || selectedEstado ? 'No hay ventas que coincidan' : 'No hay ventas'}
            </Text>
            <Text style={globalStyles.emptyStateSubtext}>
              No se han creado ventas aún
            </Text>
          </View>
        ) : (
          filteredVentas.map((venta) => (
            <VentaCard key={venta._id} venta={venta} />
          ))
        )}
      </ScrollView>

    </View>
  );
};

export default VentasScreen;
