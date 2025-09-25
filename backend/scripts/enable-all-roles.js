// Script para habilitar todos los roles
require('dotenv').config();
const mongoose = require('mongoose');
const Role = require('../src/models/Role');

async function enableAllRoles() {
    try {
        // Conectar a MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('📡 Conectado a MongoDB');

        // Habilitar todos los roles
        const result = await Role.updateMany({}, { enabled: true });
        console.log(`✅ ${result.modifiedCount} roles habilitados`);

        // Mostrar resumen
        console.log('\n📊 ROLES ACTUALIZADOS:');
        const allRoles = await Role.find();
        for (const role of allRoles) {
            console.log(`  ✅ ${role.name}: ${role.enabled ? 'Habilitado' : 'Deshabilitado'}`);
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Desconectado de MongoDB');
        process.exit(0);
    }
}

enableAllRoles();