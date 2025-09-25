const Role = require('../models/Role');

// Obtener todos los roles
const getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find({ enabled: true })
            .select('_id name description permissions')
            .sort({ name: 1 });

        res.json({
            success: true,
            data: roles
        });
    } catch (error) {
        console.error('Error al obtener roles:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Obtener un rol por ID
const getRoleById = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await Role.findById(id);

        if (!role) {
            return res.status(404).json({
                success: false,
                message: 'Rol no encontrado'
            });
        }

        res.json({
            success: true,
            data: role
        });
    } catch (error) {
        console.error('Error al obtener rol:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Crear un nuevo rol
const createRole = async (req, res) => {
    try {
        const { name, description, permissions } = req.body;

        // Validar datos requeridos
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'El nombre del rol es requerido'
            });
        }

        // Verificar si ya existe un rol con el mismo nombre
        const existingRole = await Role.findOne({ name });
        if (existingRole) {
            return res.status(409).json({
                success: false,
                message: 'Ya existe un rol con ese nombre'
            });
        }

        const role = new Role({
            name,
            description,
            permissions: permissions || []
        });

        const savedRole = await role.save();

        res.status(201).json({
            success: true,
            data: savedRole,
            message: 'Rol creado exitosamente'
        });
    } catch (error) {
        console.error('Error al crear rol:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Actualizar un rol
const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, permissions, enabled } = req.body;

        const role = await Role.findById(id);
        if (!role) {
            return res.status(404).json({
                success: false,
                message: 'Rol no encontrado'
            });
        }

        // Si se está cambiando el nombre, verificar que no exista otro con el mismo nombre
        if (name && name !== role.name) {
            const existingRole = await Role.findOne({ name, _id: { $ne: id } });
            if (existingRole) {
                return res.status(409).json({
                    success: false,
                    message: 'Ya existe un rol con ese nombre'
                });
            }
        }

        // Actualizar campos
        if (name) role.name = name;
        if (description !== undefined) role.description = description;
        if (permissions) role.permissions = permissions;
        if (enabled !== undefined) role.enabled = enabled;

        const updatedRole = await role.save();

        res.json({
            success: true,
            data: updatedRole,
            message: 'Rol actualizado exitosamente'
        });
    } catch (error) {
        console.error('Error al actualizar rol:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Eliminar un rol (soft delete)
const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;

        const role = await Role.findById(id);
        if (!role) {
            return res.status(404).json({
                success: false,
                message: 'Rol no encontrado'
            });
        }

        // En lugar de eliminar, deshabilitamos el rol
        role.enabled = false;
        await role.save();

        res.json({
            success: true,
            message: 'Rol eliminado exitosamente'
        });
    } catch (error) {
        console.error('Error al eliminar rol:', error);
        res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

// Inicializar roles básicos del sistema
const initializeRoles = async (req, res) => {
    try {
        const defaultRoles = [
            {
                name: 'Administrador',
                description: 'Acceso total al sistema',
                permissions: [
                    'usuarios.ver', 'usuarios.crear', 'usuarios.editar', 'usuarios.eliminar',
                    'productos.ver', 'productos.crear', 'productos.editar', 'productos.eliminar',
                    'categorias.ver', 'categorias.crear', 'categorias.editar', 'categorias.eliminar',
                    'subcategorias.ver', 'subcategorias.crear', 'subcategorias.editar', 'subcategorias.eliminar',
                    'proveedores.ver', 'proveedores.crear', 'proveedores.editar', 'proveedores.eliminar',
                    'clientes.ver', 'clientes.crear', 'clientes.editar', 'clientes.eliminar',
                    'compras.ver', 'compras.crear', 'compras.editar', 'compras.eliminar',
                    'ventas.ver', 'ventas.crear', 'ventas.editar', 'ventas.eliminar',
                    'cotizaciones.ver', 'cotizaciones.crear', 'cotizaciones.editar', 'cotizaciones.eliminar',
                    'pedidos.ver', 'pedidos.crear', 'pedidos.editar', 'pedidos.eliminar'
                ]
            },
            {
                name: 'Vendedor',
                description: 'Gestión de ventas y clientes',
                permissions: [
                    'productos.ver',
                    'clientes.ver', 'clientes.crear', 'clientes.editar',
                    'ventas.ver', 'ventas.crear', 'ventas.editar',
                    'cotizaciones.ver', 'cotizaciones.crear', 'cotizaciones.editar'
                ]
            },
            {
                name: 'Encargado de inventario',
                description: 'Gestión de productos e inventario',
                permissions: [
                    'productos.ver', 'productos.crear', 'productos.editar',
                    'categorias.ver', 'categorias.crear', 'categorias.editar',
                    'subcategorias.ver', 'subcategorias.crear', 'subcategorias.editar',
                    'proveedores.ver', 'proveedores.crear', 'proveedores.editar',
                    'compras.ver', 'compras.crear', 'compras.editar'
                ]
            },
            {
                name: 'Jefe de compras',
                description: 'Gestión de compras y proveedores',
                permissions: [
                    'productos.ver',
                    'proveedores.ver', 'proveedores.crear', 'proveedores.editar',
                    'compras.ver', 'compras.crear', 'compras.editar', 'compras.eliminar',
                    'pedidos.ver', 'pedidos.crear', 'pedidos.editar'
                ]
            },
            {
                name: 'Gerente',
                description: 'Acceso a reportes y gestión general',
                permissions: [
                    'usuarios.ver', 'usuarios.crear', 'usuarios.editar',
                    'productos.ver', 'productos.crear', 'productos.editar',
                    'categorias.ver', 'categorias.crear', 'categorias.editar',
                    'subcategorias.ver', 'subcategorias.crear', 'subcategorias.editar',
                    'proveedores.ver', 'proveedores.crear', 'proveedores.editar',
                    'clientes.ver', 'clientes.crear', 'clientes.editar',
                    'compras.ver', 'compras.crear', 'compras.editar',
                    'ventas.ver', 'ventas.crear', 'ventas.editar',
                    'cotizaciones.ver', 'cotizaciones.crear', 'cotizaciones.editar',
                    'pedidos.ver', 'pedidos.crear', 'pedidos.editar'
                ]
            }
        ];

        let createdCount = 0;
        const results = [];

        for (const roleData of defaultRoles) {
            const existingRole = await Role.findOne({ name: roleData.name });
            if (!existingRole) {
                const role = new Role(roleData);
                await role.save();
                results.push(role);
                createdCount++;
            } else {
                results.push(existingRole);
            }
        }

        res.json({
            success: true,
            message: `Inicialización completada. ${createdCount} roles creados.`,
            data: results
        });
    } catch (error) {
        console.error('Error al inicializar roles:', error);
        res.status(500).json({
            success: false,
            message: 'Error al inicializar roles'
        });
    }
};

module.exports = {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole,
    initializeRoles
};