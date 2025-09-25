import React from 'react';
import { View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { NavigationContainer } from '@react-navigation/native';         
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';     

import { useAuth } from '../contexts/authContext';                     
import { RootStackParamList, MainTabParamList } from '../types/navigation'; 
import { colors, spacing, typography } from '../styles';               

import LoginScreen from '../screens/LoginScreen';           
import LoadingScreen from '../screens/LoadingScreen';      
import HomeScreen from '../screens/HomeScreen';             
import UserScreen from '../screens/UserScreen';           
import CategoriesScreen from '../screens/CategoriesScreen'; 
import SubcategoriesScreen from '../screens/SubcategoriesScreen'; 
import ProductsScreen from '../screens/ProductsScreen';
import ProductReportsScreen from '../screens/ProductReportsScreen';
import PurchaseReportsScreen from '../screens/PurchaseReportsScreen';
import SalesReportsScreen from '../screens/SalesReportsScreen';     
import ProfileScreen from '../screens/ProfileScreen';
import ClientesScreen from '../screens/ClientesScreen';
import ProveedoresScreen from '../screens/ProveedoresScreen';
import CotizacionesScreen from '../screens/CotizacionesScreen';
import PedidosScreen from '../screens/PedidosScreen';
import ComprasScreen from '../screens/ComprasScreen';
import VentasScreen from '../screens/VentasScreen';       

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,                           
        tabBarActiveTintColor: colors.primary,        
        tabBarInactiveTintColor: '#9CA3AF',          
        tabBarStyle: {
          backgroundColor: '#ffffff',                
          borderTopWidth: 0,                        
          height: 85,                               
          paddingBottom: 20,                        
          paddingTop: 10,                           
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 20,
          position: 'absolute',
        },
        tabBarLabelStyle: {
          fontSize: 12,                             
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 5,
        },
      }}
    >
      {/* Solo Home y Profile visibles en la barra */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Inicio',                       
          tabBarIcon: ({ focused, color }) => (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              padding: 10,
              borderRadius: 18,
              backgroundColor: focused ? color + '15' : 'transparent',
              minWidth: 60,
              minHeight: 45,
            }}>
              <Ionicons 
                name={focused ? "home" : "home-outline"} 
                size={focused ? 28 : 26} 
                color={color} 
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ focused, color }) => (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              padding: 10,
              borderRadius: 18,
              backgroundColor: focused ? color + '15' : 'transparent',
              minWidth: 60,
              minHeight: 45,
            }}>
              <Ionicons 
                name={focused ? "person-circle" : "person-circle-outline"} 
                size={focused ? 28 : 26} 
                color={color} 
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  const { user, isLoading } = useAuth();

  console.log('AppNavigator render - user:', user ? 'logged in' : 'not logged in');

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {user ? (
          <>
            <Stack.Screen name="Main" component={MainTabNavigator} />
            {/* Pantallas adicionales como pantallas de stack separadas */}
            <Stack.Screen name="Users" component={UserScreen} />
            <Stack.Screen name="Categories" component={CategoriesScreen} />
            <Stack.Screen name="Subcategories" component={SubcategoriesScreen} />
            <Stack.Screen name="Products" component={ProductsScreen} />
            <Stack.Screen name="ProductReports" component={ProductReportsScreen} />
            <Stack.Screen name="PurchaseReports" component={PurchaseReportsScreen} />
            <Stack.Screen name="SalesReports" component={SalesReportsScreen} />
            <Stack.Screen name="Clientes" component={ClientesScreen} />
            <Stack.Screen name="Proveedores" component={ProveedoresScreen} />
            <Stack.Screen name="Cotizaciones" component={CotizacionesScreen} />
            <Stack.Screen name="Pedidos" component={PedidosScreen} />
            <Stack.Screen name="Compras" component={ComprasScreen} />
            <Stack.Screen name="Ventas" component={VentasScreen} />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;