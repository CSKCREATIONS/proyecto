const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authJwt');
const { checkRole } = require('../middlewares/role');
const cotizacionController = require('../controllers/cotizacionControllers');
const Cotizacion = require('../models/cotizaciones'); // ajusta la ruta si es diferente
const { checkPermission } = require('../middlewares/role');

// ✅ Crear cotización
router.post('/',
  verifyToken,
  checkPermission('cotizaciones.crear'),
  cotizacionController.createCotizacion
);

// Obtener la cotización más reciente de un cliente por su ID (cliente _id)
router.get('/cliente/:id',
   verifyToken,
     checkPermission('cotizaciones.ver'),
    async (req, res) => {
  try {
    const cotizacion = await Cotizacion.findOne({ cliente: req.params.id })
      .sort({ createdAt: -1 }) // más reciente
      .populate('productos.producto'); // <-- ¡Esto es esencial!

    res.json(cotizacion);
  } catch (err) {
    console.error('Error al obtener cotización:', err);
    res.status(500).json({ message: 'Error al obtener cotización' });
  }
});

router.get('/ultima',
  verifyToken,
  checkPermission('cotizaciones.ver'),
  cotizacionController.getUltimaCotizacionPorCliente
);

router.get('/',
  verifyToken,
  checkPermission('cotizaciones.ver'),
  cotizacionController.getCotizaciones
);



// ✅ Obtener todas las cotizaciones con populate
// Obtener todas las cotizaciones


// GET /api/cotizaciones/:id
router.get('/:id',
  verifyToken,
    checkPermission('cotizaciones.ver'),
   async (req, res) => {
  try {
    const cotizacion = await Cotizacion.findById(req.params.id)
      .populate('cliente')
      .populate('productos.producto'); // Asegura que los productos vengan completos

    if (!cotizacion) {
      return res.status(404).json({ message: 'Cotización no encontrada' });
    }

    res.json(cotizacion);
  } catch (err) {
    console.error('Error al buscar cotización:', err);
    res.status(500).json({ message: 'Error al obtener la cotización' });
  }
});


// ✅ Actualizar cotización
router.put('/:id',
  verifyToken,
    checkPermission('cotizaciones.editar'),
  cotizacionController.updateCotizacion
);

exports.updateCotizacion = async (req, res) => {
  try {
    const cotizacion = await Cotizacion.findById(req.params.id);
    if (!cotizacion) return res.status(404).json({ message: 'Cotización no encontrada' });

    // Actualizar datos de cotización
    cotizacion.descripcion = req.body.descripcion;
    cotizacion.condicionesPago = req.body.condicionesPago;
    cotizacion.productos = req.body.productos;

    // Actualizar cliente si se incluye
    if (req.body.cliente && typeof req.body.cliente === 'object') {
      await Cliente.findByIdAndUpdate(cotizacion.cliente, {
        nombre: req.body.cliente.nombre,
        telefono: req.body.cliente.telefono,
        ciudad: req.body.cliente.ciudad,
        correo: req.body.cliente.correo,
      });
    }

    await cotizacion.save();

    res.status(200).json({ message: 'Cotización actualizada', data: cotizacion });
  } catch (error) {
    console.error('Error al actualizar cotización:', error);
    res.status(500).json({ message: 'Error al actualizar cotización', error: error.message });
  }
};



// ✅ Eliminar cotización
router.delete('/:id',
  verifyToken,
    checkPermission('cotizaciones.eliminar'),
  cotizacionController.deleteCotizacion // Usa el controlador si ya lo tienes
);



module.exports = router;