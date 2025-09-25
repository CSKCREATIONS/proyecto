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
router.get('/stats', getProveedorStats);

// Proveedores activos (para selección en formularios) - Sin restricciones especiales
router.get('/activos', getProveedoresActivos);

// CRUD básico
router.get('/', getProveedores);
router.get('/:id', getProveedorById);
router.post('/', createProveedor);
router.put('/:id', updateProveedor);
router.delete('/:id', verifyAdmin, deleteProveedor);

// Activar/desactivar proveedor
router.patch('/:id/activar', activateProveedor);
router.patch('/:id/desactivar', deactivateProveedor);
router.patch('/:id/toggle-status', toggleProveedorStatus);

module.exports = router;