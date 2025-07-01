const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authJwt');
const { checkRole } = require('../middlewares/role');
const cotizacionController = require('../controllers/cotizacionControllers');

// ✅ Crear cotización
router.post('/',
  verifyToken,
  checkRole('admin', 'coordinador'),
  cotizacionController.createCotizacion
);

// ✅ Obtener todas las cotizaciones con populate
router.get('/',
  verifyToken,
  checkRole('admin', 'coordinador'),
  cotizacionController.getCotizaciones
);

// ✅ Eliminar cotización
router.delete('/:id',
  verifyToken,
  checkRole('admin', 'coordinador'),
  cotizacionController.deleteCotizacion // Usa el controlador si ya lo tienes
);

module.exports = router;
