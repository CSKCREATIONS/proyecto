const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyToken } = require('../middleware/auth');
const { checkPermission } = require('../middleware/role');

// GET /api/categories/stats - Estadísticas de categorías
router.get('/stats',
    verifyToken,
    checkPermission('categorias.ver'),
    categoryController.getCategoryStats
);

// POST /api/categories - Crear categoria 
router.post('/',
    verifyToken,
    checkPermission('categorias.crear'),
    categoryController.createCategory
);

// GET /api/categories - listar las categorias
router.get('/',
    verifyToken,
    checkPermission('categorias.ver'),
    categoryController.getCategories
);

// GET /api/categories/:id - obtener categoria especifica
router.get('/:id',
    verifyToken,
    checkPermission('categorias.ver'),
    categoryController.getCategoryById
);

// PUT /api/categories/:id - modificar categoria especifica 
router.put('/:id',
    verifyToken,
    checkPermission('categorias.editar'),
    categoryController.updateCategory
);

// PATCH /api/categories/:id/deactivate - desactivar categoria
router.patch('/:id/deactivate',
    verifyToken,
    checkPermission('categorias.editar'),
    categoryController.desactivarCategoriaYRelacionados
);

// PATCH /api/categories/:id/activate - activar categoria
router.patch('/:id/activate',
    verifyToken,
    checkPermission('categorias.editar'),
    categoryController.activarCategoriaYRelacionados
);

// PATCH /api/categories/:id/toggle-status - cambiar estado de categoría
router.patch('/:id/toggle-status',
    verifyToken,
    checkPermission('categorias.editar'),
    categoryController.toggleStatus
);

// DELETE /api/categories/:id - eliminar categoria
router.delete('/:id',
    verifyToken,
    checkPermission('categorias.eliminar'),
    categoryController.deleteCategory
);

module.exports = router;