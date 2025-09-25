const express = require('express');
const router = express.Router();

// Controladores de autenticación
const {
    login,
    getMe,
    changePassword,
    logout,
    verifyToken
} = require('../controllers/AuthController');

// Middleware de autenticación JWT
const { verifyToken: authMiddleware } = require('../middleware/auth');

// Login
router.post('/login', login);
// Obtener datos del usuario actual (privada)
router.get('/me', authMiddleware, getMe);
// Cambiar contraseña
router.put('/change-password', authMiddleware, changePassword);
// Cerrar sesión
router.post('/logout', authMiddleware, logout);
// Verificar token
router.get('/verify', authMiddleware, verifyToken);

module.exports = router;