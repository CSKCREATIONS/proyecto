const express = require('express');
const router = express.Router();

const {
    createCompra,
    getComprasPorProveedor,
    getCompras,
    deleteCompra,
    updateCompra,
    getCompraStats
} = require('../controllers/compraController');

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

// Estadísticas de compras
router.get('/stats', verifyComprasRoles, getCompraStats);

// Obtener compras por proveedor
router.get('/proveedor/:id', validateObjectId('id'), verifyComprasRoles, getComprasPorProveedor);

// CRUD básico
router.get('/', verifyComprasRoles, getCompras);
router.post('/', verifyComprasRoles, createCompra);
router.put('/:id', validateObjectId('id'), verifyComprasRoles, updateCompra);
router.delete('/:id', validateObjectId('id'), verifyAdmin, deleteCompra);

module.exports = router;
