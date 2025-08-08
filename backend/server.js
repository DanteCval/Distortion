const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// importar rutas
const authRoutes = require('./routes/auth');
const instrumentRoutes = require('./routes/instrumentRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(cors()); // permitir peticiones de otros dominios
app.use(express.json()); // parsear JSON en las peticiones

// servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, 'frontend')));

// ruta principal que sirve el home
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/home.html'));
});

// configuración anterior comentada
//app.use(express.static(path.join(__dirname, '../frontend')));

//app.get('/', (req, res) => {
 // res.sendFile(path.join(__dirname, '../frontend/home.html'));
//});

// rutas de la API
app.use('/api/auth', authRoutes); // rutas de autenticación
app.use('/api/instrumentos', instrumentRoutes); // rutas de instrumentos

// configuración de la base de datos
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/catalogo';

// conectar a MongoDB y iniciar servidor
mongoose.connect(MONGO_URI, { dbName: 'railway' })
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
  })
  .catch(err => console.error(err));