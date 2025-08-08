const express = require('express');
const router = express.Router();
const Instrument = require('../models/Instrument');

// obtener todos los instrumentos
router.get('/', async (req, res) => {
  const instrumentos = await Instrument.find();
  res.json(instrumentos);
});

// obtener un instrumento por su ID
router.get('/:id', async (req, res) => {
  try {
    const instrumento = await Instrument.findById(req.params.id);
    if (!instrumento) return res.status(404).json({ error: 'No encontrado' });
    res.json(instrumento);
  } catch (err) {
    res.status(400).json({ error: 'ID inválido' });
  }
});

// crear nuevo instrumento (para admin)
router.post('/', async (req, res) => {
  const nuevo = new Instrument(req.body);
  try {
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(400).json({ error: 'Error al guardar' });
  }
});

// eliminar instrumento (para admin)
router.delete('/:id', async (req, res) => {
  try {
    await Instrument.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Eliminado correctamente' });
  } catch (err) {
    res.status(400).json({ error: 'Error al eliminar' });
  }
});

// exportar las rutas
module.exports = router;