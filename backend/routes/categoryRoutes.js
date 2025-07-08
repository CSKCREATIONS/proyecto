const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyToken } = require('../middlewares/authJwt');
const { checkPermission } = require('../middlewares/role')



// POST /api/categories - Crear categoria (admin y coordinador)
router.post('/',
    verifyToken,
    categoryController.createCategory
);

// GET /api/categories - listar las categorias
router.get('/',
    verifyToken,
    categoryController.getCategories
);

//GET /api/categories - obtener categoria especifica
router.get('/:id',
    verifyToken,
    categoryController.getCategoryById
);

// PUT /api/categories - modificar categoria especifica (admin y coordinador)
router.put('/:id',
    verifyToken,
    categoryController.updateCategory
);


// Acutualizar el estado de las categorias// desactivado
router.patch('/:id/deactivate', verifyToken, categoryController.desactivarCategoriaYRelacionados);
router.patch('/:id/activate', verifyToken, categoryController.activarCategoriaYRelacionados);





module.exports = router;