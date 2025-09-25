// Script directo para habilitar roles
require('dotenv').config();
const mongoose = require('mongoose');

async function enableRoles() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('📡 Conectado a MongoDB');

        const rolesCollection = mongoose.connection.db.collection('roles');
        
        // Actualizar todos los roles a enabled: true
        const result = await rolesCollection.updateMany(
            {}, 
            { $set: { enabled: true } }
        );
        
        console.log(`✅ Roles actualizados: ${result.modifiedCount}`);

        // Verificar el resultado
        const allRoles = await rolesCollection.find({}).toArray();
        console.log('\n📊 ESTADO ACTUAL DE ROLES:');
        allRoles.forEach(role => {
            console.log(`  ${role.enabled ? '✅' : '❌'} ${role.name}: ${role.enabled ? 'Habilitado' : 'Deshabilitado'}`);
        });

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Desconectado de MongoDB');
        process.exit(0);
    }
}

enableRoles();