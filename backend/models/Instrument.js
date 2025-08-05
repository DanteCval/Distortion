const mongoose = require('mongoose');

const instrumentSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  tipo: { type: String, enum: ['guitarra', 'bajo'], required: true },
  marca: { type: String, required: true },
  cuerdas: { type: Number, required: true },
  descripcion: { type: String, required: true },
  imagen: { type: String, required: true }, // ejemplo: "esp_viper.jpg"
  precio: { type: Number, required: true }
});

module.exports = mongoose.model('Instrument', instrumentSchema);
