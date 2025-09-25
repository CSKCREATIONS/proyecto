const { asyncHandler } = require('../middleware/errorHandler');
const Pedido = require('../models/Pedido');
const Venta = require('../models/venta');
const Product = require('../models/Product');

const getPedidos = asyncHandler(async (req, res) => {
  const { estado } = req.query;
  const filtro = estado ? { estado } : {};
  const pedidos = await Pedido.find(filtro).populate('cliente').populate('productos.product');
  res.status(200).json({ success: true, data: pedidos });
});

const createPedido = asyncHandler(async (req, res) => {
  const { cliente, productos, fechaEntrega, observacion } = req.body;
  
  // Obtener información de los productos para garantizar que tengan precio
  const productosConPrecio = await Promise.all(
    productos.map(async (producto) => {
      const productoEnDB = await Product.findById(producto.product);
      if (!productoEnDB) {
        throw new Error(`Producto con ID ${producto.product} no encontrado`);
      }
      return {
        product: producto.product,
        cantidad: producto.cantidad,
        precioUnitario: producto.precioUnitario || productoEnDB.precio
      };
    })
  );
  
  const nuevoPedido = new Pedido({
    cliente,
    productos: productosConPrecio,
    fechaEntrega,
    observacion
  });
  
  const pedidoGuardado = await nuevoPedido.save();
  const pedidoCompleto = await Pedido.findById(pedidoGuardado._id)
    .populate('cliente')
    .populate('productos.product');
    
  res.status(201).json({ 
    success: true, 
    data: pedidoCompleto, 
    message: 'Pedido creado correctamente' 
  });
});

const getPedidoById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const pedido = await Pedido.findById(id)
    .populate('cliente')
    .populate('productos.product');
  if (!pedido) {
    return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
  }
  res.status(200).json({ success: true, data: pedido });
});

const updatePedido = asyncHandler(async (req, res) => {
  const pedidoActualizado = await Pedido.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!pedidoActualizado) {
    return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
  }
  res.status(200).json({ success: true, data: pedidoActualizado, message: 'Pedido actualizado' });
});

const deletePedido = asyncHandler(async (req, res) => {
  const pedidoEliminado = await Pedido.findByIdAndDelete(req.params.id);
  if (!pedidoEliminado) {
    return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
  }
  res.status(200).json({ success: true, message: 'Pedido eliminado' });
});

const cambiarEstadoPedido = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  const pedido = await Pedido.findById(id);
  if (!pedido) {
    return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
  }
  pedido.estado = estado;
  await pedido.save();
  res.status(200).json({ success: true, message: 'Estado del pedido actualizado', data: pedido });
});

const actualizarEstadoPedido = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { nuevoEstado } = req.body;
  const pedido = await Pedido.findById(id)
    .populate('productos.product')
    .populate('cliente');
  if (!pedido) {
    return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
  }
  pedido.estado = nuevoEstado;
  await pedido.save();
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
  res.status(200).json({ success: true, message: 'Estado del pedido actualizado correctamente', data: pedido });
});

const marcarComoEntregado = asyncHandler(async (req, res) => {
  const pedido = await Pedido.findById(req.params.id)
    .populate('productos.product')
    .populate('cliente');
  if (!pedido) return res.status(404).json({ success: false, message: 'Pedido no encontrado' });
  pedido.estado = 'entregado';
  await pedido.save();
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
  res.status(200).json({ success: true, message: 'Pedido entregado y venta registrada correctamente', data: venta });
});

module.exports = {
  getPedidos,
  createPedido,
  getPedidoById,
  updatePedido,
  deletePedido,
  cambiarEstadoPedido,
  actualizarEstadoPedido,
  marcarComoEntregado
};