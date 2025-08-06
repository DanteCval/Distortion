const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // ← AÑADIDO
const authRoutes = require('./routes/auth');

const app = express();
const PORT = 3000;

// SERVIR FRONTEND
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/home.html'));
});

// Middlewares
app.use(cors()); // ← AÑADIDO
app.use(express.json()); // 👈 necesario para leer req.body
app.use(bodyParser.json());
app.use('/api/auth', authRoutes);

// Conexión a MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/catalogo';

mongoose.connect(MONGO_URI, { dbName: 'railway' })
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
  })
  .catch(err => console.error(err));

const instrumentRoutes = require('./routes/instrumentRoutes');
app.use('/api/instrumentos', instrumentRoutes);
// Rutas de instrumentos
