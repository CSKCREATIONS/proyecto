const bcrypt = require ('bcryptjs');
const {User} = require('../models');
const {generateToken} = require('../utils/jwt');
const {asyncHandler} = require('../middleware/errorHandler');

//Login de usuario
const login = asyncHandler(async (req,res) => {
    console.log('🔍 DEBUG: Petición de login recibida');
    console.log('🔍 DEBUG: Headers:', req.headers);
    console.log('🔍 DEBUG: Body:', req.body);
    console.log('🔍 DEBUG: Datos recibidos en login:',req.body);
    const {email, username, password} = req.body;
    const loginFields = email || username;
    console.log('🔍 DEBUG: campo de login', loginFields);
    console.log('🔍 DEBUG: password recibido', password ? '[PRESENTE]' : 'AUSENTE');

    //Validacion de campos requeridos
    if (!loginFields || !password) {
        console.log('Error: campos requeridos faltantes');
        return res.status(400).json({
            success: false,
            message: 'Username/email y contraseña son requeridos'
        });
    }
    try {
        const loginValue = loginFields.toLowerCase();
        console.log('DEBUG: buscando usuario con:', loginValue);
        const user = await User.findOne({
            $or: [
                { username: loginValue },
                { email: loginValue }
            ]
        }).populate('role').select('+password');
        console.log('DEBUG: usuario encontrado', user ? user.username : 'NINGUNO');
        if (!user) {
            console.log('ERROR - usuario no encontrado');
            return res.status(404).json({
                success: false,
                message: 'Credenciales invalidas'
            });
        }
        if (!user.isActive) {
            console.log('ERROR - Usuario inactivo');
            return res.status(401).json({
                success: false,
                message: 'Usuario inactivo, contacta con el administrador'
            });
        }
        //Verificacion de contraseña
        console.log('DEBUG: verificando contraseña');
        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('DEBUG: contraseña valida', isPasswordValid);
        if (!isPasswordValid) {
            console.log('ERROR - contraseña invalida');
            return res.status(401).json({
                success: false,
                message: 'Credenciales invalidas'
            });
        }
        user.lastLogin = new Date();
        console.log('🔄 Guardando lastLogin...');
        await user.save();
        console.log('✅ LastLogin guardado exitosamente');
        
        //generar Token jwt
        console.log('🔄 Generando token JWT...');
        console.log('🔍 User ID para token:', user._id);
        const token = generateToken(user._id);
        console.log('✅ Token generado:', token ? 'SUCCESS' : 'FAILED');
        
        const userResponse = {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            isActive: user.isActive
        };
        
        console.log('✅ Login exitoso para usuario:', user.username);
        
        res.status(200).json({
            success: true,
            message: 'Login exitoso',
            data: {
                user: userResponse,
                token,
                expiresIn: process.env.JWT_EXPIRE || '7d'
            }
        });
        
    } catch (error) {
        console.error('❌ ERROR en el login:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
    
});

//obtener informacion del usuario encontrado 
const getMe = asyncHandler(async (req,res) => {
    const user = await User.findById(req.user._id).populate('role');
    res.status(200).json({
        success:true,
        data:user
    });
});

//cambio de contraseña
const changePassword = asyncHandler(async(req,res) =>{
    const {currentPassword, newPassword} = req.body;
    if(!currentPassword || !newPassword){
        return res.status(400).json({
            success:false,
            message:'Contraseña actual y nueva contraseña son requiradas'
        });
    }
    if(newPassword.length < 6){
        return res.status(400).json({
            success:false,
            message:'la nueva contraseña debe tener al menos 6 caracteres'
        });
    }
    //Obtener usuario con contraseña actual
    const user = await User.findById(req.user._id).select('+password')
    const isCurrentPasswordValid = await user.comparePassword
    (currentPassword);
    if(!isCurrentPasswordValid){
        return res.status(400).json({
            success:false,
            message:'la contrasela actual es incorrecta'
        });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({
        success: true,
        message: 'contraseña actualizada correctamente'
    });
});
//Invalidar token de usuario extraño

const logout = asyncHandler(async (req,res) =>{
    res.status(200).json({
        success:true,
        message:'logout exitoso, invalida el token del cliente'
    });
});
//verificar token
const verifyToken = asyncHandler(async(req,res) =>{
    res.status(200).json({
        success:true,
        message:'token valido',
        data:req.user
    });
});

module.exports = {
    login,
    getMe,
    changePassword,
    logout,
    verifyToken
}