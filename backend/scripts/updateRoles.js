const mongoose = require('mongoose');
const Role = require('../src/models/Role');

// Configurar conexión a MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pangea1';

// Definir roles y sus permisos
const rolesConfig = [
  {
    name: 'Administrador',
    description: 'Acceso completo a todo el sistema',
    permissions: [
      // Usuarios
      'usuarios.ver', 'usuarios.crear', 'usuarios.editar', 'usuarios.eliminar',
      // Categorías
      'categorias.ver', 'categorias.crear', 'categorias.editar', 'categorias.eliminar',
      // Subcategorías
      'subcategorias.ver', 'subcategorias.crear', 'subcategorias.editar', 'subcategorias.eliminar',
      // Productos
      'productos.ver', 'productos.crear', 'productos.editar', 'productos.eliminar',
      // Clientes
      'clientes.ver', 'clientes.crear', 'clientes.editar', 'clientes.eliminar',
      // Proveedores
      'proveedores.ver', 'proveedores.crear', 'proveedores.editar', 'proveedores.eliminar',
      // Ventas
      'ventas.ver', 'ventas.crear', 'ventas.editar', 'ventas.eliminar',
      // Compras
      'compras.ver', 'compras.crear', 'compras.editar', 'compras.eliminar',
      // Cotizaciones
      'cotizaciones.ver', 'cotizaciones.crear', 'cotizaciones.editar', 'cotizaciones.eliminar',
      // Pedidos
      'pedidos.ver', 'pedidos.crear', 'pedidos.editar', 'pedidos.eliminar',
      // Reportes
      'reportes.ver', 'reportes.productos', 'reportes.ventas', 'reportes.compras'
    ],
    enabled: true
  },
  {
    name: 'Gerente',
    description: 'Acceso a reportes y supervisión general',
    permissions: [
      // Ver usuarios
      'usuarios.ver',
      // Productos
      'productos.ver', 'productos.crear', 'productos.editar',
      'categorias.ver', 'categorias.crear', 'categorias.editar',
      'subcategorias.ver', 'subcategorias.crear', 'subcategorias.editar',
      // Clientes y proveedores
      'clientes.ver', 'clientes.crear', 'clientes.editar',
      'proveedores.ver', 'proveedores.crear', 'proveedores.editar',
      // Ventas
      'ventas.ver', 'ventas.crear', 'ventas.editar',
      'cotizaciones.ver', 'cotizaciones.crear', 'cotizaciones.editar',
      'pedidos.ver', 'pedidos.crear', 'pedidos.editar',
      // Compras
      'compras.ver', 'compras.crear', 'compras.editar',
      // Reportes completos
      'reportes.ver', 'reportes.productos', 'reportes.ventas', 'reportes.compras'
    ],
    enabled: true
  },
  {
    name: 'Vendedor',
    description: 'Acceso a ventas y gestión de clientes',
    permissions: [
      // Productos (solo ver)
      'productos.ver', 'categorias.ver', 'subcategorias.ver',
      // Clientes
      'clientes.ver', 'clientes.crear', 'clientes.editar',
      // Ventas
      'ventas.ver', 'ventas.crear', 'ventas.editar',
      'cotizaciones.ver', 'cotizaciones.crear', 'cotizaciones.editar',
      'pedidos.ver', 'pedidos.crear', 'pedidos.editar',
      // Reportes básicos
      'reportes.ver', 'reportes.ventas'
    ],
    enabled: true
  },
  {
    name: 'Encargado de inventario',
    description: 'Gestión de productos e inventario',
    permissions: [
      // Productos completos
      'productos.ver', 'productos.crear', 'productos.editar',
      'categorias.ver', 'categorias.crear', 'categorias.editar',
      'subcategorias.ver', 'subcategorias.crear', 'subcategorias.editar',
      // Proveedores
      'proveedores.ver', 'proveedores.crear', 'proveedores.editar',
      // Compras
      'compras.ver', 'compras.crear', 'compras.editar',
      // Ver ventas para control de stock
      'ventas.ver', 'pedidos.ver',
      // Reportes de productos
      'reportes.ver', 'reportes.productos', 'reportes.compras'
    ],
    enabled: true
  },
  {
    name: 'Jefe de compras',
    description: 'Gestión de compras y proveedores',
    permissions: [
      // Productos (ver)
      'productos.ver', 'categorias.ver', 'subcategorias.ver',
      // Proveedores completos
      'proveedores.ver', 'proveedores.crear', 'proveedores.editar',
      // Compras completas
      'compras.ver', 'compras.crear', 'compras.editar',
      // Ver ventas para planificación
      'ventas.ver', 'pedidos.ver',
      // Reportes de compras
      'reportes.ver', 'reportes.productos', 'reportes.compras'
    ],
    enabled: true
  },
  {
    name: 'Venta',
    description: 'Acceso básico a ventas',
    permissions: [
      // Productos (solo ver)
      'productos.ver', 'categorias.ver', 'subcategorias.ver',
      // Clientes básico
      'clientes.ver', 'clientes.crear',
      // Ventas básicas
      'ventas.ver', 'ventas.crear',
      'cotizaciones.ver', 'cotizaciones.crear',
      'pedidos.ver', 'pedidos.crear'
    ],
    enabled: true
  }
];

async function updateRoles() {
  try {
    console.log('🔗 Conectando a MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado a MongoDB');

    console.log('🔄 Actualizando roles...');

    for (const roleConfig of rolesConfig) {
      const existingRole = await Role.findOne({ name: roleConfig.name });
      
      if (existingRole) {
        // Actualizar rol existente
        await Role.findByIdAndUpdate(existingRole._id, {
          description: roleConfig.description,
          permissions: roleConfig.permissions,
          enabled: roleConfig.enabled
        });
        console.log(`✅ Rol actualizado: ${roleConfig.name} (${roleConfig.permissions.length} permisos)`);
      } else {
        // Crear nuevo rol
        await Role.create(roleConfig);
        console.log(`✅ Rol creado: ${roleConfig.name} (${roleConfig.permissions.length} permisos)`);
      }
    }

    console.log('🎉 Todos los roles han sido actualizados exitosamente!');
    
    // Mostrar resumen de roles
    const allRoles = await Role.find({});
    console.log('\n📋 RESUMEN DE ROLES:');
    allRoles.forEach(role => {
      console.log(`   ${role.name}: ${role.permissions.length} permisos - ${role.enabled ? 'Habilitado' : 'Deshabilitado'}`);
    });

  } catch (error) {
    console.error('❌ Error actualizando roles:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Conexión cerrada');
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  updateRoles();
}

module.exports = updateRoles;