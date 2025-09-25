const mongoose = require('mongoose');
require('dotenv').config();

async function checkUser() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conectado a MongoDB');

        // Use raw MongoDB queries to see the actual data structure
        const db = mongoose.connection.db;
        const users = await db.collection('users').find({}).toArray();
        
        console.log('Usuarios encontrados:');
        users.forEach((user, index) => {
            console.log(`\n--- Usuario ${index + 1} ---`);
            console.log('ID:', user._id);
            console.log('Username:', user.username);
            console.log('Email:', user.email);
            console.log('Role:', user.role, '(Type:', typeof user.role, ')');
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

checkUser();