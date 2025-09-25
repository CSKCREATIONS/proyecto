const jwt = require ('jsonwebtoken');
const User = require ('../models/User');

const verifyToken = async (req, res, next) =>{
    try{
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({
                success:false,
                message:'token de acceso requerido'
            });
        }

        const token = authHeader.split(' ')[1];
        if (!token){
            return res.status(401).json({
                success:false,
                message:'Formato de token invalido'
            });
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).populate('role').select('-password');

        if(!user){
            return res.status(401).json({
                success:false,
                message:'Usuario no encontrado'
            })
        }
        if(!user.isActive){
            return res.status(403).json({
                success:false,
                message: 'Usuario inactivo'
            });
        }

        req.user = user;
        next();
    } catch (error){
        console.error('Error al verificar el token',error)
        if( error.name === 'jsonWebTokenError'){
            return res.status(401).json({
                success:false,
                message:'Token invalido'
            });
        }

        if(error.name === 'TokenExpiredError'){
            return res.status(401).json({
                success: false,
                message: 'Token expirado'
            });
        }

        return res.status(500).json({
            success:false,
            message:'Error interno del servidor'
        });
        
    }
};

const verifyRole = (...allowedRoles) =>{
    return( req, res, next) =>{
        try{
            if(!req.user){
                return res.status(403).json({
                    success:false,
                    message:'Acceso denegado'
                })
            }
            
            // Obtener el nombre del rol (ahora es un objeto poblado)
            const userRole = req.user.role && req.user.role.name ? req.user.role.name : null;
            
            if(!userRole || !allowedRoles.includes(userRole)){
                console.log('Acceso denegado - Rol del usuario:', userRole, 'Roles permitidos:', allowedRoles);
                return res.status(403).json({
                    success:false,
                    message:'Rol no autorizado'
                })
            }
            next();
        }catch(error){
            console.error('Error al verificar el rol', error);
            return res.status(500).json({
                success:false,
                message:'Error interno del servidor'
            });
        }
    }
};

const verifyAdmin = verifyRole('Administrador');
const verifyAdminOrVendedor = verifyRole('Administrador', 'Vendedor');
const verifyAdminOrJefeCompras = verifyRole('Administrador', 'Jefe de compras');
const verifyAdminOrEncargadoInventario = verifyRole('Administrador', 'Encargado de inventario');
const verifyAdminOrGerente = verifyRole('Administrador', 'Gerente');
const verifyAdminOrVentas = verifyRole('Administrador', 'Venta');

// Combinaciones de roles para diferentes funciones  
const verifyVentasRoles = verifyRole('Administrador', 'Gerente', 'Vendedor', 'Venta', 'Coordinador');
const verifyComprasRoles = verifyRole('Administrador', 'Gerente', 'Jefe de compras', 'Coordinador');
const verifyInventarioRoles = verifyRole('Administrador', 'Gerente', 'Encargado de inventario', 'Coordinador');
const verifyGestionRoles = verifyRole('Administrador', 'Gerente', 'Coordinador');

const verifyAdminOrOwner = async ( req,res,next) =>{
    try{
        if(!req.user){
            return res.status(401).json({
                success:false,
                message:'Usuario no autenticado'
            })
        }
        if(req.user.role && req.user.role.name === 'Administrador'){
            return next();

        }

        const targetUserId = req.params.id || req.body.userId;

        if(req.user._id.toString() !== targetUserId){
            return res.status(403).json({
                success:false,
                message:'Solo puedes modificar tu propio perfil'
            });
        }
        next();
    }catch(error){
        console.error('Error en verifyAdminOrOwner', error);
        return res.status(500).json({
            success:false,
            message:'Error interno del servidor'
        })
    }
};

module.exports = {
    verifyAdmin,
    verifyRole,
    verifyToken,
    verifyAdminOrVendedor,
    verifyAdminOrJefeCompras,
    verifyAdminOrEncargadoInventario,
    verifyAdminOrGerente,
    verifyAdminOrVentas,
    verifyVentasRoles,
    verifyComprasRoles,
    verifyInventarioRoles,
    verifyGestionRoles,
    verifyAdminOrOwner,
}