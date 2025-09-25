// Script para solucionar problema de roles deshabilitados
require('dotenv').config();
const mongoose = require('mongoose');
const Role = require('../src/models/Role');
const User = require('../src/models/User');

async function fixDisabledRoles() {
    try {
        // Conectar a MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('📡 Conectado a MongoDB');

        // Buscar rol "Venta" deshabilitado
        const disabledVentaRole = await Role.findOne({ name: 'Venta', enabled: false });
        
        if (disabledVentaRole) {
            console.log('🚫 Encontrado rol "Venta" deshabilitado');
            
            // Buscar usuarios con este rol
            const usersWithDisabledRole = await User.find({ role: disabledVentaRole._id }).populate('role');
            
            console.log(`👥 Usuarios con rol deshabilitado: ${usersWithDisabledRole.length}`);
            
            if (usersWithDisabledRole.length > 0) {
                // Buscar rol "Vendedor" como alternativa
                const vendedorRole = await Role.findOne({ name: 'Vendedor', enabled: true });
                
                if (vendedorRole) {
                    console.log('✅ Reasignando usuarios al rol "Vendedor"...');
                    
                    for (const user of usersWithDisabledRole) {
                        console.log(`  - Actualizando usuario: ${user.username} (${user.email})`);
                        await User.findByIdAndUpdate(user._id, { role: vendedorRole._id });
                    }
                    
                    console.log('✅ Usuarios reasignados correctamente');
                } else {
                    // Si no existe rol Vendedor, habilitar rol Venta
                    console.log('⚠️ No se encontró rol "Vendedor", habilitando rol "Venta"...');
                    await Role.findByIdAndUpdate(disabledVentaRole._id, { enabled: true });
                    console.log('✅ Rol "Venta" habilitado');
                }
            }
        } else {
            console.log('✅ No se encontraron roles deshabilitados con usuarios asignados');
        }

        // Mostrar resumen final
        console.log('\n📊 RESUMEN DE ROLES:');
        const allRoles = await Role.find();
        for (const role of allRoles) {
            const userCount = await User.countDocuments({ role: role._id });
            console.log(`  ${role.name}: ${userCount} usuarios (${role.enabled ? 'Habilitado' : 'Deshabilitado'})`);
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('🔌 Desconectado de MongoDB');
        process.exit(0);
    }
}

fixDisabledRoles();