const mongoose = require('mongoose');

const CotizacionSchema = new mongoose.Schema({
  codigo: String,
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
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
      producto: {
        type: mongoose.Schema.Types.ObjectId,  // ✅ Esto es importante
        ref: 'Product'                        // ✅ Relación con el modelo Producto
      },
      descripcion: String,
      cantidad: Number,
      valorUnitario: Number,
      descuento: Number,
      subtotal: Number
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
