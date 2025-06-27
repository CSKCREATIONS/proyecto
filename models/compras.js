// models/Compra.js
const mongoose = require('mongoose');

const CompraSchema = new mongoose.Schema({
  proveedor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proveedor',
    required: true
  },
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producto',
    required: true
  },
  cantidad: {
    type: Number,
    required: true
  },
  precioUnitario: {
    type: Number,
    required: true
  },
  fechaCompra: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Compra', CompraSchema);
