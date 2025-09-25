
export interface Role {
  _id: string;
  name: 'Administrador' | 'Vendedor' | 'Jefe de compras' | 'Encargado de inventario' | 'Gerente' | 'Venta';
  permissions: string[];
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
  description?: string;
  __v?: number;
}

export interface User {
  _id: string;                           // ID único del usuario
  username: string;                      // Nombre de usuario único
  email: string;                         // Email del usuario
  firstName: string;                     // Primer nombre
  lastName: string;                      // Apellido
  role: Role;                            // Rol del usuario (siempre objeto completo)
  phone?: string;                        // Teléfono opcional
  isActive: boolean;                     // Estado activo/inactivo
  lastLogin?: string;                    // Último inicio de sesión (opcional)
  createdAt: string;                     // Fecha de creación
  updatedAt: string;                     // Fecha de última actualización
  createdBy?: string;                    // Usuario que lo creó
  fullName?: string;                     // Nombre completo (opcional, calculado)
}

export interface LoginCredentials {
  email: string;                         // Email o username
  password: string;                      // Contraseña del usuario
}


export interface LoginResponse {
  success: boolean;                      // Indica si el login fue exitoso
  message: string;                       // Mensaje descriptivo
  data: {
    user: User;                          // Datos del usuario autenticado
    token: string;                       // Token JWT para autenticación
    expiresIn: string;                   // Tiempo de expiración del token
  };
}

// 📂 INTERFAZ DE CATEGORÍA
// Define la estructura de datos de una categoría de productos
export interface Category {
  _id: string;                           // ID único de la categoría
  name: string;                          // Nombre de la categoría
  description?: string;                  // Descripción opcional
  slug: string;                          // URL amigable
  isActive: boolean;                     // Estado activo/inactivo
  icon?: string;                         // Icono opcional para la UI
  color?: string;                        // Color opcional para la UI
  sortOrder: number;                     // Orden de visualización
  createdBy: string;                     // ID del usuario que la creó
  updatedBy?: string;                    // ID del último usuario que la modificó
  createdAt: string;                     // Fecha de creación
  updatedAt: string;                     // Fecha de última actualización
  subcategoriesCount?: number;           // Conteo de subcategorías (virtual)
  productsCount?: number;                // Conteo de productos (virtual)
}

// 📁 INTERFAZ DE SUBCATEGORÍA
export interface Subcategory {
  _id: string;
  name: string;
  description?: string;
  slug: string;
  category: Category | string;
  isActive: boolean;
  icon?: string;
  color?: string;
  sortOrder: number;
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
  productsCount?: number;
}

export interface ProductImage {
  url: string;
  alt?: string;
  isPrimary: boolean;
}

export interface ProductStock {
  quantity: number;
  minStock: number;
  trackStock: boolean;
}

export interface ProductDimensions {
  weight?: number;
  length?: number;
  width?: number;
  height?: number;
}

export interface Product {
  _id: string;
  name: string;
  description?: string;
  shortDescription?: string;
  slug: string;
  sku: string;
  category: Category | string;
  subcategory: Subcategory | string;
  price: number;
  comparePrice?: number;
  cost?: number;
  stock: ProductStock;
  dimensions?: ProductDimensions;
  images: ProductImage[];
  tags: string[];
  isActive: boolean;
  isFeatured: boolean;
  isDigital: boolean;
  sortOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  createdBy: string;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
  profitMargin?: number;
  isLowStock?: boolean;
  isOutOfStock?: boolean;
  primaryImage?: ProductImage;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  errors?: string[];
}

export interface CreateUserData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string; // ID del rol
  phone?: string;
  isActive?: boolean;
}

export interface UpdateUserData {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string; // ID del rol
  phone?: string;
  isActive?: boolean;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface CreateSubcategoryData {
  name: string;
  description?: string;
  category: string;
  icon?: string;
  color?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateSubcategoryData {
  name?: string;
  description?: string;
  category?: string;
  icon?: string;
  color?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface CreateProductData {
  name: string;
  description?: string;
  shortDescription?: string;
  sku: string;
  category: string;
  subcategory: string;
  price: number;
  comparePrice?: number;
  cost?: number;
  stock?: ProductStock;
  dimensions?: ProductDimensions;
  images?: ProductImage[];
  tags?: string[];
  isActive?: boolean;
  isFeatured?: boolean;
  isDigital?: boolean;
  sortOrder?: number;
  seoTitle?: string;
  seoDescription?: string;
}

export interface UpdateProductData {
  name?: string;
  description?: string;
  shortDescription?: string;
  sku?: string;
  category?: string;
  subcategory?: string;
  price?: number;
  comparePrice?: number;
  cost?: number;
  stock?: ProductStock;
  dimensions?: ProductDimensions;
  images?: ProductImage[];
  tags?: string[];
  isActive?: boolean;
  isFeatured?: boolean;
  isDigital?: boolean;
  sortOrder?: number;
  seoTitle?: string;
  seoDescription?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: () => boolean;
  
  // Permisos granulares
  hasPermission: (permission: string) => boolean;
  getRoleName: () => string;
  getRolePermissions: () => string[];
  
  // Compatibilidad con código existente
  hasRole: (role: 'admin' | 'coordinador') => boolean;
  canDelete: () => boolean;
  canEdit: () => boolean;
}

// Tipos para navegación
export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Users: undefined;
  Categories: undefined;
  Subcategories: undefined;
  Products: undefined;
  Profile: undefined;
};

export type UsersStackParamList = {
  UsersList: undefined;
  UserDetail: { userId: string };
  UserForm: { userId?: string };
};

export type CategoriesStackParamList = {
  CategoriesList: undefined;
  CategoryDetail: { categoryId: string };
  CategoryForm: { categoryId?: string };
};

export type SubcategoriesStackParamList = {
  SubcategoriesList: undefined;
  SubcategoryDetail: { subcategoryId: string };
  SubcategoryForm: { subcategoryId?: string };
};

export type ProductsStackParamList = {
  ProductsList: undefined;
  ProductDetail: { productId: string };
  ProductForm: { productId?: string };
};
