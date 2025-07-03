// controllers/permissionController.js
const PERMISOS = require('../config/permissions.config');

const getAllPermissions = (req, res) => {
  try {
    res.json({
      success: true,
      permisos: PERMISOS
    });
  } catch (error) {
    console.error('Error obteniendo permisos:', error);
    res.status(500).json({ success: false, message: 'Error al obtener permisos.' });
  }
};

module.exports = { getAllPermissions };
