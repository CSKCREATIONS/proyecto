const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, 
        unique: true
    },
    permissions: [{ type: String }] // Ej: ["usuarios.ver", "usuarios.editar", "ventas.crear"]
});

module.exports = mongoose.model('Role', roleSchema);
