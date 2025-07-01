const mongoose = require('mongoose');

const ClienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  ciudad: String,
  telefono: String,
  correo: String,
  direccion: String,
  esCliente: { type: Boolean, default: true }
});

module.exports = mongoose.model('Cliente', ClienteSchema);
// Este modelo define la estructura de un cliente en la base de datos.