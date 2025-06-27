const express = require('express');
const router = express.Router();
const cotizacionController = require('../controllers/cotizacionController');
const { check } = require('express-validator');
const { verifyToken } = require('../middlewares/authJwt');
const { checkRole } = require('../middlewares/role');

// Validaciones
const validateCotizacion = [
  check('cliente').notEmpty().withMessage('El cliente es obligatorio'),
  check('proveedor').notEmpty().withMessage('El proveedor es obligatorio'),
  check('productos').isArray({ min: 1 }).withMessage('Debe incluir al menos un producto'),
  check('productos.*.producto').notEmpty().withMessage('El ID del producto es obligatorio'),
  check('productos.*.cantidad').isNumeric().withMessage('La cantidad debe ser un número'),
  check('productos.*.precioUnitario').isNumeric().withMessage('El precio unitario debe ser un número')
];


// Crear cotización - solo admin o coordinador
router.post('/',
  verifyToken,
  checkRole('admin', 'coordinador'),
  validateCotizacion,
  cotizacionController.createCotizacion
);

// Obtener todas las cotizaciones - todos los roles
router.get('/',
  verifyToken,
  checkRole('admin', 'coordinador', 'auxiliar'),
  cotizacionController.getCotizaciones
);

// Obtener cotización por ID
router.get('/:id',
  verifyToken,
  checkRole('admin', 'coordinador', 'auxiliar'),
  cotizacionController.getCotizacionById
);

// Actualizar cotización - admin o coordinador
router.put('/:id',
  verifyToken,
  checkRole('admin', 'coordinador'),
  validateCotizacion,
  cotizacionController.updateCotizacion
);

// Eliminar cotización - solo admin
router.delete('/:id',
  verifyToken,
  checkRole('admin'),
  cotizacionController.deleteCotizacion
);

// Cambiar estado de cotización (aprobada, rechazada)
router.patch('/:id/estado',
  verifyToken,
  checkRole('admin', 'coordinador'),
  [
    check('estado').isIn(['pendiente', 'aprobada', 'rechazada']).withMessage('Estado inválido')
  ],
  cotizacionController.updateEstadoCotizacion
);

module.exports = router;
