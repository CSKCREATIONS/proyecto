const Category = require('../models/category');
const Subcategory = require('../models/Subcategory');
const Product = require('../models/Products');
const Cotizacion = require('../models/cotizaciones');
const Cliente = require('../models/Cliente');
const Pedido = require('../models/Pedido');
const Venta = require('../models/venta');
const Proveedor = require('../models/proveedores');

// Reporte de categorías con estadísticas
exports.reporteCategorias = async (req, res) => {
  try {
    const categorias = await Category.aggregate([
      {
        $lookup: {
          from: 'subcategories',
          localField: '_id',
          foreignField: 'category',
          as: 'subcategorias'
        }
      },
      {
        $project: {
          name: 1,
          description: 1,
          activo: 1,
          createdAt: 1,
          totalSubcategorias: { $size: '$subcategorias' }
        }
      }
    ]);

    res.status(200).json({ success: true, data: categorias });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Reporte de subcategorías con productos
exports.reporteSubcategorias = async (req, res) => {
  try {
    const subcategorias = await Subcategory.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'subcategory',
          as: 'productos'
        }
      },
      {
        $project: {
          name: 1,
          description: 1,
          activo: 1,
          category: 1,
          totalProductos: { $size: '$productos' },
          productosBajoStock: {
            $size: {
              $filter: {
                input: '$productos',
                as: 'prod',
                cond: { $lt: ['$$prod.stock', 10] } // Stock < 10
              }
            }
          }
        }
      }
    ]).exec();

    res.status(200).json({ success: true, data: subcategorias });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Reporte de productos avanzado
