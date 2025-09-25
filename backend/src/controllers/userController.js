const User = require('../models/User');
const {asyncHandler} = require('../middleware/errorHandler');

//Obtener todos los usuarios
const getUsers = asyncHandler(async (req, res) => {
    const page = parseInt (req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    //filtros dinamicos
    const filters = {};

    //rol
    if(req.query.role) {
        filters.role = req.query.role;
    }

    //Activo/inactivo
    if(req.query.isActive) {
        filters.isActive = req.query.isActive === 'true';
    }

    //Multiples filtros
    if(req.query.search) {
        const search = req.query.search;
        filters.$or = [
            {username: {$regex: req.query.search , $options: 'i'}},
            {email: {$regex: req.query.search , $options: 'i'}},
            {firstName: {$regex: req.query.search , $options: 'i'}},
            {lastName: {$regex: req.query.search , $options: 'i'}},

        ];
    }

    //consulta de paginación
    const users = await User.find(filters)
    .populate('role', 'name description permissions enabled')
    .populate('createdBy', 'username firstName lastName')
    .sort({createdAt: -1})
    .skip(skip)
    .limit(limit);

    //contar total para los usuarios
    const total = await User.countDocuments(filters);

    //respuesta exitosa
    res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: users,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    });
});

//Obtener un usuario por ID
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    .populate('role', 'name description permissions enabled')
    .populate('createdBy', 'username firstName lastName');

    if (!user) {
        res.status(404).json({
            success: false,
            message: 'Usuario no encontrado'
        });
    }
    res.status(200).json({
        success: true,
        data: user
    });
});

//crear un usuario
const createUser = asyncHandler(async (req, res) => {
    const {
        username, 
        email, 
        password, 
        firstName, 
        lastName, 
        role,
        phone,
        isActive,
        createdBy
    } = req.body;

    //validaciones
    if (!username || !email || !password || !firstName || !lastName || !role) {
        return res.status(400).json({
            success: false,
            message: 'Todos los campos son obligatorios'
        });
    }
    //verificar si el usuario ya existe
    const existingUser = await User.findOne({
        $or:[{username}, {email}]
    });
    if(existingUser){
        return res.status(400).json({
            success: false,
            message: 'El usuario ya existe'
        });
    }

    //crear usuario
    const newUser = await User.create({
        username, 
        email, 
        password, 
        firstName, 
        lastName, 
        role,
        phone,
        isActive: isActive !== undefined ? isActive : true,
        createdBy: req.user._id
    });

    // Populate el usuario creado para devolver datos completos
    await newUser.populate('role', 'name description permissions enabled');
    await newUser.populate('createdBy', 'username firstName lastName');

    res.status(201).json({
        success: true,
        message: 'Usuario creado exitosamente',
        data: newUser
    });

});

//actualizar un usuario
// Actualizar un usuario
const updateUser = asyncHandler(async (req, res) => {
    // Buscar el usuario
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'Usuario no encontrado'
        });
    }

    const {
        username,
        email,
        password,
        firstName,
        lastName,
        role,
        phone,
        isActive
    } = req.body;

    // Si no es admin, solo puede actualizar su propio perfil
    if (req.user.role !== 'admin') {
        if (req.user._id.toString() !== req.params.id) {
            return res.status(403).json({
                success: false,
                message: 'Solo puedes actualizar tu propio perfil'
            });
        }

        // Solo los admin pueden cambiar el rol y el estado activo
        if (role !== undefined || isActive !== undefined) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para cambiar el rol o estado del usuario'
            });
        }
    }

    // Verificar duplicado de username
    if (username && username !== user.username) {
        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({
                success: false,
                message: 'El nombre de usuario ya está en uso'
            });
        }
    }

    // Verificar duplicado de email
    if (email && email !== user.email) {
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({
                success: false,
                message: 'El correo ya está en uso'
            });
        }
    }

    // Actualizar campos básicos
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = password; // asumiendo que el modelo tiene pre-save hash
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;

    // Solo admin puede modificar rol y estado
    if (req.user.role === 'admin') {
        if (role) user.role = role;
        if (isActive !== undefined) user.isActive = isActive;
    }

    // Guardar quién actualizó el usuario
    user.updatedBy = req.user._id;

    await user.save();

    // Populate el usuario actualizado para devolver datos completos
    await user.populate('role', 'name description permissions enabled');
    await user.populate('createdBy', 'username firstName lastName');

    res.status(200).json({
        success: true,
        message: 'Usuario actualizado correctamente',
        data: user
    });
});


//Eliminar Usuario
const deleteUser = asyncHandler(async(req,res)=> {
    const user = await User.findById(req.params.id);
    if (!user){
        return res.status(404).json({
            success: false,
            message: 'Usuario no encontrado'
        });
    }

    //no permitir que el admin se elimine asi mismo
    if (user._id.toString() === req.user._id.toString()){
        return res.status(400).json({
            success:false,
            message:'no puedes eliminar tu propio '
        });
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success:true,
        message:'Usuario eliminado correctamente'
    });
});

//activar o desactivar usuario
const toggleUserStatus =  asyncHandler(async (req,res) =>{
    const user = await User.findById(req.params.id);
    if (!user){
        return res.status(404).json({
            success:false,
            message: 'usuario no encontrado'
        });
    }
    //no permitir que el admin se desactive asi mismo
    if(user.id.toString() === req.user._id.toString()){
        return res.status(400).json({
            success: false,
            message:'No puedes cambiar tu propio estado'
        });
    }

    user.isActive = !user.isActive;
    user.updateUser = req.user._id;
    await user.save();

    res.status(200).json({
        success: true,
        message:`usuario ${user.isActive ? 'activado' : 'desactivado'} exitosamente`,
        data:user
    });

});
    
// obtener las estadisticas de llos usuarios
const getUserStats = asyncHandler(async (req,res) => {
    const stats = await User.aggregate([
        {
            $group:{
                _id: null,
                totalUsers:{ $sum:1},
                activateUsers:{
                    $sum:{$cond:[{$eq:['$isActive', true]},1,0]}
                },
                adminUsers:{
                    $sum:{$cond:[{$eq:['$role','admin']},1,0]}                    
                },
                coordinadorUsers:{
                    $sum:{$cond:[{$eq:['$role','coordinador']},1,0]}                                     
                }

            }
        }
    ]);
    const recentUsers = await User.find()
    .sort({createdAt: -1})
    .limit()
    .select('username firstname lastname email role createdAt');

    res.status(200).json({
        success:true,
        data:{
            status: stats[0] || {
                totalUsers:0,
                activateUsers:0,
                adminUsers: 0,
                coordinadorUsers:0
            },
            recentUsers
        }
    });
});

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    toggleUserStatus,
    getUserStats
};