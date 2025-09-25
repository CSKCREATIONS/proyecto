require('dotenv').config();
const mongoose = require('mongoose');

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Conectado a MongoDB');
    
    const Role = require('../src/models/Role');
    
    return Role.find().select('name enabled');
  })
  .then(roles => {
    console.log('\n📋 Estado actual de los roles:');
    console.log('================================');
    
    roles.forEach(role => {
      const status = role.enabled ? '✅ HABILITADO' : '❌ DESHABILITADO';
      console.log(`- ${role.name.padEnd(25)} | ${status}`);
    });
    
    const disabledCount = roles.filter(role => !role.enabled).length;
    console.log(`\n📊 Resumen: ${roles.length - disabledCount}/${roles.length} roles habilitados`);
    
    if (disabledCount > 0) {
      console.log('⚠️  Hay roles deshabilitados que podrían causar errores 403');
    }
  })
  .catch(error => {
    console.error('❌ Error:', error);
  })
  .finally(() => {
    process.exit();
  });