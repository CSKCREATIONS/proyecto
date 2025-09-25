const express = require('express');
const router = express.Router();

const {
    getProveedores,
    getProveedorById,
    createProveedor,
    updateProveedor,
    deleteProveedor,
    deactivateProveedor,
    activateProveedor,
    getProveedoresActivos,
    toggleProveedorStatus,
    getProveedorStats
} = require('../controllers/proveedorControllers');

// Middleware de autenticación
const {
    verifyToken,
    verifyAdmin,
    verifyComprasRoles
} = require('../middleware/auth');

// Middleware de validación
const { validateObjectId } = require('../middleware/errorHandler');

// Proteger todas las rutas
router.use(verifyToken);

// Estadísticas de proveedores
router.get('/stats', verifyComprasRoles, getProveedorStats);

// Proveedores activos (para selección en formularios)
router.get('/activos', verifyComprasRoles, getProveedoresActivos);

// Proteger todas las rutas siguientes
// router.use(verifyToken);

// CRUD básico
router.get('/', verifyComprasRoles, getProveedores);
router.get('/:id', validateObjectId('id'), verifyComprasRoles, getProveedorById);
router.post('/', verifyComprasRoles, createProveedor);
router.put('/:id', validateObjectId('id'), verifyComprasRoles, updateProveedor);
router.delete('/:id', validateObjectId('id'), verifyAdmin, deleteProveedor);

// Activar/desactivar proveedor
router.patch('/:id/activar', validateObjectId('id'), verifyComprasRoles, activateProveedor);
router.patch('/:id/desactivar', validateObjectId('id'), verifyComprasRoles, deactivateProveedor);
router.patch('/:id/toggle-status', validateObjectId('id'), verifyComprasRoles, toggleProveedorStatus);

module.exports = router;
