const mongoose = require('mongoose');

const ventaSchema = new mongoose.Schema({
  fecha: Date,
  monto: Number,
  vendedor: String,
});

module.exports = mongoose.model('Venta', ventaSchema);
