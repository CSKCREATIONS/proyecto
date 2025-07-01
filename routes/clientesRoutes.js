const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const clienteController = require('../controllers/clienteControllers');
const { verifyToken } = require('../middlewares/authJwt');
const { checkRole } = require('../middlewares/role');

// Validaciones para crear/actualizar cliente
const validateCliente = [
    check('nombre').not().isEmpty().withMessage('El nombre es obligatorio'),
    check('correo').isEmail().withMessage('Debe proporcionar un correo válido'),
    check('telefono').not().isEmpty().withMessage('El teléfono es obligatorio'),
    check('direccion').not().isEmpty().withMessage('La dirección es obligatoria'),
    check('ciudad').not().isEmpty().withMessage('La ciudad es obligatoria'),

];


// RUTAS

// POST /api/clientes - Crear cliente (solo admin y coordinador)
router.post('/',
    verifyToken,
    checkRole('admin', 'coordinador'),
    validateCliente,
    clienteController.createCliente
);

// GET /api/clientes - Obtener todos los clientes (admin, coordinador, auxiliar)
router.get('/', verifyToken, checkRole('admin', 'coordinador', 'auxiliar'), clienteController.getClientes);

// GET /api/clientes/:id - Obtener cliente por ID
router.get('/:id',
    verifyToken,
    checkRole('admin', 'coordinador', 'auxiliar'),
    clienteController.getClienteById
);


// PUT /api/clientes/:id - Actualizar cliente
router.put('/:id',
    verifyToken,
    checkRole('admin', 'coordinador'),
    validateCliente,
    clienteController.updateCliente
);

// DELETE /api/clientes/:id - Eliminar cliente (solo admin)
router.delete('/:id',
    verifyToken,
    checkRole('admin'),
    clienteController.deleteCliente
);

module.exports = router;
