const express = require('express');
const router = express.Router();
const subcategoryController = require('../controllers/subcategoryController');
const { check } = require('express-validator');
const { verifyToken } = require('../middleware/auth');
const { checkPermission } = require('../middleware/role');

//validaciones
const validateSubcategory = [
    check('name').not().isEmpty().withMessage('El nombre es obligatorio'),
    check('description').not().isEmpty().withMessage('La descripcion es obligatoria'),
    check('category').not().isEmpty().withMessage('la categoria es obligatoria')
];

/***RUTAS****/

// GET /api/subcategories/stats - Estadísticas de subcategorías
router.get('/stats',
    verifyToken,
    checkPermission('subcategorias.ver'),
    subcategoryController.getSubcategoryStats
);

//POST /api/subcategories - crear subcategoria
router.post('/',
    verifyToken,
    checkPermission('subcategorias.crear'),
    validateSubcategory,
    subcategoryController.createSubcategory
);

// GET /api/subcategories - consultar todas las subcategorias
router.get('/',
    verifyToken,
    checkPermission('subcategorias.ver'),
    subcategoryController.getSubcategories
);

// GET /api/subcategories/:id - obtener subcategoria por id
router.get('/:id',
    verifyToken,
    checkPermission('subcategorias.ver'),
    subcategoryController.getSubcategoryById
);

// PUT /api/subcategories/:id - actualizar subcategoria por id 
router.put('/:id',
    verifyToken,
    checkPermission('subcategorias.editar'),
    validateSubcategory,
    subcategoryController.updateSubcategory
);

// PATCH /api/subcategories/:id/deactivate - desactivar subcategoria
router.patch('/:id/deactivate',
    verifyToken,
    checkPermission('subcategorias.inactivar'),
    subcategoryController.desactivarSubcategoriaYProductos
);

// PATCH /api/subcategories/:id/activate - activar subcategoria
router.patch('/:id/activate',
    verifyToken,
    checkPermission('subcategorias.inactivar'),
    subcategoryController.activarSubcategoriaYProductos
);

// PATCH /api/subcategories/:id/toggle-status - cambiar estado de subcategoría
router.patch('/:id/toggle-status',
    verifyToken,
    checkPermission('subcategorias.editar'),
    subcategoryController.toggleStatus
);

// DELETE /api/subcategories/:id - eliminar subcategoria
router.delete('/:id',
    verifyToken,
    checkPermission('subcategorias.eliminar'),
    subcategoryController.deleteSubcategory
);

module.exports = router;