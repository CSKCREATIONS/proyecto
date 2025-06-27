const mongoose = require('mongoose');

const ClienteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  tipoIdentificacion: {
    type: String,
    enum: ['CC', 'NIT', 'CE', 'TI', 'Otro'],
    default: 'CC'
  },
  identificacion: {
    type: String,
    required: true,
    unique: true
  },
  telefono: {
    type: String,
    required: true
  },
  correo: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  direccion: {
    calle: String,
    ciudad: String,
    departamento: String,
    pais: String
  },
  activo: {
    type: Boolean,
    default: true
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Cliente', ClienteSchema);
