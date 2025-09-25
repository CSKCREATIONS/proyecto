const mongoose = require('mongoose');

const PedidoSchema = new mongoose.Schema({
  numeroPedido: {
    type: String,
    unique: true,
  },
  productos: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    cantidad: {
      type: Number,
      required: true,
      min: 1
    },
    precioUnitario: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  total: {
    type: Number,
    default: 0
  },
  fechaEntrega: { type: Date, required: true },
  observacion: { type: String, default: '' },
  motivoDevolucion: { type: String, default: '' },
  estado: {
    type: String,
    enum: ['agendado', 'despachado', 'entregado', 'cancelado', 'devuelto'],
    default: 'agendado'
  },
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true
  }
}, { timestamps: true });

// Generar numeroPedido automáticamente antes de guardar
PedidoSchema.pre('save', async function(next) {
  if (!this.numeroPedido) {
    const count = await mongoose.model('Pedido').countDocuments();
    this.numeroPedido = `PED-${String(count + 1).padStart(6, '0')}`;
  }
  
  // Calcular total automáticamente
  if (this.productos && this.productos.length > 0) {
    this.total = this.productos.reduce((sum, prod) => {
      return sum + (prod.cantidad * prod.precioUnitario);
    }, 0);
  }
  
  next();
});

module.exports = mongoose.models.Pedido || mongoose.model('Pedido', PedidoSchema);

