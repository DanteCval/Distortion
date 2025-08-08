const mongoose = require('mongoose');

// esquema para los usuarios del sitio
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true }, // email único para cada usuario
  password: { type: String, required: true }
});

// exportar el modelo para usarlo en otras partes de la app
module.exports = mongoose.model('User', userSchema);