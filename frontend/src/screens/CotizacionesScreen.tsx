import React, { useState, useEffect } from 'react';
import {
  View,                  
  Text,                  
  ScrollView,            
  TouchableOpacity,      
  TextInput,            
  ActivityIndicator,
  FlatList,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { apiService } from '../services/api';            
import { globalStyles } from '../styles'; 
import { modernTheme } from '../styles/modernTheme';
import { ModernCard, ModernBadge } from '../components/ModernComponents';

interface Cliente {
  _id: string;
  nombre: string;
  correo: string;
}

interface Cotizacion {
  _id: string;
  codigo?: string;
  cliente: Cliente | string | null; // Puede venir null desde el backend
  descripcion: string;
  montoTotal: number;
  fechaCreacion: string;
  fechaVencimiento: string;
  estado: 'borrador' | 'enviada' | 'aceptada' | 'rechazada' | 'vencida';
  createdAt: string;
  updatedAt: string;
}

const estadoOptions = [
  { value: 'borrador', label: '📝 Borrador' },
  { value: 'enviada', label: '📤 Enviada' },
  { value: 'aceptada', label: '✅ Aceptada' },
  { value: 'rechazada', label: '❌ Rechazada' },
  { value: 'vencida', label: '⏰ Vencida' },
];

const CotizacionesScreen: React.FC = () => {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);      
  const [clientes, setClientes] = useState<Cliente[]>([]);      
  const [isLoading, setIsLoading] = useState(true);                  
  const [isRefreshing, setIsRefreshing] = useState(false);           

  // Estados para búsqueda
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadCotizaciones();
    loadClientes();
  }, []);

  const loadCotizaciones = async () => {
    try {
      const response = await apiService.get<Cotizacion[]>('/cotizaciones');
      
      if (response.success && response.data && Array.isArray(response.data)) {
        setCotizaciones(response.data);
      }
    } catch (error) {
      console.warn('Error cargando cotizaciones:', error);
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
    loadCotizaciones();
  };

  // Funciones de filtrado
  const getFilteredCotizaciones = () => {
    return cotizaciones.filter((cotizacion) => {
      // Filtro por búsqueda
      const codigo = cotizacion.codigo || `COT-${cotizacion._id.slice(-6).toUpperCase()}`;
      const matchesSearch = !searchQuery || 
        cleanHtmlText(cotizacion.descripcion).toLowerCase().includes(searchQuery.toLowerCase()) ||
        codigo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (
          cotizacion.cliente &&
          typeof cotizacion.cliente === 'object' &&
          'nombre' in cotizacion.cliente &&
          typeof (cotizacion.cliente as any).nombre === 'string' &&
          (cotizacion.cliente as any).nombre.toLowerCase().includes(searchQuery.toLowerCase())
        );

      return matchesSearch;
    });
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getEstadoLabel = (estado: string) => {
    const option = estadoOptions.find(opt => opt.value === estado);
    return option ? option.label : estado;
  };

  const cleanHtmlText = (html: string) => {
    if (!html) return '';
    // Remover etiquetas HTML y entidades HTML
    return html
      .replace(/<[^>]*>/g, '') // Remover etiquetas HTML
      .replace(/&nbsp;/g, ' ') // Reemplazar espacios no rompibles
      .replace(/&amp;/g, '&') // Reemplazar &
      .replace(/&lt;/g, '<')  // Reemplazar <
      .replace(/&gt;/g, '>')  // Reemplazar >
      .replace(/&quot;/g, '"') // Reemplazar "
      .trim();
  };

  const renderCotizacionCard = ({ item }: { item: Cotizacion }) => {
    return (
      <ModernCard style={{ marginBottom: modernTheme.spacing.md, padding: modernTheme.spacing.lg }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            {/* Código de cotización */}
            <View style={{
              backgroundColor: '#EFF6FF',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
              alignSelf: 'flex-start',
              marginBottom: modernTheme.spacing.sm,
              borderWidth: 1,
              borderColor: '#DBEAFE',
            }}>
              <Text style={{
                fontSize: 12,
                color: '#3B82F6',
                fontWeight: '700',
                letterSpacing: 0.5,
              }}>
                {item.codigo || `COT-${item._id.slice(-6).toUpperCase()}`}
              </Text>
            </View>
            
            <Text style={{
              ...modernTheme.typography.heading.h4,
              color: modernTheme.colors.neutral[800],
              marginBottom: modernTheme.spacing.xs,
            }}>
              {(
                item.cliente &&
                typeof item.cliente === 'object' &&
                'nombre' in item.cliente &&
                typeof (item.cliente as any).nombre === 'string'
              ) ? (item.cliente as any).nombre : 'Cliente no disponible'}
            </Text>
            
            <Text style={{
              ...modernTheme.typography.body.medium,
              color: modernTheme.colors.neutral[600],
              marginBottom: modernTheme.spacing.sm,
            }}>
              {cleanHtmlText(item.descripcion)}
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: modernTheme.spacing.sm }}>
              <Ionicons name="cash" size={16} color="#28a745" />
              <Text style={{
                ...modernTheme.typography.body.large,
                fontWeight: '600',
                color: '#28a745',
                marginLeft: modernTheme.spacing.xs,
              }}>
                ${item.montoTotal ? item.montoTotal.toLocaleString() : '0.00'}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="calendar" size={14} color={modernTheme.colors.neutral[500]} />
              <Text style={{
                ...modernTheme.typography.body.small,
                color: modernTheme.colors.neutral[500],
                marginLeft: modernTheme.spacing.xs,
              }}>
                Vence: {formatearFecha(item.fechaVencimiento)}
              </Text>
            </View>
          </View>

          <View style={{ alignItems: 'flex-end' }}>
            <View style={{ marginBottom: modernTheme.spacing.sm }}>
              <ModernBadge
                text={getEstadoLabel(item.estado)}
                variant={item.estado === 'aceptada' ? 'success' : item.estado === 'rechazada' || item.estado === 'vencida' ? 'danger' : 'warning'}
                size="sm"
              />
            </View>
            
            <View style={{ flexDirection: 'row' }}>
              {/* Removed CRUD actions - read-only view */}
            </View>
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
        }}>Cargando cotizaciones...</Text>
      </View>
    );
  }

  const filteredCotizaciones = getFilteredCotizaciones();

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
        <Ionicons name="document-text-outline" size={40} color={modernTheme.colors.neutral[400]} />
      </View>
      
      <Text style={{
        ...modernTheme.typography.heading.h3,
        color: modernTheme.colors.neutral[700],
        textAlign: 'center',
        marginBottom: modernTheme.spacing.sm,
      }}>
        No se encontraron cotizaciones
      </Text>
      
      <Text style={{
        ...modernTheme.typography.body.medium,
        color: modernTheme.colors.neutral[500],
        textAlign: 'center',
        lineHeight: 20,
      }}>
        {searchQuery 
          ? 'No hay cotizaciones que coincidan con la búsqueda'
          : 'No se han creado cotizaciones aún'
        }
      </Text>
    </View>
  );

  return (
    <View style={[globalStyles.container, { flex: 1, backgroundColor: '#FAFBFC' }]}>
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
            <Ionicons name="document-text" size={24} color="white" />
          </View>
          <Text style={{
            fontSize: 20,
            color: 'white',
            fontWeight: '700',
            flex: 1
          }}>
            Cotizaciones
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
            }}>{filteredCotizaciones.length}</Text>
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
            placeholder="Buscar cotizaciones..."
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
      </View>

      {/* Content List */}
      {filteredCotizaciones.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={filteredCotizaciones}
          keyExtractor={(item) => item._id}
          renderItem={renderCotizacionCard}
          style={{
            flex: 1,
            paddingHorizontal: modernTheme.spacing.lg,
            marginTop: modernTheme.spacing.md,
          }}
          showsVerticalScrollIndicator={false}
          onRefresh={loadCotizaciones}
          refreshing={isRefreshing}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}
    </View>
  );
};

export default CotizacionesScreen;