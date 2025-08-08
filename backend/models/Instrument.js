const mongoose = require('mongoose');

// esquema para los instrumentos musicales
const instrumentSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  tipo: { type: String, enum: ['guitarra', 'bajo'], required: true }, // solo permite guitarra o bajo
  marca: { type: String, required: true },
  cuerdas: { type: Number, required: true },
  descripcion: { type: String, required: true },
  imagen: { type: String, required: true }, // ejemplo: "esp_viper.jpg"
  precio: { type: Number, required: true }
});

// exportar el modelo para usarlo en otras partes de la app
module.exports = mongoose.model('Instrument', instrumentSchema);