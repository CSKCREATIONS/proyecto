const jwt = require('jsonwebtoken');
const config = require('../config/auth.config');

console.log('[AuthJWT] Configuracion cargada: ', config.secret ? '***' + config.secret.slice(-5) : 'NO CONFIGURADO');

const verifyTokenFn = (req, res, next) => {
    console.log('\n[AuthJWT] middleware ejecutándose para: ', req.originalUrl);

    try {
        const token = req.headers['x-access-token'] || req.headers.authorization?.split(' ')[1];
        console.log('[AuthJWT] token recibido: ', token ? '***' + token.slice(-8) : 'NO PROVISTO');

        if (!token) {
            console.log('[AuthJWT] error: token no proporcionado');
            return res.status(403).json({
                success: false,
                message: 'Token no proporcionado'
            });
        }

        const decoded = jwt.verify(token, config.secret);
        req.userId = decoded.id;
        req.userRole = decoded.role;

        console.log('[AuthJWT] token válido para ID:', decoded.id, 'Rol:', decoded.role);

        next();
    } catch (error) {
        console.error('[AuthJWT] error: ', error.name, '_', error.message);
        return res.status(401).json({
            success: false,
            message: 'Token inválido',
            error: error.name
        });
    }
};

module.exports = {
    verifyToken: verifyTokenFn
};
// Nota: Asegúrate de que el archivo auth.config.js contenga la clave secreta correcta y que esté configurado en tu entorno de producción.