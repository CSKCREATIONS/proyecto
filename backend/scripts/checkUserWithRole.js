const mongoose = require('mongoose');
require('dotenv').config();

async function checkUserWithRole() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conectado a MongoDB');

        const User = require('../src/models/User');
        const Role = require('../src/models/Role');
        const users = await User.find({}).populate('role');
        
        console.log('Usuarios con roles poblados:');
        users.forEach((user, index) => {
            console.log(`\n--- Usuario ${index + 1} ---`);
            console.log('ID:', user._id);
            console.log('Username:', user.username);
            console.log('Email:', user.email);
            console.log('Rol ID:', user.role._id);
            console.log('Rol Nombre:', user.role.name);
            console.log('FirstName:', user.firstName);
            console.log('LastName:', user.lastName);
            console.log('IsActive:', user.isActive);
        });
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkUserWithRole();