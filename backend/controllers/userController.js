const User = require('../models/User');
const bcrypt = require('bcryptjs');

//Obtener todos los usuarios (admin y coordinador)
exports.getAllUsers = async (req, res) => {
  console.log('[CONTROLLER] Ejecutando getAllUsers');
  try {
    const users = await User.find()
      .populate('role')
      .select('-password');
    console.log('[CONTROLLER] Usuarios encontrados:', users.length);
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('[CONTROLLER] error en getAllUsers:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios'
    });
  }
};


//Obtener usuario especifico
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'usuario no encontrado'
      });
    }

    // validaciones de acceso
    if (req.userRole === 'auxiliar' && req.userId !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para ver este usuario'
      });
    }

    if (req.userRole === 'coordinador' && user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'NO puedes ver usuarios admin'
      });
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuario',
      error: error.message
    });
  }
};


//crear usuario (admin y rol con permiso)
exports.createUser = async (req, res) => {
  try {
    const Role = require('../models/Role');

    const role = await Role.findOne({ name: req.body.role });
    if (!role) {
      return res.status(400).json({ success: false, message: 'Rol no encontrado' });
    }

    const User = require('../models/User');

    const user = new User({
      firstName: req.body.firstName,
      secondName: req.body.secondName || '',
      surname: req.body.surname,
      secondSurname: req.body.secondSurname || '',
      username: req.body.username,
      email: req.body.email,
      password: req.body.password, // se hashea con el pre('save')
      role: role.name
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Usuario creado'

    });

  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ success: false, message: 'Error en el servidor' });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const allowedFields = ['firstName', 'secondName', 'surname', 'secondSurname', 'email', 'username', 'role'];
    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    )
      .populate('role') 
      .select('-password');


    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Usuario actualizado correctamente',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar usuario',
      error: error.message
    });
  }
};


//Eliminar usuario solo si nunca ha iniciado sesión
exports.deleteUser = async (req, res) => {
  console.log('[CONTROLLER] Ejecutando deleteUser para Id:', req.params.id); // diagnóstico

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      console.log('[CONTROLLER] Usuario no encontrado para eliminar'); // diagnóstico
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    //  Verificar si el usuario ha iniciado sesión al menos una vez
    if (user.lastLogin !== null) {
      console.log('[CONTROLLER] No se puede eliminar: usuario ya inició sesión'); // diagnóstico
      return res.status(403).json({
        success: false,
        message: 'No se puede eliminar: el usuario ya ha iniciado sesión en el sistema.'
      });
    }

    //  Si pasa la validación, eliminar
    await User.findByIdAndDelete(req.params.id);
    console.log('[CONTROLLER] Usuario eliminado', user._id); // diagnóstico

    res.status(200).json({
      success: true,
      message: 'Usuario eliminado correctamente'
    });

  } catch (error) {
    console.error('[CONTROLLER] Error al eliminar usuario', error.message); // diagnóstico
    res.status(500).json({
      success: false,
      message: 'Error al eliminar usuario'
    });
  }
};



/****cambia la contraseña de cualquier usuario */
exports.changePassword = async (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword) {
    return res.status(400).json({
      success: false,
      message: 'La nueva contraseña es requerida'
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contraseña actualizada correctamente'
    });
  } catch (error) {
    console.error('[CambioContraseña]', error.message);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la contraseña'
    });
  }
};

// Cambiar contraseña propia
exports.changeOwnPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.trim().length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La nueva contraseña debe tener al menos 6 caracteres'
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contraseña actualizada correctamente'
    });

  } catch (error) {
    console.error('[changeOwnPassword] Error al cambiar contraseña:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cambiar contraseña'
    });
  }
};
