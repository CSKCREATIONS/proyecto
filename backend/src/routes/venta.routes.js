const express = require('express');
const router = express.Router();

const {
    getVentas,
    getVentaById,
    deleteVenta,
    createVenta,
    getVentaStats
} = require('../controllers/ventasControllers');

// Middleware de autenticación
const {
    verifyToken,
    verifyAdmin,
    verifyVentasRoles
} = require('../middleware/auth');

// Middleware de validación
const { validateObjectId } = require('../middleware/errorHandler');

// Proteger todas las rutas
router.use(verifyToken);

// Estadísticas de ventas
router.get('/stats', verifyVentasRoles, getVentaStats);

// CRUD básico
router.get('/', verifyVentasRoles, getVentas);
router.get('/:id', validateObjectId('id'), verifyVentasRoles, getVentaById);
router.post('/', verifyVentasRoles, createVenta);
router.delete('/:id', validateObjectId('id'), verifyAdmin, deleteVenta);

module.exports = router;
