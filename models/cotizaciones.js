const mongoose = require('mongoose');

const CotizacionSchema = new mongoose.Schema({
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente', // 👈 Esto establece la relación con el modelo Cliente
    required: true
  },
  ciudad: String,
  telefono: String,
  correo: String,
  responsable: String,
  fecha: {
    type: Date,
    required: true
  },
  descripcion: String,
  condicionesPago: String,
  productos: [
    {
      producto: String, // o { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' } si tienes modelo Producto
      descripcion: String,
      cantidad: Number,
      valorUnitario: Number,
      descuento: Number,
      valorTotal: Number
    }
  ],
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

module.exports = mongoose.model('Cotizacion', CotizacionSchema);
