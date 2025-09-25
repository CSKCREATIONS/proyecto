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

  return (
    <View style={[globalStyles.container]}>
      <Text>Compras - Vista de Solo Lectura</Text>
    </View>
  );
};

export default ComprasScreen;
