const Category = require('../models/category');
const Subcategory = require('../models/Subcategory');
const Product = require('../models/products');


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
