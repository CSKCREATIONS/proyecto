
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { ApiResponse } from '../services'; 

class ApiService {
  private instance: AxiosInstance; 
  private baseURL: string = 'http://192.168.137.21:5000/api'; 

  constructor() {
    
    this.instance = axios.create({
      baseURL: this.baseURL,          
      timeout: 10000,                 
      headers: {
        'Content-Type': 'application/json', 
      },
    });

    this.setupInterceptors();
  }

  
  private setupInterceptors() {

    this.instance.interceptors.request.use(
      async (config) => {
        if (__DEV__) {
          console.log('🔍 DEBUG - Enviando petición a:', (config.baseURL || '') + (config.url || ''));
          console.log('🔍 DEBUG - Datos enviados:', config.data);
        }
        
        try {
          const token = await AsyncStorage.getItem('token');
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          if (__DEV__) {
            console.warn('Error obteniendo token:', error);
          }
        }
        return config; 
      },
      (error) => {
        if (__DEV__) {
          console.log('❌ Error en interceptor request:', error);
        }
        return Promise.reject(error);
      }
    );

 
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        if (__DEV__) {
          console.log('✅ Respuesta recibida:', response.status, response.data);
        }
        return response; 
      },
      async (error) => {
        if (__DEV__) {
          console.log('❌ Error en respuesta:', error.response?.status, error.response?.data || error.message);
        }
        
        if (error.response?.status === 401) {
          await AsyncStorage.multiRemove(['token', 'user']);
        }
        return Promise.reject(error); 
      }
    );
  }

  async get<T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.get(endpoint, config);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async post<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.post(endpoint, data, config);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async put<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.put(endpoint, data, config);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async delete<T>(endpoint: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.delete(endpoint, config);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async patch<T>(endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await this.instance.patch(endpoint, data, config);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any) {
    let errorInfo;
    
    if (error.response) {
      const { status, data } = error.response;
      errorInfo = {
        success: false,
        message: data.message || `Error ${status}`,
        errors: data.errors || [],
        status,
      };
    } else if (error.request) {
      errorInfo = {
        success: false,
        message: 'Sin conexión al servidor. Verifica tu conexión a internet.',
        errors: ['NETWORK_ERROR'],
      };
    } else {
      errorInfo = {
        success: false,
        message: error.message || 'Error desconocido',
        errors: ['UNKNOWN_ERROR'],
      };
    }

    const customError = new Error(errorInfo.message);
    (customError as any).success = errorInfo.success;
    (customError as any).errors = errorInfo.errors;
    (customError as any).status = errorInfo.status;
    
    return customError;
  }

  setBaseURL(url: string) {
    this.baseURL = url;
    this.instance.defaults.baseURL = url;
  }

  getInstance(): AxiosInstance {
    return this.instance;
  }
}

export const apiService = new ApiService();
export default apiService;
