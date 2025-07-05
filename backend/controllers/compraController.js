// controllers/compraController.js
const Compra = require('../models/compras');

exports.crearCompra = async (req, res) => {
  try {
    const { proveedor, producto, cantidad, precioUnitario } = req.body;

    const compra = new Compra({ proveedor, producto, cantidad, precioUnitario });
    await compra.save();

    res.status(201).json({ success: true, data: compra });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.obtenerCompras = async (req, res) => {
  try {
    const compras = await Compra.find()
      .populate('proveedor', 'nombre')
      .populate('producto', 'nombre');

    res.status(200).json({ success: true, data: compras });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
