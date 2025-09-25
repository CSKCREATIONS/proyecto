
const { asyncHandler } = require('../middleware/errorHandler');
const Venta = require('../models/venta');
const Product = require('../models/Product');

const getVentas = asyncHandler(async (req, res) => {
  const ventas = await Venta.find().populate('cliente').populate('productos.producto');
  res.status(200).json({ success: true, data: ventas });
});

const getVentaById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const venta = await Venta.findById(id)
    .populate('cliente')
    .populate('productos.producto');
  if (!venta) {
    return res.status(404).json({ success: false, message: 'Venta no encontrada' });
  }
  res.status(200).json({ success: true, data: venta });
});

const deleteVenta = asyncHandler(async (req, res) => {
  await Venta.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: 'Venta eliminada correctamente' });
});

const createVenta = asyncHandler(async (req, res) => {
  const { cliente, productos } = req.body;
  let total = 0;
  const productosProcesados = await Promise.all(productos.map(async (p) => {
    const productoDB = await Product.findById(p.producto);
    if (!productoDB) throw new Error('Producto no encontrado');
    const subtotal = productoDB.price * p.cantidad;
    total += subtotal;
    return {
      producto: p.producto,
      cantidad: p.cantidad,
      precioUnitario: productoDB.price
    };
  }));
  const nuevaVenta = new Venta({
    cliente,
    productos: productosProcesados,
    total
  });
  await nuevaVenta.save();
  res.status(201).json({ success: true, message: 'Venta registrada correctamente', data: nuevaVenta });
});

// Obtener estadísticas de ventas
const getVentaStats = asyncHandler(async (req, res) => {
  const total = await Venta.countDocuments();
  
  res.status(200).json({
    success: true,
    data: {
      count: total,
      total
    }
  });
});

module.exports = {
  getVentas,
  getVentaById,
  deleteVenta,
  createVenta,
  getVentaStats
};

