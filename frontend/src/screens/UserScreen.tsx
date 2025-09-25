
import React, { useState, useEffect, useRef } from 'react';
import {
  View,           
  Text,           
  ScrollView,
  FlatList,     
  TouchableOpacity, 
  Alert,          
  RefreshControl, 
  ActivityIndicator, 
  TextInput,      
  Modal,
  Animated,
  Dimensions,          
} from 'react-native';

import { useAuth } from '../contexts/authContext';    
import { apiService } from '../services/api';         
import { User } from '../services/index';                     
import { globalStyles, colors } from '../styles';    
import FloatingActionButton from '../components/FloatingActionButton';

import { Ionicons } from '@expo/vector-icons';
import { modernTheme } from '../styles/modernTheme';
import { ModernCard, ModernButton, ModernBadge } from '../components/ModernComponents';
import CrudActions from '../components/CrudActions';

const screenHeight = Dimensions.get('window').height;    


interface UserForm {
  username: string;             
  email: string;                
  firstName: string;             
  lastName: string;            
  password: string;             
  role: string; // ID del rol, no string simplificado
  phone: string;                 
}

const UsersScreen: React.FC = () => {
  const { hasRole, hasPermission } = useAuth();

  const [users, setUsers] = useState<User[]>([]);              
  const [isLoading, setIsLoading] = useState(true);             
  const [refreshing, setRefreshing] = useState(false);          
  const [modalVisible, setModalVisible] = useState(false);      
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [availableRoles, setAvailableRoles] = useState<any[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);

  // Estados para búsqueda y filtros
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all'); // 'all', 'admin', 'coordinador'

  const [formData, setFormData] = useState<UserForm>({
    username: '',           
    email: '',              
    firstName: '',          
    lastName: '',           
    password: '',           
    role: '',    // ID del rol, se establecerá cuando se carguen los roles
    phone: '',              
  });

  useEffect(() => {
    loadUsers();
    loadAvailableRoles();
  }, []);

  const loadAvailableRoles = async () => {
    try {
      setIsLoadingRoles(true);
      let rolesData: any[] = [];
      
      // Intentar cargar roles desde diferentes endpoints
      try {
        console.log('📋 Intentando cargar roles desde /api/roles...');
        const rolesResponse = await apiService.get<any[]>('/roles');
        if (rolesResponse.success && rolesResponse.data && Array.isArray(rolesResponse.data)) {
          rolesData = rolesResponse.data;
          console.log('✅ Roles cargados desde /api/roles:', rolesData);
        }
      } catch (rolesError) {
        console.log('⚠️ Endpoint /api/roles no disponible, intentando desde usuarios...');
        
        // Si no hay endpoint de roles, extraer desde usuarios existentes
        try {
          const usersResponse = await apiService.get<User[]>('/users');
          if (usersResponse.success && usersResponse.data && Array.isArray(usersResponse.data)) {
            const rolesSet = new Set();
            
            usersResponse.data.forEach((user: User) => {
              if (user.role && typeof user.role === 'object' && user.role._id && user.role.name) {
                if (!rolesSet.has(user.role._id)) {
                  rolesSet.add(user.role._id);
                  rolesData.push({
                    _id: user.role._id,
                    name: user.role.name
                  });
                }
              }
            });
            console.log('✅ Roles extraídos desde usuarios:', rolesData);
          }
        } catch (usersError) {
          console.log('❌ Error cargando usuarios para extraer roles:', usersError);
        }
      }
      
      // Si no tenemos roles y no hay usuarios, crear roles básicos para Bootstrap
      if (rolesData.length === 0) {
        try {
          const usersResponse = await apiService.get<User[]>('/users');
          const hasUsers = usersResponse.success && 
                          usersResponse.data && 
                          Array.isArray(usersResponse.data) && 
                          usersResponse.data.length > 0;
          
          if (!hasUsers) {
            // Si no hay usuarios, permitir crear con roles string básicos para Bootstrap
            console.log('🚀 Sistema vacío detectado - Habilitando modo Bootstrap');
            rolesData = [
              { _id: 'admin', name: 'Administrador' },
              { _id: 'vendedor', name: 'Vendedor' },
              { _id: 'inventario', name: 'Encargado de Inventario' }
            ];
            console.log('✅ Roles Bootstrap habilitados:', rolesData);
          } else {
            console.warn('⚠️ Hay usuarios pero sin roles válidos');
          }
        } catch (error) {
          console.log('📍 Asumiendo sistema nuevo - Habilitando modo Bootstrap');
          rolesData = [
            { _id: 'admin', name: 'Administrador' },
            { _id: 'vendedor', name: 'Vendedor' },
            { _id: 'inventario', name: 'Encargado de Inventario' }
          ];
        }
      }
      
      // Si tenemos roles válidos, usarlos
      if (rolesData.length > 0) {
        setAvailableRoles(rolesData);
        
        // Establecer rol por defecto (el primero que no sea Administrador)
        const defaultRole = rolesData.find(role => 
          role.name && role.name.toLowerCase() !== 'administrador'
        ) || rolesData[0];
        
        if (defaultRole && defaultRole._id) {
          setFormData(prev => ({ ...prev, role: defaultRole._id }));
          console.log('🎯 Rol por defecto establecido:', defaultRole);
        }
      } else {
        console.warn('⚠️ No se pudieron cargar roles válidos');
        setAvailableRoles([]);
      }
    } catch (error) {
      console.error('❌ Error crítico cargando roles:', error);
      setAvailableRoles([]);
    } finally {
      setIsLoadingRoles(false);
    }
  };

  // Función para filtrar usuarios
  const getFilteredUsers = () => {
    return users.filter(user => {
      const matchesSearch = searchQuery === '' || 
        user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === 'all' ||
        (typeof user.role === 'object' && user.role.name && 
          user.role.name === roleFilter
        );

      return matchesSearch && matchesRole;
    });
  };

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.get<User[]>('/users');
      if (response.success && response.data) {
        setUsers(response.data);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al cargar usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  };

  const resetForm = () => {
    // Usar el primer rol no-administrador disponible por defecto
    const defaultRole = availableRoles.find(role => role.name !== 'Administrador');
    const defaultRoleId = defaultRole ? defaultRole._id : (availableRoles.length > 0 ? availableRoles[0]._id : '');
    
    setFormData({
      username: '',
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      role: defaultRoleId,
      phone: '',
    });
    setEditingUser(null);
  };

  const openCreateModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    
    // Usar directamente el ID del rol del usuario
    let roleId = '';
    if (typeof user.role === 'object' && user.role._id) {
      roleId = user.role._id;
    } else if (typeof user.role === 'string') {
      // Si es string, buscar el rol por ID
      const foundRole = availableRoles.find(role => role._id === user.role);
      roleId = foundRole ? foundRole._id : user.role;
    }
    
    setFormData({
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      password: '', 
      role: roleId,
      phone: user.phone || '',
    });
    setModalVisible(true);
  };

  const handleSave = async () => {
    try {
      // Validaciones básicas
      if (!formData.username.trim() || !formData.email.trim() || 
          !formData.firstName.trim() || !formData.lastName.trim()) {
        Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
        return;
      }

      // Validar que hay un rol seleccionado y que existe en los roles disponibles
      if (!formData.role) {
        Alert.alert('Error', 'Por favor selecciona un rol para el usuario');
        return;
      }

      const selectedRole = availableRoles.find(role => role._id === formData.role);
      if (!selectedRole) {
        Alert.alert('Error', 'El rol seleccionado no es válido. Por favor selecciona otro rol.');
        return;
      }

      if (!editingUser && !formData.password.trim()) {
        Alert.alert('Error', 'La contraseña es obligatoria para nuevos usuarios');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        Alert.alert('Error', 'Por favor ingresa un email válido');
        return;
      }

      console.log('📝 Enviando datos del usuario:', {
        ...formData,
        password: '[OCULTO]',
        selectedRole: selectedRole.name
      });

      setIsLoading(true);

      if (editingUser) {
        // Actualizar usuario existente
        const updateData: any = {
          username: formData.username.trim(),
          email: formData.email.trim(),
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          role: formData.role,
          phone: formData.phone.trim(),
        };

        // Solo incluir password si se proporcionó
        if (formData.password.trim()) {
          updateData.password = formData.password;
        }

        const response = await apiService.put(`/users/${editingUser._id}`, updateData);
        if (response.success) {
          Alert.alert('Éxito', 'Usuario actualizado correctamente');
          setModalVisible(false);
          await loadUsers();
        }
      } else {
        // Crear nuevo usuario
        const response = await apiService.post('/users', formData);
        if (response.success) {
          Alert.alert('Éxito', 'Usuario creado correctamente');
          setModalVisible(false);
          await loadUsers();
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al guardar usuario');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (user: User) => {
    const action = user.isActive ? 'desactivar' : 'activar';
    Alert.alert(
      'Confirmar acción',
      `¿Estás seguro de que quieres ${action} al usuario ${user.username}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            try {
              const response = await apiService.patch(`/users/${user._id}/toggle-status`);
              if (response.success) {
                Alert.alert('Éxito', `Usuario ${action}do correctamente`);
                await loadUsers();
              }
            } catch (error: any) {
              Alert.alert('Error', error.message || `Error al ${action} usuario`);
            }
          }
        }
      ]
    );
  };

  // Función para renderizar cada card de usuario
  const renderUserCard = ({ item }: { item: User }) => {
    const getUserRoleColor = (role: any) => {
      if (typeof role === 'object' && role.name) {
        switch (role.name) {
          case 'Administrador': return '#EF4444';
          case 'Vendedor': return '#10B981';
          case 'Jefe de compras': return '#F59E0B';
          case 'Encargado de inventario': return '#007BFF';
          case 'Gerente': return '#8B5CF6';
          case 'Venta': return '#06B6D4';
          default: return '#6B7280';
        }
      }
      return '#6B7280';
    };

    const roleColor = getUserRoleColor(item.role);

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
                {item.firstName} {item.lastName}
              </Text>
              <ModernBadge
                text={item.isActive ? 'Activo' : 'Inactivo'}
                variant={item.isActive ? 'success' : 'danger'}
                size="sm"
              />
            </View>
            
            <Text style={{
              ...modernTheme.typography.body.small,
              color: modernTheme.colors.neutral[500],
              marginBottom: modernTheme.spacing.xs,
              fontFamily: 'monospace',
            }}>
              @{item.username}
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: modernTheme.spacing.xs }}>
              <Ionicons name="shield-checkmark" size={14} color={roleColor} />
              <Text style={{
                ...modernTheme.typography.body.small,
                color: roleColor,
                marginLeft: modernTheme.spacing.xs,
                fontWeight: '600'
              }}>
                {typeof item.role === 'object' ? item.role.name : item.role}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: modernTheme.spacing.xs }}>
              <Ionicons name="mail" size={14} color="#6B7280" />
              <Text style={{
                ...modernTheme.typography.body.small,
                color: "#6B7280",
                marginLeft: modernTheme.spacing.xs,
              }}>
                {item.email}
              </Text>
            </View>

            {item.phone && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: modernTheme.spacing.xs }}>
                <Ionicons name="call" size={14} color="#6B7280" />
                <Text style={{
                  ...modernTheme.typography.body.small,
                  color: "#6B7280",
                  marginLeft: modernTheme.spacing.xs,
                }}>
                  {item.phone}
                </Text>
              </View>
            )}

            <Text style={{
              ...modernTheme.typography.body.small,
              color: modernTheme.colors.neutral[500],
              marginTop: modernTheme.spacing.xs,
            }}>
              Creado: {new Date(item.createdAt).toLocaleDateString('es-ES', { 
                day: '2-digit', 
                month: 'short', 
                year: 'numeric' 
              })}
            </Text>
          </View>

          <View style={{ marginLeft: modernTheme.spacing.md }}>
            <CrudActions
              canEdit={hasPermission('usuarios.editar')}
              canDelete={hasPermission('usuarios.eliminar')}
              onEdit={() => openEditModal(item)}
              onDelete={() => handleToggleStatus(item)}
            />
          </View>
        </View>
      </ModernCard>
    );
  };

  if (!hasPermission('usuarios.ver')) {
    return (
      <View style={[globalStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <View style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: modernTheme.colors.danger.light,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: modernTheme.spacing.lg,
        }}>
          <Ionicons name="warning" size={36} color={modernTheme.colors.danger.main} />
        </View>
        <Text style={{
          ...modernTheme.typography.heading.h3,
          color: modernTheme.colors.neutral[700],
          marginBottom: modernTheme.spacing.sm,
          textAlign: 'center',
        }}>Acceso Denegado</Text>
        <Text style={{
          ...modernTheme.typography.body.medium,
          color: modernTheme.colors.neutral[500],
          textAlign: 'center',
          lineHeight: 24,
        }}>
          No tienes permisos para gestionar usuarios
        </Text>
      </View>
    );
  }

  const filteredUsers = getFilteredUsers();

  return (
    <View style={[globalStyles.container, { flex: 1, position: 'relative' }]}>
      {/* Header Glassmorphism - igual que productos */}
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
            Usuarios
          </Text>
          
          {/* Botón de crear en el header */}
          
          
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
            }}>{filteredUsers.length}</Text>
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
            placeholder="Buscar usuarios, email..."
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

        {/* Filtros de rol como chips - igual que productos */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: roleFilter === 'all' ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.15)',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              marginRight: 8,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.3)',
            }}
            onPress={() => setRoleFilter('all')}
          >
            <Text style={{
              fontSize: 12,
              fontWeight: '600',
              color: 'white',
            }}>Todos</Text>
          </TouchableOpacity>

          {availableRoles.map((role) => {
            const isActive = roleFilter === role.name;
            return (
              <TouchableOpacity
                key={role._id}
                style={{
                  backgroundColor: isActive ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.15)',
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  marginRight: 8,
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.3)',
                }}
                onPress={() => setRoleFilter(role.name)}
              >
                <Text style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: 'white',
                }}>{role.name}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Lista de usuarios */}
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={{
            marginTop: 16,
            fontSize: 16,
            color: '#64748B',
            fontWeight: '500',
          }}>Cargando usuarios...</Text>
        </View>
      ) : users.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC', paddingHorizontal: 40 }}>
          <View style={{
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            width: 80,
            height: 80,
            borderRadius: 40,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
          }}>
            <Ionicons name="people-outline" size={36} color="#007BFF" />
          </View>
          <Text style={{
            fontSize: 20,
            fontWeight: '700',
            color: '#1E293B',
            marginBottom: 8,
            textAlign: 'center',
          }}>No hay usuarios</Text>
          <Text style={{
            fontSize: 16,
            color: '#64748B',
            textAlign: 'center',
            lineHeight: 24,
            marginBottom: 24,
          }}>
            Agrega el primer usuario al sistema
          </Text>
          {hasPermission('usuarios.crear') && (
            <TouchableOpacity
              onPress={openCreateModal}
              style={{
                backgroundColor: '#007BFF',
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 25,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Ionicons name="add" size={18} color="white" style={{ marginRight: 8 }} />
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: 'white',
              }}>Crear primer usuario</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : filteredUsers.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC', paddingHorizontal: 40 }}>
          <View style={{
            backgroundColor: 'rgba(251, 191, 36, 0.1)',
            width: 80,
            height: 80,
            borderRadius: 40,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
          }}>
            <Ionicons name="search-outline" size={36} color="#F59E0B" />
          </View>
          <Text style={{
            fontSize: 20,
            fontWeight: '700',
            color: '#1E293B',
            marginBottom: 8,
            textAlign: 'center',
          }}>Sin resultados</Text>
          <Text style={{
            fontSize: 16,
            color: '#64748B',
            textAlign: 'center',
            lineHeight: 24,
          }}>
            No se encontraron usuarios que coincidan con los filtros aplicados
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item._id}
          renderItem={renderUserCard}
          contentContainerStyle={{
            padding: 20,
            backgroundColor: '#F8FAFC',
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#007BFF']}
              tintColor="#007BFF"
            />
          }
        />
      )}

      {/* Floating Action Button */}
      {hasPermission('usuarios.crear') && (
        <FloatingActionButton
          onPress={openCreateModal}
          icon="person-add"
          color="#007BFF"
        />
      )}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'flex-end',
        }}>
          <View style={{
            backgroundColor: 'white',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: '85%', // Altura fija como en categorías
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.25,
            shadowRadius: 8,
            elevation: 10,
          }}>
            {/* Header del modal */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 20,
              paddingTop: 20,
              paddingBottom: 16,
              borderBottomWidth: 1,
              borderBottomColor: '#E5E5E5',
            }}>
              <View style={{ flex: 1 }}>
                <Text style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: '#1A1A1A',
                  marginBottom: 4,
                }}>
                  {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: '#666666',
                }}>
                  {editingUser ? 'Actualiza la información del usuario' : 'Completa los datos del nuevo usuario'}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  padding: 8,
                  borderRadius: 8,
                  backgroundColor: '#F5F5F5',
                }}
              >
                <Ionicons name="close" size={20} color="#666666" />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={{
                flex: 1,
                paddingHorizontal: 20,
              }}
              contentContainerStyle={{
                paddingVertical: 20,
              }}
              showsVerticalScrollIndicator={false}
            >
              {/* Nombre de usuario */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#333333',
                  marginBottom: 8,
                }}>Nombre de usuario *</Text>
                <TextInput
                  placeholder="Ej: juanperez"
                  value={formData.username}
                  onChangeText={(text) => setFormData(prev => ({...prev, username: text}))}
                  autoCapitalize="none"
                  style={{
                    borderWidth: 1,
                    borderColor: '#DDDDDD',
                    borderRadius: 8,
                    padding: 12,
                    backgroundColor: 'white',
                    fontSize: 16,
                    color: '#333333',
                  }}
                  placeholderTextColor="#999999"
                />
              </View>

              {/* Email */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#333333',
                  marginBottom: 8,
                }}>Correo electrónico *</Text>
                <TextInput
                  placeholder="juan@empresa.com"
                  value={formData.email}
                  onChangeText={(text) => setFormData(prev => ({...prev, email: text}))}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  style={{
                    borderWidth: 1,
                    borderColor: '#DDDDDD',
                    borderRadius: 8,
                    padding: 12,
                    backgroundColor: 'white',
                    fontSize: 16,
                    color: '#333333',
                  }}
                  placeholderTextColor="#999999"
                />
              </View>

              {/* Nombre y Apellido en una fila */}
              <View style={{
                flexDirection: 'row',
                gap: 12,
                marginBottom: 20,
              }}>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#333333',
                    marginBottom: 8,
                  }}>Nombre *</Text>
                  <TextInput
                    placeholder="Juan"
                    value={formData.firstName}
                    onChangeText={(text) => setFormData(prev => ({...prev, firstName: text}))}
                    style={{
                      borderWidth: 1,
                      borderColor: '#DDDDDD',
                      borderRadius: 8,
                      padding: 12,
                      backgroundColor: 'white',
                      fontSize: 16,
                      color: '#333333',
                    }}
                    placeholderTextColor="#999999"
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: '#333333',
                    marginBottom: 8,
                  }}>Apellido *</Text>
                  <TextInput
                    placeholder="Pérez"
                    value={formData.lastName}
                    onChangeText={(text) => setFormData(prev => ({...prev, lastName: text}))}
                    style={{
                      borderWidth: 1,
                      borderColor: '#DDDDDD',
                      borderRadius: 8,
                      padding: 12,
                      backgroundColor: 'white',
                      fontSize: 16,
                      color: '#333333',
                    }}
                    placeholderTextColor="#999999"
                  />
                </View>
              </View>

              {/* Teléfono */}
              <View style={{ marginBottom: 20 }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#333333',
                  marginBottom: 8,
                }}>Teléfono</Text>
                <TextInput
                  placeholder="Ej: +57 300 123 4567"
                  value={formData.phone}
                  onChangeText={(text) => setFormData(prev => ({...prev, phone: text}))}
                  keyboardType="phone-pad"
                  style={{
                    borderWidth: 1,
                    borderColor: '#DDDDDD',
                    borderRadius: 8,
                    padding: 12,
                    backgroundColor: 'white',
                    fontSize: 16,
                    color: '#333333',
                  }}
                  placeholderTextColor="#999999"
                />
              </View>

              {/* Rol */}
              <View style={{ marginBottom: 70 }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#333333',
                  marginBottom: 12,
                }}>Rol del usuario *</Text>
                
                <View style={{ maxHeight: 200 }}>
                  {isLoadingRoles ? (
                    <View style={{
                      padding: 20,
                      alignItems: 'center',
                    }}>
                      <Text style={{
                        fontSize: 14,
                        color: '#999999',
                        marginBottom: 8,
                      }}>
                        Cargando roles disponibles...
                      </Text>
                    </View>
                  ) : availableRoles.length === 0 ? (
                    <View style={{
                      padding: 20,
                      alignItems: 'center',
                      backgroundColor: '#FFF3CD',
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: '#FFEAA7',
                    }}>
                      <Ionicons name="warning" size={24} color="#856404" style={{ marginBottom: 8 }} />
                      <Text style={{
                        fontSize: 14,
                        color: '#856404',
                        textAlign: 'center',
                        fontWeight: '600',
                        marginBottom: 4,
                      }}>
                        Sistema en configuración inicial
                      </Text>
                      <Text style={{
                        fontSize: 12,
                        color: '#856404',
                        textAlign: 'center',
                        marginBottom: 8,
                      }}>
                        No se pudieron cargar los roles del sistema. Es posible que necesites configurar los roles en el backend primero.
                      </Text>
                      <TouchableOpacity
                        style={{
                          backgroundColor: '#856404',
                          paddingHorizontal: 16,
                          paddingVertical: 6,
                          borderRadius: 4,
                          marginTop: 4,
                        }}
                        onPress={loadAvailableRoles}
                      >
                        <Text style={{
                          color: 'white',
                          fontSize: 12,
                          fontWeight: '600',
                        }}>
                          Reintentar carga
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    availableRoles.map((role) => (
                      <TouchableOpacity
                        key={role._id}
                        onPress={() => setFormData(prev => ({...prev, role: role._id}))}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: 12,
                          marginBottom: 8,
                          borderRadius: 8,
                          borderWidth: 2,
                          borderColor: formData.role === role._id ? '#007BFF' : '#DDDDDD',
                          backgroundColor: formData.role === role._id ? '#E6F3FF' : 'white',
                        }}
                      >
                        <View style={{
                          width: 20,
                          height: 20,
                          borderRadius: 10,
                          borderWidth: 2,
                          borderColor: formData.role === role._id ? '#007BFF' : '#CCCCCC',
                          backgroundColor: formData.role === role._id ? '#007BFF' : 'transparent',
                          marginRight: 12,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                          {formData.role === role._id && (
                            <Ionicons name="checkmark" size={12} color="white" />
                          )}
                        </View>
                        <Text style={{
                          fontSize: 16,
                          fontWeight: '600',
                          color: formData.role === role._id ? '#007BFF' : '#666666',
                        }}>{role.name}</Text>
                        
                      </TouchableOpacity>
                    ))
                  )}
                </View>
              </View>

              {/* Contraseña - Al final del formulario */}
              <View style={{ marginTop: 20, marginBottom: 30 }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#333333',
                  marginBottom: 8,
                  
                }}>
                  {editingUser ? 'Contraseña (dejar vacío para no cambiar)' : 'Contraseña *'}
                </Text>
                <TextInput
                  placeholder="Mínimo 6 caracteres"
                  value={formData.password}
                  onChangeText={(text) => setFormData(prev => ({...prev, password: text}))}
                  secureTextEntry
                  style={{
                    borderWidth: 1,
                    borderColor: '#DDDDDD',
                    borderRadius: 8,
                    padding: 12,
                    backgroundColor: 'white',
                    fontSize: 16,
                    color: '#333333',
                  }}
                  placeholderTextColor="#999999"
                />
              </View>
            </ScrollView>

            {/* Botones de acción */}
            <View style={{
              flexDirection: 'row',
              paddingHorizontal: 20,
              paddingVertical: 16,
              paddingBottom: 24,
              gap: 12,
              borderTopWidth: 1,
              borderTopColor: '#E5E5E5',
            }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#F5F5F5',
                  paddingVertical: 12,
                  borderRadius: 8,
                  alignItems: 'center',
                }}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#666666',
                }}>
                  Cancelar
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: (isLoading || availableRoles.length === 0) ? '#CCCCCC' : '#007BFF',
                  paddingVertical: 12,
                  borderRadius: 8,
                  alignItems: 'center',
                }}
                onPress={handleSave}
                disabled={isLoading || availableRoles.length === 0}
              >
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: 'white',
                }}>
                  {isLoading ? 'Guardando...' : 
                   availableRoles.length === 0 ? 'Configurar roles primero' :
                   (editingUser ? 'Actualizar' : 'Crear Usuario')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default UsersScreen;
