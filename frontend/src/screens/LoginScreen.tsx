import React, { useState } from 'react';
import {
  View,                 
  Text,                  
  TextInput,            
  TouchableOpacity,      
  Alert,                 
  KeyboardAvoidingView,  
  Platform,              
  ScrollView,          
  ActivityIndicator,     
} from 'react-native';

import { useAuth } from '../contexts/authContext';    
import { LoginCredentials } from '../services';         
import { globalStyles, colors } from '../styles';    


const LoginScreen: React.FC = () => {
  const { login, isLoading } = useAuth(); 
  
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',     
    password: '',  
  });
  
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleInputChange = (field: keyof LoginCredentials, value: string) => {
    setCredentials(prev => ({
      ...prev,
      [field]: value.trim(),
    }));
  };

  const validateForm = (): boolean => {
    if (!credentials.email) {
      Alert.alert('Error', 'Por favor ingresa tu email o username');
      return false;
    }

    // Validar que la contraseña no esté vacía
    if (!credentials.password) {
      Alert.alert('Error', 'Por favor ingresa tu contraseña');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;        
    const isEmail = emailRegex.test(credentials.email);      
    const isUsername = credentials.email.length >= 3 && !credentials.email.includes('@'); 
    
    if (!isEmail && !isUsername) {
      Alert.alert('Error', 'Por favor ingresa un email válido o username (mínimo 3 caracteres)');
      return false;
    }

    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      const response = await login(credentials);
      
      if (response.success) {
        // La navegación se manejará automáticamente por el AuthContext
        Alert.alert('Éxito', response.message || 'Bienvenido');
      } else {
        Alert.alert('Error', response.message || 'Error en el login');
      }
    } catch (error: any) {
      Alert.alert(
        'Error de conexión',
        error.message || 'No se pudo conectar con el servidor'
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={globalStyles.loginContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={globalStyles.loginScrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={globalStyles.loginLogoContainer}>
          <Text style={globalStyles.loginLogoText}>📱</Text>
          <Text style={globalStyles.loginAppTitle}>Mi App</Text>
          <Text style={globalStyles.loginSubtitle}>Sistema de Gestión</Text>
        </View>

        <View style={globalStyles.loginFormContainer}>
          <Text style={globalStyles.loginFormTitle}>Iniciar Sesión</Text>

          <View style={globalStyles.inputContainer}>
            <Text style={globalStyles.inputLabel}>Email o Username</Text>
            <TextInput
              style={globalStyles.textInput}
              value={credentials.email}
              onChangeText={(value: string) => handleInputChange('email', value)}
              placeholder="admin o admin@ejemplo.com"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          <View style={globalStyles.inputContainer}>
            <Text style={globalStyles.inputLabel}>Contraseña</Text>
            <View style={globalStyles.loginPasswordContainer}>
              <TextInput
                style={[globalStyles.textInput, globalStyles.loginPasswordInput]}
                value={credentials.password}
                onChangeText={(value: string) => handleInputChange('password', value)}
                placeholder="Tu contraseña"
                placeholderTextColor="#999"
                secureTextEntry={!isPasswordVisible}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
              <TouchableOpacity
                style={globalStyles.loginEyeButton}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                disabled={isLoading}
              >
                <Text style={globalStyles.loginEyeButtonText}>
                  {isPasswordVisible ? '🙈' : '👁️'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[
              globalStyles.loginButton,
              isLoading && globalStyles.loginButtonDisabled
            ]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={globalStyles.loginButtonText}>Ingresar</Text>
            )}
          </TouchableOpacity>

          <View style={globalStyles.loginInfoContainer}>
            <Text style={globalStyles.loginInfoText}>
              💡 Usa las credenciales del sistema
            </Text>
            <Text style={globalStyles.loginDemoText}>
              Admin: admin / admin123{'\n'}
              Coordinador: coordinador / coord123
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
