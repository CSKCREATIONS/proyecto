const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportesController');
const { reporteVentasPorPeriodo } = require('../controllers/reportesController');

// Reportes
router.get('/categorias', reportesController.reporteCategorias);
router.get('/subcategorias', reportesController.reporteSubcategorias);
router.get('/productos', reportesController.reporteProductos);
router.get('/consolidado', reportesController.reporteConsolidado);

    

module.exports = router;