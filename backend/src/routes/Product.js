const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { check } = require('express-validator');
const { verifyToken } = require('../middleware/auth');
const { checkPermission } = require('../middleware/role');

const validateProduct = [
    check('name').not().isEmpty().withMessage('el nombre es obligatorio'),
    check('description').optional(),
    check('price').isFloat({ min: 0 }).withMessage('el precio es obligatorio'),
    check('stock').optional().isInt({ min: 0 }).withMessage('el stock debe ser un número positivo'),
    check('category').not().isEmpty().withMessage('la categoria es requerida'),
    check('subcategory').not().isEmpty().withMessage('la subcategoria es requerida'),
];

/***RUTAS****/

// GET /api/products/stats - Estadísticas de productos
router.get('/stats',
    verifyToken,
    checkPermission('productos.ver'),
    productController.getProductStats
);

// POST /api/products - Crear producto
router.post('/',
    verifyToken,
    checkPermission('productos.crear'),
    validateProduct,
    productController.createProduct
);

// GET /api/products - obtener todos los productos 
router.get('/',
    verifyToken,
    checkPermission('productos.ver'),
    productController.getProducts
);

// GET /api/products/:id - obtener producto por id 
router.get('/:id',
    verifyToken,
    checkPermission('productos.ver'),
    productController.getProductById
);

// PUT /api/products/:id - actualizar producto por id 
router.put('/:id',
    verifyToken,
    checkPermission('productos.editar'),
    validateProduct,
    productController.updateProduct
);

// PATCH /api/products/:id/deactivate - desactivar producto 
router.patch('/:id/deactivate',
    verifyToken,
    checkPermission('productos.inactivar'),
    productController.deactivateProduct
);

// PATCH /api/products/:id/activate - activar producto
router.patch('/:id/activate',
    verifyToken,
    checkPermission('productos.inactivar'),
    productController.activateProduct
);

// PATCH /api/products/:id/toggle-status - cambiar estado de producto
router.patch('/:id/toggle-status',
    verifyToken,
    checkPermission('productos.editar'),
    productController.toggleStatus
);

// DELETE /api/products/:id - eliminar producto
router.delete('/:id',
    verifyToken,
    checkPermission('productos.eliminar'),
    productController.deleteProduct
);

module.exports = router;