exports.reporteProductos = async (req, res) => {
  try {
    const { minStock, maxPrice, categoria } = req.query;
    const filters = {};

    if (minStock) filters.stock = { $gte: parseInt(minStock) };
    if (maxPrice) filters.price = { $lte: parseFloat(maxPrice) };
    if (categoria) filters.category = categoria;

    const productos = await Product.find(filters)
      .populate('category', 'name')
      .populate('subcategory', 'name')
      .populate('proveedor', 'nombre empresa');

    res.status(200).json({ success: true, count: productos.length, data: productos });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.reporteConsolidado = async (req, res) => {
  try {
    // Total de productos
    const totalProductos = await Product.countDocuments();

    // Productos con bajo stock (<10)
    const productosBajoStock = await Product.countDocuments({ stock: { $lt: 10 } });

    // Productos por estado (activo/inactivo)
    const productosPorEstado = await Product.aggregate([
      {
        $group: {
          _id: '$activo',
          count: { $sum: 1 }
        }
      }
    ]);

    // Productos por categoría
    const productosPorCategoria = await Category.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'category',
          as: 'productos'
        }
      },
      {
        $project: {
          name: 1,
          description: 1,
          activo: 1,
          createdAt: 1,
          totalProductos: { $size: '$productos' },
          productosActivos: {
            $size: {
              $filter: {
                input: '$productos',
                as: 'prod',
                cond: { $eq: ['$$prod.activo', true] }
              }
            }
          }
        }
      },
      { $sort: { totalProductos: -1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalProductos,
        productosBajoStock,
        productosPorEstado,
        productosPorCategoria
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


//ventas



exports.reporteVentasPorPeriodo = async (req, res) => {
  try {
    // Puedes recibir opcionalmente un rango de fechas desde el frontend
    const { desde, hasta } = req.query;

    const filtroFecha = {};
    if (desde && hasta) {
      filtroFecha.fecha = {
        $gte: new Date(desde),
        $lte: new Date(hasta)
      };
    }

    const ventas = await Venta.aggregate([
      { $match: filtroFecha },
      {
        $group: {
          _id: {
            año: { $year: '$fecha' },
            mes: { $month: '$fecha' },
            dia: { $dayOfMonth: '$fecha' }
          },
          totalVentas: { $sum: 1 },
          totalIngresos: { $sum: '$total' }
        }
      },
      { $sort: { '_id.año': 1, '_id.mes': 1, '_id.dia': 1 } }
    ]);

    res.json({
      success: true,
      data: ventas
    });

  } catch (error) {
    console.error('Error en reporteVentasPorPeriodo:', error);
    res.status(500).json({ success: false, message: 'Error al generar el reporte de ventas por periodo' });
  }
};




exports.reportePedidosPorEstado = async (req, res) => {
  try {
    const resultado = await Pedido.aggregate([
      {
        $group: {
          _id: '$estado',
          cantidad: { $sum: 1 }
        }
      },
      {
        $project: {
          estado: '$_id',
          cantidad: 1,
          _id: 0
        }
      }
    ]);

    res.json({
      success: true,
      data: resultado
    });

  } catch (error) {
    console.error('Error en reportePedidosPorEstado:', error);
    res.status(500).json({ success: false, message: 'Error al generar el reporte de pedidos por estado' });
  }
};


exports.reporteCotizaciones = async (req, res) => {
  try {
    const { desde, hasta } = req.query;

    const filtro = {};

    // Validar que las fechas existan y sean válidas
    if (desde && hasta && !isNaN(new Date(desde)) && !isNaN(new Date(hasta))) {
      filtro.fecha = {
        $gte: new Date(desde),
        $lte: new Date(hasta)
      };
    }

    const total = await Cotizacion.countDocuments(filtro);

    const enviadas = await Cotizacion.countDocuments({
      ...filtro,
      enviadoCorreo: true
    });

    const noEnviadas = total - enviadas;

    res.json({
      success: true,
      data: {
        total,
        enviadas,
        noEnviadas
      }
    });

  } catch (error) {
    console.error('Error en reporteCotizaciones:', error);
    res.status(500).json({ success: false, message: 'Error al generar el reporte de cotizaciones' });
  }
};



// controllers/reportesController.js

exports.reporteClientes = async (req, res) => {
  try {
    const total = await Cliente.countDocuments();
    const activos = await Cliente.countDocuments({ activo: true });
    const inactivos = total - activos;

    // Clientes con más compras (ordenado por totalCompras)
    const topClientes = await Cliente.find({ totalCompras: { $gt: 0 } })
      .sort({ totalCompras: -1 })
      .limit(5)
      .select('nombre email totalCompras activo');

    res.json({
      success: true,
      data: {
        total,
        activos,
        inactivos,
        topClientes
      }
    });
  } catch (error) {
    console.error('Error en reporteClientes:', error);
    res.status(500).json({ success: false, message: 'Error al generar el reporte de clientes' });
  }
};


////// prov y com

// Proveedores por país


exports.reporteProveedoresPorPais = async (req, res) => {
  try {
    const resultado = await Proveedor.aggregate([
      { $group: { _id: '$direccion.pais', cantidad: { $sum: 1 } } },
      { $project: { pais: '$_id', cantidad: 1, _id: 0 } },
      { $sort: { cantidad: -1 } }
    ]);
    res.json({ success: true, data: resultado });
  } catch (error) {
    console.error('Error reporteProveedoresPorPais:', error);
    res.status(500).json({ success: false, message: 'Error al obtener reporte' });
  }
};


// Productos por proveedor
exports.reporteProductosPorProveedor = async (req, res) => {
  try {
    const resultado = await Proveedor.aggregate([
      {
        $project: {
          nombre: 1,
          empresa: 1,
          totalProductos: { $size: { $ifNull: ['$productos', []] } }
        }
      },
      { $sort: { totalProductos: -1 } }
    ]);
    res.json({ success: true, data: resultado });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener productos por proveedor' });
  }
};


// Estado (activos/inactivos)
exports.reporteEstadoProveedores = async (req, res) => {
  try {
    const resultado = await Proveedor.aggregate([
      {
        $group: {
          _id: '$activo',
          cantidad: { $sum: 1 }
        }
      }
    ]);
    res.json({ success: true, data: resultado });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al agrupar por estado' });
  }
};

// Proveedores recientes
exports.reporteProveedoresRecientes = async (req, res) => {
  try {
    const resultado = await Proveedor.find()
      .sort({ fechaCreacion: -1 })
      .limit(5);
    res.json({ success: true, data: resultado });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener proveedores recientes' });
  }
};






