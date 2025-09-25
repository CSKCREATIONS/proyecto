
const { asyncHandler } = require('../middleware/errorHandler');
const Proveedor = require('../models/proveedores');
const Product = require('../models/Product');

const getProveedores = asyncHandler(async (req, res) => {
  const filtro = {};
  
  // Filtro por estado activo
  if (req.query.activo === 'true') {
    filtro.activo = true;
  } else if (req.query.activo === 'false') {
    filtro.activo = false;
  }
  
  const proveedores = await Proveedor.find(filtro)
    .populate('productos', 'name price stock')
    .sort({ nombre: 1 });
  res.status(200).json({ success: true, data: proveedores });
});

const getProveedorById = asyncHandler(async (req, res) => {
  const proveedor = await Proveedor.findById(req.params.id);
  if (!proveedor) return res.status(404).json({ success: false, message: 'Proveedor no encontrado' });
  res.status(200).json({ success: true, data: proveedor });
});

const createProveedor = asyncHandler(async (req, res) => {
  const nuevoProveedor = new Proveedor(req.body);
  await nuevoProveedor.save();
  res.status(201).json({ success: true, message: 'Proveedor creado exitosamente', data: nuevoProveedor });
});

const updateProveedor = asyncHandler(async (req, res) => {
  const proveedorActualizado = await Proveedor.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!proveedorActualizado) return res.status(404).json({ success: false, message: 'Proveedor no encontrado' });
  res.status(200).json({ success: true, message: 'Proveedor actualizado', data: proveedorActualizado });
});

const deleteProveedor = asyncHandler(async (req, res) => {
  const proveedorEliminado = await Proveedor.findByIdAndDelete(req.params.id);
  if (!proveedorEliminado) return res.status(404).json({ success: false, message: 'Proveedor no encontrado' });
  res.status(200).json({ success: true, message: 'Proveedor eliminado' });
});

const deactivateProveedor = asyncHandler(async (req, res) => {
  const proveedor = await Proveedor.findByIdAndUpdate(req.params.id, { activo: false }, { new: true });
  if (!proveedor) return res.status(404).json({ success: false, message: 'Proveedor no encontrado' });
  res.status(200).json({ success: true, message: 'Proveedor desactivado', data: proveedor });
});

const activateProveedor = asyncHandler(async (req, res) => {
  const proveedor = await Proveedor.findByIdAndUpdate(req.params.id, { activo: true }, { new: true });
  if (!proveedor) return res.status(404).json({ success: false, message: 'Proveedor no encontrado' });
  res.status(200).json({ success: true, message: 'Proveedor activado', data: proveedor });
});

const getProveedoresActivos = asyncHandler(async (req, res) => {
  const proveedores = await Proveedor.find({ activo: true }).sort({ nombre: 1 });
  res.status(200).json({ success: true, data: proveedores });
});

const toggleProveedorStatus = asyncHandler(async (req, res) => {
  const proveedor = await Proveedor.findById(req.params.id);
  if (!proveedor) return res.status(404).json({ success: false, message: 'Proveedor no encontrado' });
  
  proveedor.activo = !proveedor.activo;
  await proveedor.save();
  
  const mensaje = proveedor.activo ? 'Proveedor activado' : 'Proveedor desactivado';
  res.status(200).json({ success: true, message: mensaje, data: proveedor });
});

// Obtener estadísticas de proveedores
const getProveedorStats = asyncHandler(async (req, res) => {
  const total = await Proveedor.countDocuments();
  const activos = await Proveedor.countDocuments({ activo: true });
  const inactivos = total - activos;

  res.status(200).json({
    success: true,
    data: {
      count: total,
      total,
      activos,
      inactivos
    }
  });
});

module.exports = {
  getProveedores,
  getProveedorById,
  createProveedor,
  updateProveedor,
  deleteProveedor,
  deactivateProveedor,
  activateProveedor,
  getProveedoresActivos,
  toggleProveedorStatus,
  getProveedorStats
};
