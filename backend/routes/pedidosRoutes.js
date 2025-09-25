
const express = require('express');
const router = express.Router();
const Pedido = require('../models/Pedido');
const { verifyToken } = require('../middlewares/authJwt');
const pedidoController = require('../controllers/pedidoControllers');
const { checkRole } = require('../middlewares/role');
const Venta = require('../models/venta');
const { checkPermission } = require('../middlewares/role');

// Función para generar número de pedido
async function generarNumeroPedido() {
  const ultimo = await Pedido.findOne().sort({ createdAt: -1 });
  const siguiente = ultimo && ultimo.numeroPedido
    ? parseInt(ultimo.numeroPedido.replace('PED-', '')) + 1
    : 1;
  return `PED-${siguiente.toString().padStart(5, '0')}`;
}

//
// === RUTAS ===
//

// Crear pedido
router.post('/',
   verifyToken, 
   checkPermission('ventas.crear'),
   async (req, res) => {
  try {
    const { cliente, productos, fechaEntrega, observacion, cotizacionReferenciada, cotizacionCodigo } = req.body;

    if (!cliente || !productos || productos.length === 0 || !fechaEntrega) {
      return res.status(400).json({ mensaje: 'Faltan datos requeridos' });
    }

    const numeroPedido = await generarNumeroPedido();

    const nuevoPedido = new Pedido({
      numeroPedido,
      cliente,
      productos: productos.map(item => ({
        product: item.product,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario
      })),
      fechaEntrega,
      observacion,
      cotizacionReferenciada: cotizacionReferenciada || undefined,
      cotizacionCodigo: cotizacionCodigo || ''
    });

    const pedidoGuardado = await nuevoPedido.save();
    res.status(201).json(pedidoGuardado);
  } catch (error) {
    console.error('❌ Error al crear pedido:', error);
    res.status(500).json({ mensaje: 'Error al crear pedido' });
  }
});


// Obtener todos los pedidos
router.get('/', 
  verifyToken,
  checkPermission('pedidos.ver'),
   pedidoController.getPedidos
  );

  router.get('/:id', 
  verifyToken,
  checkPermission('pedidos.ver'),
   pedidoController.getPedidoById
  );

// Cambiar estado del pedido (genérico)
router.patch('/:id/estado',
   verifyToken, 
   pedidoController.cambiarEstadoPedido
  );



// Marcar pedido como entregado
router.put('/:id/entregar', verifyToken, async (req, res) => {
  try {
    const pedido = await Pedido.findById(req.params.id)
      .populate('productos.product') // Asegúrate de que en tu esquema sea `productos.product`, no `productos.producto`
      .populate('cliente')
      .exec();


    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    const productosVenta = pedido.productos.map(item => {
      if (!item.product) {
        console.log('🛑 Producto no encontrado (referencia rota):', item);
        throw new Error('Producto no encontrado en el pedido (referencia rota o eliminado)');
      }

      if (typeof item.product.price !== 'number') {
        console.log('🛑 Producto sin precio numérico válido:', item.product);
        throw new Error(`Producto sin precio válido: ${item.product.name || 'Sin nombre'}`);
      }


      return {
        producto: item.product._id,
        cantidad: item.cantidad,
        precioUnitario: item.product.price
      };
    });

    const total = productosVenta.reduce((sum, item) => {
      return sum + item.cantidad * item.precioUnitario;
    }, 0);

    const nuevaVenta = new Venta({
      cliente: pedido.cliente._id,
      productos: productosVenta,
      total,
      fecha: new Date(),
      estado: 'completado',
      pedidoReferenciado: pedido._id
    });

    await nuevaVenta.save();

    // Solo actualizamos el estado del pedido, no tocamos los productos
    pedido.estado = 'entregado';
    await pedido.save();

    res.json({ message: 'Pedido entregado y venta registrada', venta: nuevaVenta });

  } catch (error) {
    console.error('❌ Error al entregar pedido:', error);
    res.status(500).json({ message: 'Error al entregar el pedido', error: error.message });
  }
});


// Marcar pedido como devuelto
router.patch('/:id/devolver', verifyToken, async (req, res) => {
  try {
    const { motivo } = req.body;

    // 1. Actualizar el pedido
    const pedido = await Pedido.findByIdAndUpdate(
      req.params.id,
      { estado: 'devuelto', motivoDevolucion: motivo },
      { new: true }
    );

    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    // 2. Actualizar la venta relacionada
    const venta = await Venta.findOneAndUpdate(
      { pedidoReferenciado: pedido._id },
      { estado: 'devuelto' },
      { new: true }
    );

    if (!venta) {
      return res.status(404).json({ message: 'Venta no encontrada vinculada al pedido' });
    }

    res.json({
      message: 'Pedido y venta marcados como devueltos',
      pedido,
      venta
    });
  } catch (err) {
    console.error('Error al marcar como devuelto:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Cancelar pedido
router.patch('/:id/cancelar', verifyToken, async (req, res) => {
  try {
    const pedido = await Pedido.findByIdAndUpdate(
      req.params.id,
      { estado: 'cancelado' },
      { new: true }
    );

    if (!pedido) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }

    res.json({ message: 'Pedido cancelado', pedido });
  } catch (err) {
    console.error('Error al cancelar pedido:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});



module.exports = router;
