const mongoose = require('mongoose');

const ventaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  ciudad: { type: String, required: true },
  telefono: { type: String, required: true },
  correo: { type: String, required: true },
  producto: { type: String, required: true },
  cantidad: { type: Number, required: true },
  fecha_entrega: { type: Date, required: true },
  observacion: { type: String },
  activo: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('Venta', ventaSchema);
