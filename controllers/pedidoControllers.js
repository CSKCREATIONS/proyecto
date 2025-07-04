// controllers/pedidoController.js
const Pedido = require('../models/Pedido');
const Venta = require('../models/venta'); // Asegúrate de tener el modelo importado
const Product = require('../models/Products'); // para calcular precios




exports.getPedidos = async (req, res) => {
  try {
    const { estado } = req.query;
    const filtro = estado ? { estado } : {};
    const pedidos = await Pedido.find(filtro).populate('cliente').populate('productos.product');
    res.json(pedidos);
  } catch (err) {
    console.error('Error al obtener pedidos:', err);
    res.status(500).json({ message: 'Error al obtener pedidos' });
  }
};


// Crear pedido
exports.createPedido = async (req, res) => {
  try {
    const { cliente, productos, fechaEntrega, observacion } = req.body;

    const nuevoPedido = new Pedido({
      cliente,
      productos,
      fechaEntrega,
      observacion
    });

    const pedidoGuardado = await nuevoPedido.save();
    res.status(201).json(pedidoGuardado);
  } catch (err) {
    console.error('❌ Error al crear pedido:', err);
    res.status(500).json({ message: 'Error al crear el pedido' });
  }
};


exports.cambiarEstadoPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const pedido = await Pedido.findById(id);
    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    pedido.estado = estado;
    await pedido.save();

    res.json({ message: 'Estado del pedido actualizado', pedido });
  } catch (err) {
    console.error('Error al cambiar el estado del pedido:', err);
    res.status(500).json({ message: 'Error interno al cambiar estado del pedido' });
  }
};


exports.actualizarEstadoPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const { nuevoEstado } = req.body;

    const pedido = await Pedido.findById(id)
      .populate('productos.product') // importante que el campo sea productos.product
      .populate('cliente');

    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    pedido.estado = nuevoEstado;
    await pedido.save();

    // Si el nuevo estado es 'entregado', registrar la venta
    if (nuevoEstado === 'entregado') {
      const productosVenta = pedido.productos.map(item => {
        if (!item.product || item.product.precio == null) {
          throw new Error(`Falta el precio del producto: ${item.product?._id}`);
        }

        return {
          producto: item.product._id,
          cantidad: item.cantidad,
          precioUnitario: item.product.precio
        };
      });

      const total = productosVenta.reduce((sum, p) => sum + (p.cantidad * p.precioUnitario), 0);

      const venta = new Venta({
        cliente: pedido.cliente._id,
        productos: productosVenta,
        total,
        estado: 'completado',
        pedidoReferenciado: pedido._id,
        fecha: new Date()
      });

      await venta.save();
    }

    res.status(200).json({ message: 'Estado del pedido actualizado correctamente' });

  } catch (error) {
    console.error('❌ Error al actualizar estado del pedido:', error);
    res.status(500).json({ message: 'Error al actualizar estado del pedido', error });
  }
};



exports.marcarComoEntregado = async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id)
      .populate('productos.product') // Asegúrate que el campo se llama "productos.product"
      .populate('cliente');

    if (!pedido) return res.status(404).json({ message: 'Pedido no encontrado' });

    // Cambiar estado
    pedido.estado = 'entregado';
    await pedido.save();

    // Construir productosVenta con precioUnitario
    const productosVenta = pedido.productos.map(item => {
      if (!item.product || item.product.precio == null) {
        throw new Error(`Falta el precio del producto: ${item.product?._id}`);
      }

      return {
        producto: item.product._id,
        cantidad: item.cantidad,
        precioUnitario: item.product.precio
      };
    });

    // Calcular total
    const total = productosVenta.reduce((sum, p) => sum + (p.cantidad * p.precioUnitario), 0);

    // Registrar venta
    const venta = new Venta({
      cliente: pedido.cliente._id,
      productos: productosVenta,
      total,
      estado: 'completado',
      pedidoReferenciado: pedido._id,
      fecha: new Date()
    });

    await venta.save();

    res.json({ message: 'Pedido entregado y venta registrada correctamente', venta });

  } catch (error) {
    console.error('❌ Error al entregar pedido y crear venta:', error);
    res.status(500).json({ message: 'Error al entregar pedido y crear venta' });
  }
};

