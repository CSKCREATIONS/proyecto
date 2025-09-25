import react, {createContext, useContext, useEffect,useState,ReactNode} from "react"
import {authService} from '../services/auth' 
import {User, LoginCredentials, LoginResponse} from '../services'; 
import { promises } from "dns";

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    //funciones de autenticacion
    login:(credentials:LoginCredentials) => Promise<LoginResponse>;
    logout:()=> Promise<void>;
    refresh:()=> Promise<void>;
    
    //verificar permisos granulares
    hasPermission:(permission: string) => boolean;
    canDelete:() => boolean;
    canEdit:() => boolean;
    
    //verificar roles específicos (compatibilidad)
    hasRole:(role:'admin' | 'coordinador') => boolean;
    
    //obtener información del rol
    getRoleName:() => string;
    getRolePermissions:() => string[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
interface AuthProviderProps{
    children:ReactNode
}
export const AuthProvider: React.FC<AuthProviderProps> = ({children}) =>{
    const [user,setUser] = useState<User | null>(null);
    const [isLoading,setIsLoading] = useState<boolean>(true);

    useEffect (() => {
        checkAuthStatus();
    },[]);

    const checkAuthStatus = async () => {
        try {
            setIsLoading(true);

            const isAuth = await authService.isAuthenticated();

            if (isAuth) {
                const isValidToken = await authService.verifyToken();

                if (isValidToken) {
                    const userData = await authService.getCurrentUser();
                    setUser(userData);
                } else {
                    await authService.clearAuthData();
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Error verificando autenticacion: ', error);
            await authService.clearAuthData();
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    //Proceso de inicio de sesion del login 

    const login = async (credentials: LoginCredentials):Promise<LoginResponse> => {
        try {
            setIsLoading(true);

            const response = await authService.login(credentials);
            if (response.success && response.data) {
                setUser(response.data.user);
            }

            return response;
        }catch (error: any) {
            throw error;
        }finally {
            setIsLoading(false);
        }
    };
    //cierre de sesion usuario
    const logout = async (): Promise<void> => {
        try {
            setIsLoading(true);
            await authService.logout();
            setUser(null);
        }catch(error){
            console.warn('Error en logout:', error);
            setUser(null);
        }finally{
            setIsLoading(false);
        }
    };
    //Refresca los datos de usuario actual sin hacer login de nuevo
    const refreshUser = async (): Promise<void> => {
        try {
            if(user) {
                const userData = await authService.getCurrentUser();
                setUser(userData);
            }
        }catch(error) {
            console.warn('Error refrescando usuario', error);
            await logout();
        }
    };
    //verificar permiso específico
    const hasPermission = (permission: string): boolean => {
        if (!user?.role || typeof user.role !== 'object') {
            return false;
        }

        // Si es Administrador, tiene todos los permisos
        if (user.role.name === 'Administrador') {
            return true;
        }

        // Si el rol está deshabilitado
        if (user.role.enabled === false) {
            return false;
        }

        // Verificar si el permiso está en la lista de permisos del rol
        const permissions = user.role.permissions || [];
        return permissions.includes(permission);
    };

    // Obtener nombre del rol
    const getRoleName = (): string => {
        if (typeof user?.role === 'object' && user.role?.name) {
            return user.role.name;
        }
        return user?.role?.toString() || 'Sin rol';
    };

    // Obtener permisos del rol
    const getRolePermissions = (): string[] => {
        if (typeof user?.role === 'object' && user.role?.permissions) {
            return user.role.permissions;
        }
        return [];
    };

    //permisos de eliminar solo admin
    const canDelete = ():boolean => {
        return hasPermission('usuarios.eliminar') || 
               hasPermission('productos.eliminar') || 
               hasPermission('categorias.eliminar') || 
               hasPermission('subcategorias.eliminar') ||
               hasRole('admin'); // Compatibilidad
    };

    //permisos de edicion
    const canEdit = ():boolean => {
        const editPermissions = [
            'productos.editar', 'productos.crear',
            'categorias.editar', 'categorias.crear', 
            'subcategorias.editar', 'subcategorias.crear',
            'usuarios.editar', 'usuarios.crear'
        ];
        
        return editPermissions.some(permission => hasPermission(permission)) ||
               hasRole('admin') || hasRole('coordinador'); // Compatibilidad
    };
    
    //verificar rol especifico (para compatibilidad con código existente)
    const hasRole = (role: 'admin' | 'coordinador'):boolean => {
        // El rol siempre es un objeto Role según nuestras interfaces actualizadas
        if (typeof user?.role === 'object' && user.role !== null) {
            const roleName = user.role.name?.toLowerCase();
            
            if (role === 'admin') {
                return roleName === 'administrador';
            }
            
            if (role === 'coordinador') {
                return roleName === 'encargado de inventario' || 
                       roleName === 'vendedor' ||
                       roleName === 'jefe de compras';
            }
        }
        
        // Ya no necesitamos esta comparación porque user.role siempre es un objeto Role
        return false;
    };

    const isAuthenticated = !!user;
    //Datos de las funciones que estaran disponibles en app
    const value: AuthContextType = {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refresh: refreshUser, // Corregido: cambiar 'refreshUser' por 'refresh'
        hasPermission,
        canDelete,
        canEdit,
        hasRole,
        getRoleName,
        getRolePermissions,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>; // Corregido: agregar el return
};
export const useAuth = ():AuthContextType => {
    const context = useContext(AuthContext);
    if(context === undefined) {
        throw new Error('useAuth debe ser usudo dentro de un AuthProvider');
    }
    return context;
};

export { AuthContext };
export default AuthProvider;
