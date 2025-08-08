const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// clave secreta para los tokens JWT
const JWT_SECRET = 'secreto-super-importante'; 

// ruta para registro de usuarios
router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    // verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Usuario ya existe' });

    // encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // crear y guardar el nuevo usuario
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Usuario registrado correctamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// ruta para login de usuarios
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // buscar el usuario por email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Credenciales inválidas' });

    // verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Credenciales inválidas' });

    // generar token JWT
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    // responder con el token y datos del usuario
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      email: user.email
    });
  } catch (err) {
    res.status(500).json({ message: 'Error del servidor' });
  }
});

// exportar las rutas
module.exports = router;