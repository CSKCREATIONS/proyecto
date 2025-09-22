const Cotizacion = require('../models/cotizaciones');
const Cliente = require('../models/Cliente');
const Producto = require('../models/Products');

const { validationResult } = require('express-validator');

// Crear cotización
exports.createCotizacion = async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errors: errores.array() });
  }

  try {
    const {
      cliente,
      clientePotencial,
      fecha,
      descripcion,
      condicionesPago,
      productos,
      responsable,
      enviadoCorreo
    } = req.body;

    // Validar que responsable.id sea un ObjectId válido
    if (!responsable || !responsable.id || !responsable.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'El responsable debe ser el id del usuario registrado.' });
    }

    
    if (!cliente || !cliente.correo) {
      return res.status(400).json({ message: 'Datos de cliente inválidos' });
    }

    // Buscar cliente existente por correo
    let clienteExistente = await Cliente.findOne({ correo: cliente.correo });

    if (!clienteExistente) {
      // Crear cliente potencial
      clienteExistente = new Cliente({
        nombre: cliente.nombre,
        ciudad: cliente.ciudad,
        direccion: cliente.direccion,
        telefono: cliente.telefono,
        correo: cliente.correo,
        esCliente: !clientePotencial // true si es cliente, false si prospecto
      });
      await clienteExistente.save();
    } else {
      // Si ya existe, asegúrate de que se marque como cliente
      if (!clienteExistente.esCliente && !clientePotencial) {
        clienteExistente.esCliente = true;
        await clienteExistente.save();
      }
    }

    let fechaCotizacion = null;

    if (fecha && !isNaN(new Date(fecha).getTime())) {
      fechaCotizacion = new Date(fecha);
    } else {
      fechaCotizacion = new Date(); // si no viene, usa la fecha actual
    }



    // Generar código aleatorio COT-XXXX (letras y números)
    function generarCodigoCotizacion() {
      const chars = 'AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789';
      let codigo = '';
      for (let i = 0; i < 4; i++) {
        codigo += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return `COT-${codigo}`;
    }

    // Mapear productos con nombre
    const productosConNombre = await Promise.all(
      productos.map(async (prod) => {
        let productoInfo = null;
        if (prod.producto && prod.producto.id) {
          productoInfo = await Producto.findById(prod.producto.id).lean();
        }
        return {
          producto: {
            id: prod.producto.id,
            name: productoInfo ? productoInfo.name : prod.producto.name
          },
          descripcion: prod.descripcion,
          cantidad: prod.cantidad,
          valorUnitario: prod.valorUnitario,
          descuento: prod.descuento,
          subtotal: prod.subtotal
        };
      })
    );

    // Crear cotización con todos los datos embebidos y referencias
    const cotizacion = new Cotizacion({
      codigo: generarCodigoCotizacion(),
      cliente: {
        referencia: clienteExistente._id,
        nombre: clienteExistente.nombre,
        ciudad: clienteExistente.ciudad,
        direccion: clienteExistente.direccion,
        telefono: clienteExistente.telefono,
        correo: clienteExistente.correo,
        esCliente: clienteExistente.esCliente
      },
      responsable: {
        id: responsable.id,
        firstName: responsable.firstName,
        secondName: responsable.secondName,
        surname: responsable.surname,
        secondSurname: responsable.secondSurname
      },
      fecha: fechaCotizacion,
      descripcion,
      condicionesPago,
      productos: productosConNombre,
      empresa: req.body.empresa || undefined,
      clientePotencial,
      enviadoCorreo
    });

    await cotizacion.save();

    // Obtener datos completos del cliente
    const cotizacionConCliente = await Cotizacion.findById(cotizacion._id)
      .populate('cliente.referencia', 'nombre correo ciudad telefono esCliente');

    res.status(201).json({ message: 'Cotización creada', data: cotizacionConCliente });

  } catch (error) {
    console.error('❌ Error al crear cotización:', error);
    res.status(500).json({ message: 'Error al crear cotización', error: error.message });
  }
};



// Obtener todas las cotizaciones
exports.getCotizaciones = async (req, res) => {
  try {
    const cotizaciones = await Cotizacion
      .find()
      .populate('cliente.referencia', 'nombre correo telefono ciudad esCliente');

    res.json(cotizaciones);
  } catch (err) {
    console.error('[ERROR getCotizaciones]', err);
    res.status(500).json({ message: 'Error al obtener cotizaciones' });
  }
};






// Obtener cotización por ID
exports.getCotizacionById = async (req, res) => {
  try {
    let cotizacion = await Cotizacion.findById(req.params.id)
      .populate('cliente.referencia', 'nombre correo ciudad telefono esCliente')
      .populate('proveedor', 'nombre')
      .populate('productos.producto.id', 'name price');

    if (!cotizacion) {
      return res.status(404).json({ message: 'Cotización no encontrada' });
    }

    // Flatten populated product data for easier frontend consumption
    const cotObj = cotizacion.toObject();
    if (Array.isArray(cotObj.productos)) {
      cotObj.productos = cotObj.productos.map(p => {
        if (p.producto && p.producto.id) {
          p.producto.name = p.producto.id.name || p.producto.name;
          p.producto.price = p.producto.id.price || p.producto.price;
        }
        return p;
      });
    }

    res.status(200).json({ data: cotObj });
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
    // No permitir cambiar el código ni el _id
    const { codigo, _id, ...rest } = req.body;
    // Si se actualiza cliente, asegurar estructura embebida
    if (rest.cliente && rest.cliente.referencia) {
      // Mantener formato embebido
    }
    const cotizacion = await Cotizacion.findByIdAndUpdate(
      req.params.id,
      rest,
      { new: true }
    );
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



exports.getUltimaCotizacionPorCliente = async (req, res) => {
  const { cliente } = req.query;

  try {
    let cotizacion = await Cotizacion.findOne({ 'cliente.referencia': cliente })
      .sort({ createdAt: -1 })
      .populate('productos.producto.id', 'name price')
      .populate('cliente.referencia', 'nombre correo ciudad telefono esCliente');

    if (!cotizacion) return res.status(404).json({ message: 'No hay cotización' });

    const cotObj = cotizacion.toObject();
    if (Array.isArray(cotObj.productos)) {
      cotObj.productos = cotObj.productos.map(p => {
        if (p.producto && p.producto.id) {
          p.producto.name = p.producto.id.name || p.producto.name;
          p.producto.price = p.producto.id.price || p.producto.price;
        }
        return p;
      });
    }

    res.json({ data: cotObj });
  } catch (error) {
    console.error('[ERROR getUltimaCotizacionPorCliente]', error);
    res.status(500).json({ message: 'Error al obtener la cotización' });
  }
};

