const Cotizacion = require('../models/cotizaciones');
const Cliente = require('../models/cliente');

const { validationResult } = require('express-validator');

// Crear cotización
exports.createCotizacion = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errors: errores.array() });
  }

  try {
    // Extraer datos del cliente
    const {
      cliente: nombre,
      ciudad,
      telefono,
      correo,
      clientePotencial,
      fecha
    } = req.body;

    // Buscar cliente existente por correo
    let clienteExistente = await Cliente.findOne({ correo });

    // Si no existe, se crea
    if (!clienteExistente) {
      clienteExistente = new Cliente({
        nombre,
        ciudad,
        telefono,
        correo,
        esCliente: !clientePotencial
      });
      await clienteExistente.save();
    }

    // Crear cotización con referencia al _id del cliente
    const cotizacion = new Cotizacion({
    cliente: clienteExistente._id,
    ciudad,
    telefono,
    correo,
    responsable: req.body.responsable,
    fecha: new Date(fecha),
    descripcion: req.body.descripcion,
    condicionesPago: req.body.condicionesPago,
    productos: req.body.productos,
    clientePotencial,
    enviadoCorreo: req.body.enviadoCorreo
  });


    await cotizacion.save();

  const cotizacionConCliente = await Cotizacion.findById(cotizacion._id).populate('cliente', 'nombre');
  res.status(201).json({ message: 'Cotización creada', data: cotizacionConCliente });

  } catch (error) {
    console.error('❌ Error al crear cotización:', error);
    res.status(500).json({ message: 'Error al crear cotización', error: error.message });
  }
};


// Obtener todas las cotizaciones
exports.getCotizaciones = async (req, res) => {
  try {
    const cotizaciones = await Cotizacion.find()
      .populate('cliente', 'nombre') // Esto llena el nombre del cliente
      .populate('productos.producto', 'name price'); // Solo si usas ref a Producto

    res.status(200).json(cotizaciones);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener cotizaciones', error: error.message });
  }
};



// Obtener cotización por ID
exports.getCotizacionById = async (req, res) => {
  try {
    const cotizacion = await Cotizacion.findById(req.params.id)
      .populate('cliente', 'nombre')
      .populate('proveedor', 'nombre')
      .populate('productos.producto', 'name price');

    if (!cotizacion) {
      return res.status(404).json({ message: 'Cotización no encontrada' });
    }

    res.status(200).json(cotizacion);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener cotización', error: error.message });
  }
};

// Actualizar cotización
exports.updateCotizacion = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errors: errores.array() });
  }

  try {
    const cotizacion = await Cotizacion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cotizacion) return res.status(404).json({ message: 'Cotización no encontrada' });
    res.status(200).json({ message: 'Cotización actualizada', data: cotizacion });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar cotización', error: error.message });
  }
};

// Eliminar cotización
exports.deleteCotizacion = async (req, res) => {
  try {
    const cotizacion = await Cotizacion.findByIdAndDelete(req.params.id);
    if (!cotizacion) return res.status(404).json({ message: 'Cotización no encontrada' });
    res.status(200).json({ message: 'Cotización eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar cotización', error: error.message });
  }
};

// Cambiar estado de cotización
exports.updateEstadoCotizacion = async (req, res) => {
  const { estado } = req.body;
  try {
    const cotizacion = await Cotizacion.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true }
    );
    if (!cotizacion) return res.status(404).json({ message: 'Cotización no encontrada' });
    res.status(200).json({ message: 'Estado actualizado', data: cotizacion });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar estado', error: error.message });
  }
};
