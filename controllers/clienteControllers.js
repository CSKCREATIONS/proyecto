const Cliente = require('../models/cliente');
const { validationResult } = require('express-validator');


// Obtener todos los clientes
exports.getClientes = async (req, res) => {
  const filtro = {};
  if (req.query.esCliente !== undefined) {
    filtro.esCliente = req.query.esCliente === 'true';
  }
  const clientes = await Cliente.find(filtro);
  res.json(clientes);
};

// Obtener un cliente por ID
exports.getClienteById = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.status(200).json(cliente);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener cliente', error: err.message });
  }
};

// Crear un nuevo cliente
exports.createCliente = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('❌ Errores de validación:', errors.array());
    return res.status(400).json({ errores: errors.array() });
  }

  try {
    const nuevoCliente = new Cliente(req.body);
    await nuevoCliente.save();
    res.status(201).json(nuevoCliente);
  } catch (err) {
    console.error('❌ Error en el controlador:', err);
    res.status(500).json({ mensaje: 'Error al crear cliente' });
  }
};


// Actualizar un cliente existente
exports.updateCliente = async (req, res) => {
  try {
    const clienteActualizado = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!clienteActualizado) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.status(200).json({ message: 'Cliente actualizado', data: clienteActualizado });
  } catch (err) {
    res.status(400).json({ message: 'Error al actualizar cliente', error: err.message });
  }
};

// Eliminar un cliente
exports.deleteCliente = async (req, res) => {
  try {
    const clienteEliminado = await Cliente.findByIdAndDelete(req.params.id);
    if (!clienteEliminado) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.status(200).json({ message: 'Cliente eliminado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al eliminar cliente', error: err.message });
  }
};


