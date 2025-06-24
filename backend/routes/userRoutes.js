const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authJwt');
const { checkPermission } = require('../middlewares/role')
const { checkDuplicateUsernameOrEmail} = require('../middlewares/verifySignUp')
const {checkRolesExisted} = require('../middlewares/verifySignUp')
const User = require('../models/User')

// Middleware de diagnóstico para todas las rutas
router.use((req, res, next) => {
    console.log('\n=== DIAGNÓSTICO DE RUTA ===');
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    console.log('Headers:', {
        'authorization': req.headers.authorization ? '***' + req.headers.authorization.slice(-8) : null,
        'x-access-token': req.headers['x-access-token'] ? '***' + req.headers['x-access-token'].slice(-8) : null,
        'user-agent': req.headers['user-agent']
    });
    next();
});

// GET /api/users - Listar usuarios 
router.get('/',
    verifyToken,
    userController.getAllUsers
);

// POST /api/users - Crear usuario
router.post('/',
    verifyToken,
    checkPermission('usuarios.crear'),
    checkDuplicateUsernameOrEmail,
    checkRolesExisted,
    userController.createUser
);

// GET /api/users/:id - Obtener usuario específico (admin y coordinador pueden ver cualquiera, auxiliar solo se ve a sí mismo)
router.get('/:id',
    verifyToken,
    userController.getUserById
);


// PUT /api/users/:id - Actualizar usuario 
router.put('/:id',
    verifyToken,
    userController.updateUser
);

// PATCH /api/users/:id/toggle-enabled
router.patch('/:id/toggle-enabled',
  verifyToken,
  checkPermission('usuarios.editar'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { enabled } = req.body;
      const usuario = await User.findByIdAndUpdate(id, { enabled }, { new: true });
      res.json({ success: true, data: usuario });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error al cambiar el estado' });
    }
  });


// DELETE /api/users/:id - Eliminar usuario
router.delete('/:id',
    verifyToken,
    checkPermission('usuarios.eliminar'),
    userController.deleteUser
);

module.exports = router;