const express = require('express');
const productController = require('../controllers/productControllers');
const router = express.Router();
const { check } = require('express-validator');
const { verifyToken } = require('../middlewares/authJwt');
const { checkRole } = require('../middlewares/role');


const validateProduct = [
    check('name').not().isEmpty().withMessage('el nombre es obligatorio'),
    check('description').not().isEmpty().withMessage('la descripcion es obligatorio'),
    check('price').isFloat({ min: 0 }).isEmpty().withMessage('el precio es obligatorio'),
    check('stock').isInt({ min: 0 }).withMessage('stock invalido'),
    check('category').not().isEmpty().withMessage('la categoria es requerida'),
    check('subcategory').not().isEmpty().withMessage('la subcategoria es requerida'),
];


/***RUTAS****/

// POST /api/products - Crear producto (admin y coordinador)
router.post('/',
    verifyToken,
    validateProduct, productController.createProduct
);

// GET /api/products - obtener todos los productos (todos lo pueden hacer)
router.get('/',
    verifyToken,
    productController.getProducts
);

// GET /api/products - obtener producto por id (todos lo pueden hacer)
router.get('/:id',
    verifyToken,
    productController.getProductById
);

// PUT /api/products - actualizar producto por id (solo admin y coordinador)
router.put('/:id',
    verifyToken,
    validateProduct, productController.updateProduct
);

// DELETE /api/products - eliminar producto especifico por id (solo admin)
router.delete('/:id',
    verifyToken,
    productController.deleteProduct
);

// PATCH /api/products/:id/deactivate - desactivar producto (admin y coordinador)
router.patch('/:id/deactivate',
    verifyToken,
    productController.deactivateProduct
);

// PATCH /api/products/:id/activate - activar producto (admin y coordinador)
router.patch('/:id/activate',
    verifyToken,
    productController.activateProduct
);


module.exports = router;





