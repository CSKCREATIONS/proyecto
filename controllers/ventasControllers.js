const Venta = require('../models/venta');

// Crear nueva venta
exports.createVenta = async (req, res) => {
  try {
    const venta = new Venta(req.body);
    await venta.save();
    res.status(201).json({ message: 'Venta registrada con éxito', data: venta });
  } catch (err) {
    res.status(400).json({ message: 'Error al registrar la venta', error: err.message });
  }
};

// Obtener todas las ventas
exports.getVentas = async (req, res) => {
  try {
    const ventas = await Venta.find();
    res.status(200).json(ventas);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener las ventas', error: err.message });
  }
};

// Obtener venta por ID
exports.getVentaById = async (req, res) => {
  try {
    const venta = await Venta.findById(req.params.id);
    if (!venta) return res.status(404).json({ message: 'Venta no encontrada' });
    res.status(200).json(venta);
  } catch (err) {
    res.status(500).json({ message: 'Error al buscar la venta', error: err.message });
  }
};

// Actualizar venta
exports.updateVenta = async (req, res) => {
  try {
    const ventaActualizada = await Venta.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ventaActualizada) return res.status(404).json({ message: 'Venta no encontrada' });
    res.status(200).json({ message: 'Venta actualizada', data: ventaActualizada });
  } catch (err) {
    res.status(400).json({ message: 'Error al actualizar la venta', error: err.message });
  }
};

// Eliminar venta
exports.deleteVenta = async (req, res) => {
  try {
    const ventaEliminada = await Venta.findByIdAndDelete(req.params.id);
    if (!ventaEliminada) return res.status(404).json({ message: 'Venta no encontrada' });
    res.status(200).json({ message: 'Venta eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar la venta', error: err.message });
  }
};
