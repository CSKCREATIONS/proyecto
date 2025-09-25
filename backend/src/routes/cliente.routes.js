const express = require('express');
const router = express.Router();

const {
    getClientes,
    getClienteById,
    createCliente,
    updateCliente,
    deleteCliente,
    getClientesConEstado,
    toggleClienteStatus,
    getClientesActivos,
    getClienteStats
} = require('../controllers/clienteControllers');

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

// Estadísticas de clientes
router.get('/stats', verifyVentasRoles, getClienteStats);

// Obtener clientes activos (para selección en formularios)
router.get('/activos', verifyVentasRoles, getClientesActivos);

// Obtener clientes con estado de pedidos
router.get('/con-estado', verifyVentasRoles, getClientesConEstado);

// CRUD básico
router.get('/', verifyVentasRoles, getClientes);
router.get('/:id', validateObjectId('id'), verifyVentasRoles, getClienteById);
router.post('/', verifyVentasRoles, createCliente);
router.put('/:id', validateObjectId('id'), verifyVentasRoles, updateCliente);
router.delete('/:id', validateObjectId('id'), verifyAdmin, deleteCliente);

// Toggle status
router.patch('/:id/toggle-status', validateObjectId('id'), verifyVentasRoles, toggleClienteStatus);

module.exports = router;
