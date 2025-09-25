
const { asyncHandler } = require('../middleware/errorHandler');
const Compra = require('../models/compras');

const createCompra = asyncHandler(async (req, res) => {
  const { proveedor, productos, condicionesPago, observaciones } = req.body;
  if (!proveedor || !productos || productos.length === 0) {
    return res.status(400).json({ success: false, message: 'Faltan datos obligatorios' });
  }
  const total = productos.reduce((acc, item) => acc + item.cantidad * item.precioUnitario, 0);
  const nuevaCompra = await Compra.create({
    proveedor,
    productos,
    condicionesPago,
    observaciones,
    total,
    fecha: new Date()
  });
  const compraConDatos = await Compra.findById(nuevaCompra._id)
    .populate('proveedor', 'nombre')
    .populate('productos.producto', 'name price');
  return res.status(201).json({ success: true, data: compraConDatos, message: 'Compra registrada correctamente' });
});

const getComprasPorProveedor = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const compras = await Compra.find({ proveedor: id })
    .populate('proveedor', 'name')
    .populate('productos.producto', 'nombre precio');
  res.status(200).json({ success: true, data: compras });
});

const getCompras = asyncHandler(async (req, res) => {
  const compras = await Compra.find()
    .populate('proveedor', 'nombre')
    .populate('productos.producto', 'name price')
    .sort({ fecha: -1 });
  res.status(200).json({ success: true, data: compras });
});

const deleteCompra = asyncHandler(async (req, res) => {
  const compra = await Compra.findByIdAndDelete(req.params.id);
  if (!compra) {
    return res.status(404).json({ success: false, message: 'Compra no encontrada' });
  }
  res.status(200).json({ success: true, message: 'Compra eliminada correctamente' });
});

const updateCompra = asyncHandler(async (req, res) => {
  const { proveedor, productos, condicionesPago, observaciones, total } = req.body;
  const { id } = req.params;
  const compraActualizada = await Compra.findByIdAndUpdate(
    id,
    {
      proveedor,
      productos,
      condicionesPago,
      observaciones,
      total,
      fechaCompra: Date.now()
    },
    { new: true }
  );
  if (!compraActualizada) {
    return res.status(404).json({ success: false, message: 'Compra no encontrada' });
  }
  res.status(200).json({ success: true, data: compraActualizada, message: 'Compra actualizada correctamente' });
});

// Obtener estadísticas de compras
const getCompraStats = asyncHandler(async (req, res) => {
  const total = await Compra.countDocuments();
  
  res.status(200).json({
    success: true,
    data: {
      count: total,
      total
    }
  });
});

module.exports = {
  createCompra,
  getComprasPorProveedor,
  getCompras,
  deleteCompra,
  updateCompra,
  getCompraStats
};