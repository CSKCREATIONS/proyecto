const express = require('express');
const router = express.Router();
const {
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    deleteRole,
    initializeRoles
} = require('../controllers/roleController');

// Middleware de autenticación (si existe)
// const auth = require('../middleware/auth');

// Rutas públicas (temporalmente para setup inicial)
router.get('/', getAllRoles);
router.get('/initialize', initializeRoles); // Para crear roles iniciales
router.get('/:id', getRoleById);

// Rutas que requieren autenticación (descomenta cuando tengas middleware)
// router.post('/', auth, createRole);
// router.put('/:id', auth, updateRole);
// router.delete('/:id', auth, deleteRole);

// Rutas temporales sin autenticación para setup
router.post('/', createRole);
router.put('/:id', updateRole);
router.delete('/:id', deleteRole);

module.exports = router;