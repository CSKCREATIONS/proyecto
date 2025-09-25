const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Conectar a MongoDB
async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conectado a MongoDB');

        // Definir el esquema del usuario
        const userSchema = new mongoose.Schema({
            username: String,
            email: String,
            password: String,
            firstName: String,
            lastName: String,
            role: String,
            isActive: Boolean,
            lastLogin: Date,
            createdAt: Date,
            updatedAt: Date
        });

        const User = mongoose.model('User', userSchema);

        // Verificar si ya existe un admin
        const existingAdmin = await User.findOne({ username: 'admin' });
        if (existingAdmin) {
            console.log('El usuario admin ya existe');
            process.exit(0);
        }

        // Crear hash de la contraseña
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash('admin123', saltRounds);

        // Crear usuario admin
        const adminUser = new User({
            username: 'admin',
            email: 'admin@admin.com',
            password: hashedPassword,
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin',
            isActive: true,
            lastLogin: null,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await adminUser.save();
        console.log('Usuario admin creado exitosamente!');
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

createAdmin();