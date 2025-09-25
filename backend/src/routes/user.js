const express = require ('express');
const router = express.Router();

const {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    getUserStats
} = require('../controllers/userController');

//middleware de autenticacion

const{
    verifyToken,
    verifyAdmin,
    verifyGestionRoles
} = require('../middleware/auth');

//middleware de autorizacion
const {validateObjectId} = require('../middleware/errorHandler')

// Aplicar verificación de token a todas las rutas
router.use(verifyToken);

//Estadísticas de usuarios
router.get('/stats', verifyAdmin, getUserStats);

// Listar todos los usuarios
router.get('/', verifyAdmin, getUsers);
// Obtener usuario por ID
router.get('/:id', validateObjectId('id'), verifyGestionRoles, getUserById);
// Crear usuario
router.post('/', verifyAdmin, createUser);
// Actualizar usuario
router.put('/:id', validateObjectId('id'), verifyGestionRoles, updateUser);
// Eliminar usuario
router.delete('/:id', validateObjectId('id'), verifyAdmin, deleteUser);
// Activar/desactivar usuario
router.patch('/:id/toggle-status', validateObjectId('id'), verifyAdmin, toggleUserStatus);

module.exports = router;