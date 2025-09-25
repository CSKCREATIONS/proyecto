
const Cotizacion = require('../models/cotizaciones');
const Cliente = require('../models/Cliente');
const Producto = require('../models/Product');

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
    // IMPORTANT: embed exactly the data provided in the request inputs (no automatic fetch-overwrite)
    const cotizacion = new Cotizacion({
      codigo: generarCodigoCotizacion(),
      cliente: {
        referencia: clienteExistente ? clienteExistente._id : undefined,
        nombre: cliente.nombre,
        ciudad: cliente.ciudad,
        direccion: cliente.direccion,
        telefono: cliente.telefono,
        correo: cliente.correo,
        esCliente: cliente.esCliente
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
    console.log('🔍 Iniciando getCotizaciones...');
    
    // Primero obtener cotizaciones sin populate para verificar datos
    const cotizacionesRaw = await Cotizacion.find().lean();
    console.log('📊 Cotizaciones encontradas sin populate:', cotizacionesRaw.length);
    
    if (cotizacionesRaw.length === 0) {
      console.log('⚠️ No hay cotizaciones en la BD');
      return res.json([]);
    }

    // Verificar y clasificar cotizaciones según su estructura
    const mongoose = require('mongoose');
    const cotizacionesEstructuraAntigua = [];
    const cotizacionesEstructuraNueva = [];
    
    cotizacionesRaw.forEach(cot => {
      if (!cot.cliente) {
        console.log('⚠️ Cotización sin cliente:', cot._id);
        return;
      }
      
      // Si cliente es un ObjectId simple (estructura antigua)
      if (mongoose.Types.ObjectId.isValid(cot.cliente)) {
        cotizacionesEstructuraAntigua.push(cot);
      }
      // Si cliente es un objeto embebido (estructura nueva)
      else if (typeof cot.cliente === 'object' && cot.cliente.referencia) {
        cotizacionesEstructuraNueva.push(cot);
      }
      else {
        console.log('⚠️ Cliente con estructura inválida:', cot.cliente, 'en cotización:', cot._id);
      }
    });

    console.log('📊 Cotizaciones estructura antigua:', cotizacionesEstructuraAntigua.length);
    console.log('📊 Cotizaciones estructura nueva:', cotizacionesEstructuraNueva.length);

    const totalCotizaciones = cotizacionesEstructuraAntigua.length + cotizacionesEstructuraNueva.length;
    
    if (totalCotizaciones === 0) {
      console.log('⚠️ No hay cotizaciones válidas para mostrar');
      return res.json([]);
    }

    // Obtener cotizaciones con estructura antigua (populate solo cliente)
    let cotizacionesAntiguas = [];
    if (cotizacionesEstructuraAntigua.length > 0) {
      const idsAntiguos = cotizacionesEstructuraAntigua.map(cot => cot._id);
      cotizacionesAntiguas = await Cotizacion
        .find({ _id: { $in: idsAntiguos } })
        .populate('cliente', 'nombre correo telefono ciudad esCliente direccion')
        .lean();
    }

    // Obtener cotizaciones con estructura nueva (populate cliente embebido)
    let cotizacionesNuevas = [];
    if (cotizacionesEstructuraNueva.length > 0) {
      const idsNuevos = cotizacionesEstructuraNueva.map(cot => cot._id);
      cotizacionesNuevas = await Cotizacion
        .find({ _id: { $in: idsNuevos } })
        .populate('cliente.referencia', 'nombre correo telefono ciudad esCliente direccion')
        .lean();
    }

    // Manejar populate de productos por separado para cada estructura
    for (let cotizacion of cotizacionesAntiguas) {
      if (cotizacion.productos && cotizacion.productos.length > 0) {
        for (let prod of cotizacion.productos) {
          if (prod.producto && mongoose.Types.ObjectId.isValid(prod.producto)) {
            try {
              const Producto = require('../models/Product');
              const productoInfo = await Producto.findById(prod.producto).lean();
              if (productoInfo) {
                prod.productoInfo = productoInfo;
              }
            } catch (err) {
              console.log('⚠️ Error al obtener producto:', prod.producto);
            }
          }
        }
      }
    }

    // Para las cotizaciones nuevas, los productos ya tienen la estructura embebida
    console.log('✅ Productos procesados para estructura antigua');

    // Combinar ambas estructuras
    const cotizaciones = [...cotizacionesAntiguas, ...cotizacionesNuevas];

    console.log('✅ Cotizaciones finales para enviar:', cotizaciones.length);
    console.log('📋 Primera cotización final:', JSON.stringify(cotizaciones[0], null, 2));
    
    // Asegurar que enviamos un array válido
    const response = {
      success: true,
      data: cotizaciones,
      total: cotizaciones.length,
      message: cotizaciones.length > 0 ? 'Cotizaciones obtenidas exitosamente' : 'No hay cotizaciones disponibles'
    };
    
    console.log('📤 Enviando respuesta:', { total: response.total, success: response.success });
    res.json(response);
  } catch (err) {
    console.error('❌ [ERROR getCotizaciones]', err);
    res.status(500).json({ 
      message: 'Error al obtener cotizaciones', 
      error: err.message 
    });
  }
};

// Obtener cotización por ID
exports.getCotizacionById = async (req, res) => {
  try {
    let cotizacion = await Cotizacion.findById(req.params.id)
      .populate('cliente', 'nombre correo ciudad telefono esCliente direccion')
      .populate('proveedor', 'nombre')
      .populate('productos.producto', 'name price');

    if (!cotizacion) {
      return res.status(404).json({ message: 'Cotización no encontrada' });
    }

    res.status(200).json({ data: cotizacion });
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
    let cotizacion = await Cotizacion.findOne({ cliente: cliente })
      .sort({ createdAt: -1 })
      .populate('productos.producto', 'name price')
      .populate('cliente', 'nombre correo ciudad telefono esCliente direccion');

    if (!cotizacion) return res.status(404).json({ message: 'No hay cotización' });

    res.json({ data: cotizacion });
  } catch (error) {
    console.error('[ERROR getUltimaCotizacionPorCliente]', error);
    res.status(500).json({ message: 'Error al obtener la cotización' });
  }
};
