import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { apiService } from './api';                                    
import { LoginCredentials, LoginResponse, User, ChangePasswordData, ApiResponse } from './index'; 

class AuthService {
  private readonly TOKEN_KEY = 'token';  
  private readonly USER_KEY = 'user';    

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiService.post<LoginResponse['data']>('/auth/login', credentials);
      
      if (response.success && response.data) {
        await AsyncStorage.setItem(this.TOKEN_KEY, response.data.token);           
        await AsyncStorage.setItem(this.USER_KEY, JSON.stringify(response.data.user)); 
        
        return {
          success: true,
          message: response.message || 'Login exitoso',
          data: response.data
        };
      } else {
        throw new Error(response.message || 'Error en el login');
      }
    } catch (error: any) {
      throw {
        success: false,
        message: error.message || 'Error de conexión',
        data: null
      };
    }
  }


  async logout(): Promise<void> {
    try {
      await apiService.post('/auth/logout');
    } catch (error) {
      console.warn('Error en logout del servidor:', error);
    } finally {
      await AsyncStorage.multiRemove([this.TOKEN_KEY, this.USER_KEY]);
    }
  }

  async getToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      console.warn('Error obteniendo token:', error);
      return null;
    }
  }

  async getUser(): Promise<User | null> {
    try {
      const userString = await AsyncStorage.getItem(this.USER_KEY);
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.warn('Error obteniendo usuario:', error);
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    const user = await this.getUser();
    return !!(token && user);
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await apiService.get<User>('/auth/me');
      
      if (response.success && response.data) {
        // Actualizar usuario en AsyncStorage
        await AsyncStorage.setItem(this.USER_KEY, JSON.stringify(response.data));
        return response.data;
      } else {
        throw new Error(response.message || 'Error obteniendo usuario');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Error de conexión');
    }
  }

  // Cambiar contraseña
  async changePassword(data: ChangePasswordData): Promise<ApiResponse> {
    try {
      const response = await apiService.put('/auth/change-password', data);
      return response;
    } catch (error: any) {
      throw new Error(error.message || 'Error cambiando contraseña');
    }
  }

  // Verificar token en el servidor
  async verifyToken(): Promise<boolean> {
    try {
      const response = await apiService.get('/auth/verify');
      return response.success;
    } catch (error) {
      return false;
    }
  }

  // Limpiar datos de autenticación
  async clearAuthData(): Promise<void> {
    await AsyncStorage.multiRemove([this.TOKEN_KEY, this.USER_KEY]);
  }

  // Verificar si el usuario tiene un rol específico
  async hasRole(role: 'admin' | 'coordinador'): Promise<boolean> {
    const user = await this.getUser();
    return user?.role === role;
  }

  // Verificar si el usuario puede eliminar (solo admin)
  async canDelete(): Promise<boolean> {
    return await this.hasRole('admin');
  }

  // Verificar si el usuario puede editar (admin o coordinador)
  async canEdit(): Promise<boolean> {
    const user = await this.getUser();
    return user?.role === 'admin' || user?.role === 'coordinador';
  }
}

// Exportar una instancia única
export const authService = new AuthService();
export default authService;
