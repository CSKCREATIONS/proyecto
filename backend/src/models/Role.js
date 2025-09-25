const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre del rol es requerido'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    permissions: {
        type: [String],
        default: []
    },
    enabled: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Role', roleSchema);