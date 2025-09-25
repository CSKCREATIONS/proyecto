const mongoose = require('mongoose');

const CotizacionSchema = new mongoose.Schema({
  codigo: String,
  // Mantenemos la estructura antigua para compatibilidad con datos existentes
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true
  },
  ciudad: String,
  telefono: String,
  correo: String,
  responsable: {
    // Permitir tanto string (estructura antigua) como objeto (estructura nueva)
    type: mongoose.Schema.Types.Mixed
  },
  fecha: {
    type: Date,
    required: true
  },
  descripcion: String,
  condicionesPago: String,
  productos: [
    {
      producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      descripcion: String,
      cantidad: Number,
      valorUnitario: Number,
      descuento: Number,
      valorTotal: Number,
      subtotal: Number
    }
  ],
  empresa: {
    nombre: { type: String },
    direccion: { type: String }
  },
  clientePotencial: {
    type: Boolean,
    default: false
  },
  enviadoCorreo: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.Cotizacion || mongoose.model('Cotizacion', CotizacionSchema);
