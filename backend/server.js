const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const instrumentRoutes = require('./routes/instrumentRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json()); // Suficiente para parsear JSON

// SERVIR FRONTEND
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/home.html'));
});

// Rutas de API
app.use('/api/auth', authRoutes);
app.use('/api/instrumentos', instrumentRoutes);

// Conexión a MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/catalogo';

mongoose.connect(MONGO_URI, { dbName: 'railway' })
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
  })
  .catch(err => console.error(err));
