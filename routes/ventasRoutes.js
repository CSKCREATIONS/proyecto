const express = require('express');
const router = express.Router();
const ventaController = require('../controllers/ventasControllers');
const { check } = require('express-validator');
const { verifyToken } = require('../middlewares/authJwt');
const { checkRole } = require('../middlewares/role');

// Validaciones
const validateVenta = [
  check('nombre').not().isEmpty().withMessage('El nombre es obligatorio'),
  check('ciudad').not().isEmpty().withMessage('La ciudad es obligatoria'),
  check('telefono').not().isEmpty().withMessage('El teléfono es obligatorio'),
  check('correo').isEmail().withMessage('Correo electrónico inválido'),
  check('producto').not().isEmpty().withMessage('El producto es obligatorio'),
  check('cantidad').isNumeric().withMessage('La cantidad debe ser un número'),
  check('fecha_entrega').not().isEmpty().withMessage('La fecha de entrega es obligatoria')
];

/********** RUTAS **********/

// POST - Registrar venta (admin, coordinador, auxiliar)
router.post(
  '/',
  verifyToken,
  checkRole('admin', 'coordinador', 'auxiliar'),
  validateVenta,
  ventaController.createVenta
);

// GET - Obtener todas las ventas
router.get(
  '/',
  verifyToken,
  checkRole('admin', 'coordinador', 'auxiliar'),
  ventaController.getVentas
);

// GET - Obtener venta por ID
router.get(
  '/:id',
  verifyToken,
  checkRole('admin', 'coordinador', 'auxiliar'),
  ventaController.getVentaById
);

// PUT - Actualizar venta
router.put(
  '/:id',
  verifyToken,
  checkRole('admin', 'coordinador'),
  validateVenta,
  ventaController.updateVenta
);

// DELETE - Eliminar venta
router.delete(
  '/:id',
  verifyToken,
  checkRole('admin'),
  ventaController.deleteVenta
);

module.exports = router;
