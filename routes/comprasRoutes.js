// routes/compraRoutes.js
const express = require('express');
const router = express.Router();
const compraController = require('../controllers/compraController');

router.post('/', compraController.crearCompra);
router.get('/', compraController.obtenerCompras);

module.exports = router;
