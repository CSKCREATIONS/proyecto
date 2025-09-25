const mongoose = require('mongoose');
const Category = require('../src/models/Category');
const User = require('../src/models/User');
const Role = require('../src/models/Role'); // Agregar Role
require('dotenv').config();

async function migrateCategories() {
    try {
        // Conectar a la base de datos
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Conectado a MongoDB');

        // Buscar un usuario admin para asignar como creador por defecto
        const adminUser = await User.findOne().populate('role');
        
        if (!adminUser) {
            console.log('❌ No se encontró ningún usuario');
            return;
        }

        console.log('👤 Usuario encontrado:', {
            username: adminUser.username,
            role: adminUser.role
        });

        // Si no hay rol o no es admin, usar el primer usuario disponible
        let creatorUser = adminUser;
        if (adminUser.role && adminUser.role.name === 'Administrador') {
            console.log('✅ Usuario administrador encontrado');
        } else {
            console.log('⚠️  Usuario no es administrador, pero se usará como creador por defecto');
        }

        // Buscar todas las categorías sin createdBy
        const categoriesWithoutCreatedBy = await Category.find({ 
            createdBy: { $exists: false } 
        });

        console.log(`📦 Encontradas ${categoriesWithoutCreatedBy.length} categorías sin createdBy`);

        if (categoriesWithoutCreatedBy.length === 0) {
            console.log('✅ Todas las categorías ya tienen el campo createdBy');
            return;
        }

        // Actualizar todas las categorías sin createdBy
        const result = await Category.updateMany(
            { createdBy: { $exists: false } },
            { 
                $set: { 
                    createdBy: creatorUser._id,
                    updatedBy: creatorUser._id 
                } 
            }
        );

        console.log(`✅ Actualizadas ${result.modifiedCount} categorías`);

        // Verificar que todas las categorías ahora tienen createdBy
        const remainingCategories = await Category.find({ 
            createdBy: { $exists: false } 
        });

        if (remainingCategories.length === 0) {
            console.log('🎉 Migración completada exitosamente');
        } else {
            console.log(`⚠️  Aún quedan ${remainingCategories.length} categorías sin createdBy`);
        }

    } catch (error) {
        console.error('❌ Error en la migración:', error);
    } finally {
        await mongoose.connection.close();
        console.log('🔐 Conexión cerrada');
    }
}

// Ejecutar la migración
migrateCategories();