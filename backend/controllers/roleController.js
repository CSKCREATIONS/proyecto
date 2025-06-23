const Role = require('../models/Role');

exports.createRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ success: false, message: 'Nombre del rol requerido' });
    }

    // Validación básica de permisos
    if (!Array.isArray(permissions)) {
      return res.status(400).json({ success: false, message: 'Permisos deben ser un arreglo' });
    }

    const existing = await Role.findOne({ name });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Rol ya existe' });
    }

    const newRole = new Role({ name, permissions });
    await newRole.save();

    res.status(201).json({ success: true, message: 'Rol creado', data: newRole });
  } catch (error) {
    console.error('[RoleController] Error al crear rol:', error);
    res.status(500).json({ success: false, message: 'Error interno', error: error.message });
  }
};

exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).json({
      success: true,
      data: roles
    });
  } catch (error) {
    console.error('Error al obtener roles:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
};
