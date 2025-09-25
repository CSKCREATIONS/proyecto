const checkPermission = (permission) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Usuario no autenticado'
                });
            }

            // Si el rol no está poblado, retornar error
            if (!req.user.role || typeof req.user.role !== 'object') {
                return res.status(403).json({
                    success: false,
                    message: 'Rol de usuario no válido'
                });
            }

            // Si el rol está deshabilitado
            if (!req.user.role.enabled) {
                return res.status(403).json({
                    success: false,
                    message: 'Tu rol está deshabilitado. Contacta al administrador'
                });
            }

            // Si el usuario es Administrador, permitir todo
            if (req.user.role.name === 'Administrador') {
                return next();
            }

            // Verificar si el rol tiene el permiso específico
            const userPermissions = req.user.role.permissions || [];
            
            if (!userPermissions.includes(permission)) {
                console.log(`❌ Usuario ${req.user.username} (${req.user.role.name}) sin permiso: ${permission}`);
                console.log(`📋 Permisos del usuario:`, userPermissions);
                
                return res.status(403).json({
                    success: false,
                    message: `No tienes permisos para realizar esta acción (${permission})`
                });
            }

            console.log(`✅ Usuario ${req.user.username} (${req.user.role.name}) autorizado para: ${permission}`);
            next();
        } catch (error) {
            console.error('Error al verificar permisos:', error);
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    };
};

module.exports = {
    checkPermission
};