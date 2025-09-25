//Tipos de navegacion especial
export type RootStackParamList = {
    Login: undefined;
    Main: undefined;
    Users: undefined;
    Categories: undefined;
    Subcategories: undefined;
    Products: undefined;
    ProductReports: undefined;
    PurchaseReports: undefined;
    SalesReports: undefined;
    Clientes: undefined;
    Proveedores: undefined;
    Cotizaciones: undefined;
    Pedidos: undefined;
    Compras: undefined;
    Ventas: undefined;
}

export type MainTabParamList = {
    Home: undefined;
    Profile: undefined;
}

// Declaración global para React Navigation
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

//Tipos adicionales
export type UsersStackParamList = {
    UsersList:undefined;
    userDetail:undefined;
    userCreate:undefined;
    UserEdit:undefined
}

export type CategoryStackParamList = {
    CategoriesList:undefined;
    CategoryDetail:{categoryId: string};
    CategoryCreate:undefined;
    CategoryEdit:{categoryId: string};
}

export type SubcategoryStackParamList = {
    SubcategoriesList:undefined;
    SubcategoryDetail:{subcategoryId: string};
    SubcategoryCreate:undefined;
    SubcategoryEdit:{subcategoryId: string};
}

export type ProductsStackParamList = {
    ProductsList:undefined;
    ProductDetail:{ProductId: string};
    ProductCreate:undefined;
    ProductEdit:{ProductId: string};
}

export type ProfileStackParamList = {
    ProfileMain: undefined;
    ChangePassword: undefined;
    EditProfile:undefined
}
