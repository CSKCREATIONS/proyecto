const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportesController');


// Reportes productos
router.get('/categorias', reportesController.reporteCategorias);
router.get('/subcategorias', reportesController.reporteSubcategorias);
router.get('/productos', reportesController.reporteProductos);
router.get('/consolidado', reportesController.reporteConsolidado);

 // Reportes de ventas
router.get('/ventas/por-periodo', reportesController.reporteVentasPorPeriodo);
router.get('/ventas/por-estado', reportesController.reportePedidosPorEstado);
router.get('/ventas/cotizaciones', reportesController.reporteCotizaciones);   
 
// 🆕 Reporte de clientes
router.get('/clientes', reportesController.reporteClientes);


// Reportes de proveedores
router.get('/por-pais', reportesController.reporteProveedoresPorPais);
router.get('/por-estado', reportesController.reporteEstadoProveedores);
router.get('/por-productos', reportesController.reporteProductosPorProveedor);
router.get('/recientes', reportesController.reporteProveedoresRecientes);

module.exports = router;