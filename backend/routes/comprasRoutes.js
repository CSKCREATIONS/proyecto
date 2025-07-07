const express = require('express');
const router = express.Router();
const {
  crearCompra,
  obtenerComprasPorProveedor,
  obtenerTodasLasCompras,
  actualizarCompra,
  eliminarCompra
  
} = require('../controllers/compraController');

router.post('/', crearCompra);
router.get('/', obtenerTodasLasCompras);
router.get('/proveedor/:id', obtenerComprasPorProveedor);
router.put('/:id', actualizarCompra);
router.delete('/:id', eliminarCompra);


module.exports = router;