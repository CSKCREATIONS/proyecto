const express = require('express');
const router = express.Router();

const {
    createCotizacion,
    getCotizaciones,
    getCotizacionById,
    updateCotizacion,
    deleteCotizacion,
    updateEstadoCotizacion,
    getUltimaCotizacionPorCliente
} = require('../controllers/cotizacionControllers');

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

// Obtener última cotización por cliente
router.get('/cliente/ultima', verifyVentasRoles, getUltimaCotizacionPorCliente);

// CRUD básico
router.get('/', verifyVentasRoles, getCotizaciones);
router.get('/test', (req, res) => {
  console.log('🧪 Ruta de prueba /test llamada');
  res.json({
    success: true,
    message: 'Ruta de prueba funcionando',
    data: [
      {
        _id: 'test1',
        cliente: { nombre: 'Cliente Test' },
        fecha: new Date(),
        descripcion: 'Cotización de prueba'
      }
    ],
    total: 1
  });
}); // Ruta temporal de prueba estática
router.get('/:id', validateObjectId('id'), verifyVentasRoles, getCotizacionById);
router.post('/', verifyVentasRoles, createCotizacion);
router.put('/:id', validateObjectId('id'), verifyVentasRoles, updateCotizacion);
router.delete('/:id', validateObjectId('id'), verifyAdmin, deleteCotizacion);

// Actualizar estado de cotización
router.patch('/:id/estado', validateObjectId('id'), verifyVentasRoles, updateEstadoCotizacion);

module.exports = router;
