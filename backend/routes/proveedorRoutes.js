const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const proveedorController = require('../controllers/proveedorControllers');
const { verifyToken } = require('../middlewares/authJwt');
const { checkRole } = require('../middlewares/role');

// Validaciones para crear o editar proveedor
const validateProveedor = [
    check('nombre').not().isEmpty().withMessage('El nombre es obligatorio'),
    check('correo').isEmail().withMessage('Debe proporcionar un correo válido'),
    check('telefono').not().isEmpty().withMessage('El teléfono es obligatorio'),
    check('direccion').not().isEmpty().withMessage('La dirección es obligatoria'),
    check('empresa').not().isEmpty().withMessage('La empresa es obligatoria'), // ⚠️ Si este falla, lanza 400
];


/*** RUTAS ***/

// POST /api/proveedores - Crear proveedor (admin y coordinador)
router.post('/',    
    verifyToken,
    validateProveedor,
    proveedorController.createProveedor
);

// GET /api/proveedores - Listar todos (admin, coordinador, auxiliar)
router.get('/',
    verifyToken,
    proveedorController.getProveedores
);

// GET /api/proveedores/:id - Obtener uno por ID
router.get('/:id',
    verifyToken,
    proveedorController.getProveedorById
);

// PUT /api/proveedores/:id - Actualizar proveedor
router.put('/:id',
    verifyToken,
    validateProveedor,
    proveedorController.updateProveedor
);

// DELETE /api/proveedores/:id - Eliminar proveedor
router.delete('/:id',
    verifyToken,
    proveedorController.deleteProveedor
);

// PATCH /api/proveedores/:id/deactivate - Desactivar proveedor
router.patch('/:id/deactivate',
    verifyToken,
    proveedorController.deactivateProveedor
);

// PATCH /api/proveedores/:id/activate - Activar proveedor
router.patch('/:id/activate',
    verifyToken,
    proveedorController.activateProveedor
);

module.exports = router;
