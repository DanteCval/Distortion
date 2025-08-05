const express = require('express');
const router = express.Router();
const Instrument = require('../models/Instrument');

// GET todos los instrumentos
router.get('/', async (req, res) => {
  const instrumentos = await Instrument.find();
  res.json(instrumentos);
});

// GET por ID
router.get('/:id', async (req, res) => {
  try {
    const instrumento = await Instrument.findById(req.params.id);
    if (!instrumento) return res.status(404).json({ error: 'No encontrado' });
    res.json(instrumento);
  } catch (err) {
    res.status(400).json({ error: 'ID inválido' });
  }
});

// POST nuevo instrumento (admin)
router.post('/', async (req, res) => {
  const nuevo = new Instrument(req.body);
  try {
    await nuevo.save();
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(400).json({ error: 'Error al guardar' });
  }
});

// DELETE instrumento (admin)
router.delete('/:id', async (req, res) => {
  try {
    await Instrument.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Eliminado correctamente' });
  } catch (err) {
    res.status(400).json({ error: 'Error al eliminar' });
  }
});

module.exports = router;
