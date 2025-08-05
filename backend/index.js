const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/userRoutes');
// ✅ CORRECTO
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const app = express();
const PORT = 3000;

app.use(cors()); // permite peticiones desde frontend (Live Server)
app.use(bodyParser.json());

app.use('/api', userRoutes);

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
