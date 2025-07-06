const mongoose = require('mongoose');

const CompraSchema = new mongoose.Schema({
  proveedor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proveedor',
    required: true
  },
  productos: [
    {
      producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      cantidad: { type: Number, required: true },
      precioUnitario: { type: Number, required: true }
    }
  ],
  fecha: { type: Date, default: Date.now }, // <-- nombre sincronizado con el resto del sistema
  total: { type: Number, required: true },
  condicionesPago: { type: String },
  observaciones: { type: String }
});

module.exports = mongoose.models.Compra || mongoose.model('Compra', CompraSchema);