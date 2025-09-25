
const { asyncHandler } = require('../middleware/errorHandler');

const Cliente = require('../models/Cliente');
const Pedido = require('../models/Pedido');
const { validationResult } = require('express-validator');

const getClientes = asyncHandler(async (req, res) => {
  const filtro = {};
  if (req.query.esCliente === 'true') {
    filtro.esCliente = true;
  } else if (req.query.esCliente === 'false') {
    filtro.esCliente = false;
  }
  
  // Filtro por estado activo
  if (req.query.activo === 'true') {
    filtro.activo = true;
  } else if (req.query.activo === 'false') {
    filtro.activo = false;
  }
  
  const clientes = await Cliente.find(filtro).sort({ nombre: 1 });
  res.status(200).json({ success: true, data: clientes });
});

const getClienteById = asyncHandler(async (req, res) => {
  const cliente = await Cliente.findById(req.params.id);
  if (!cliente) {
    return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
  }
  res.status(200).json({ success: true, data: cliente });
});

const createCliente = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Errores de validación', errors: errors.array() });
  }
  const nuevoCliente = new Cliente(req.body);
  await nuevoCliente.save();
  res.status(201).json({ success: true, data: nuevoCliente, message: 'Cliente creado correctamente' });
});

const updateCliente = asyncHandler(async (req, res) => {
  const clienteActualizado = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!clienteActualizado) {
    return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
  }
  res.status(200).json({ success: true, data: clienteActualizado, message: 'Cliente actualizado' });
});

const deleteCliente = asyncHandler(async (req, res) => {
  const clienteEliminado = await Cliente.findByIdAndDelete(req.params.id);
  if (!clienteEliminado) {
    return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
  }
  res.status(200).json({ success: true, message: 'Cliente eliminado' });
});

const getClientesConEstado = asyncHandler(async (req, res) => {
  const clientes = await Cliente.find({ esCliente: true });
  const clientesConEstado = await Promise.all(
    clientes.map(async cliente => {
      const pedidos = await Pedido.find({ cliente: cliente._id })
        .sort({ createdAt: -1 })
        .populate('cliente');
      const ultimoPedido = pedidos[0];
      return {
        ...cliente.toObject(),
        ultimoEstado: ultimoPedido ? ultimoPedido.estado : 'Sin pedido',
        ultimoPedidoId: ultimoPedido ? ultimoPedido._id.toString() : null,
        clienteInfo: ultimoPedido?.cliente || null
      };
    })
  );
  res.status(200).json({ success: true, data: clientesConEstado });
});

const toggleClienteStatus = asyncHandler(async (req, res) => {
  const cliente = await Cliente.findById(req.params.id);
  if (!cliente) return res.status(404).json({ success: false, message: 'Cliente no encontrado' });
  
  cliente.activo = !cliente.activo;
  await cliente.save();
  
  const mensaje = cliente.activo ? 'Cliente activado' : 'Cliente desactivado';
  res.status(200).json({ success: true, message: mensaje, data: cliente });
});

const getClientesActivos = asyncHandler(async (req, res) => {
  const clientes = await Cliente.find({ activo: true }).sort({ nombre: 1 });
  res.status(200).json({ success: true, data: clientes });
});

// Obtener estadísticas de clientes
const getClienteStats = asyncHandler(async (req, res) => {
  const total = await Cliente.countDocuments();
  const activos = await Cliente.countDocuments({ activo: true });
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
  getClientes,
  getClienteById,
  createCliente,
  updateCliente,
  deleteCliente,
  getClientesConEstado,
  toggleClienteStatus,
  getClientesActivos,
  getClienteStats
};
