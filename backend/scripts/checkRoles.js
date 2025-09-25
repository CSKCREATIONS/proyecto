const mongoose = require('mongoose');
require('dotenv').config();

async function checkRoles() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conectado a MongoDB');

        const db = mongoose.connection.db;
        const roles = await db.collection('roles').find({}).toArray();
        
        console.log('Roles encontrados:');
        roles.forEach((role, index) => {
            console.log(`\n--- Rol ${index + 1} ---`);
            console.log('ID:', role._id);
            console.log('Name:', role.name);
            console.log('Description:', role.description);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkRoles();