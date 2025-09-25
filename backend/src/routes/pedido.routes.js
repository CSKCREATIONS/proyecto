const express = require('express');
const router = express.Router();

const {
    getPedidos,
    createPedido,
    getPedidoById,
    updatePedido,
    deletePedido,
    cambiarEstadoPedido,
    actualizarEstadoPedido,
    marcarComoEntregado
} = require('../controllers/pedidoControllers');

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

// CRUD básico
router.get('/', verifyVentasRoles, getPedidos);
router.get('/:id', validateObjectId('id'), verifyVentasRoles, getPedidoById);
router.post('/', verifyVentasRoles, createPedido);
router.put('/:id', validateObjectId('id'), verifyVentasRoles, updatePedido);
router.delete('/:id', validateObjectId('id'), verifyAdmin, deletePedido);

// Rutas específicas para manejo de estados
router.patch('/:id/estado', validateObjectId('id'), verifyVentasRoles, cambiarEstadoPedido);
router.patch('/:id/actualizar-estado', validateObjectId('id'), verifyVentasRoles, actualizarEstadoPedido);
router.patch('/:id/entregar', validateObjectId('id'), verifyVentasRoles, marcarComoEntregado);

module.exports = router;
