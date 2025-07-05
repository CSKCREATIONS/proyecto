const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/authJwt');
const { checkRole } = require('../middlewares/role');
const cotizacionController = require('../controllers/cotizacionControllers');

// ✅ Crear cotización
router.post('/',
  verifyToken,
  cotizacionController.createCotizacion
);

// Obtener la cotización más reciente de un cliente por su ID (cliente _id)
router.get('/cliente/:id', verifyToken,  async (req, res) => {
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
  cotizacionController.getUltimaCotizacionPorCliente
);



// ✅ Obtener todas las cotizaciones con populate
router.get('/',
  verifyToken,
  cotizacionController.getCotizaciones
);

// ✅ Eliminar cotización
router.delete('/:id',
  verifyToken,
  cotizacionController.deleteCotizacion // Usa el controlador si ya lo tienes
);



module.exports = router;
