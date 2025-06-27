const mongoose = require('mongoose');

const ProveedorSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  contacto: {
    nombre: { type: String, required: true },
    telefono: { type: String, required: true },
    correo: { type: String, required: true }
  },
  direccion: {
    calle: { type: String },
    ciudad: { type: String },
    departamento: { type: String },
    pais: { type: String }
  },
  productos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product' // Si tienes relación con productos
  }],
  activo: {
    type: Boolean,
    default: true
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Proveedor', ProveedorSchema);
