const express = require('express');
const router = express.Router();
const { crearVenta, obtenerVentas, eliminarVenta } = require('../controllers/ventasControllers');
const { verifyToken } = require('../middlewares/authJwt');
const Venta = require('../models/venta');



router.post('/', verifyToken, crearVenta);

router.get('/', verifyToken, async (req, res) => {
  try {
    const ventas = await Venta.find()
      .populate('cliente')
      .sort({ fecha: -1 }); // orden descendente por fecha
    res.json(ventas);
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    res.status(500).json({ message: 'Error al obtener ventas' });
  }
});



router.delete('/:id', verifyToken, eliminarVenta);

module.exports = router;
