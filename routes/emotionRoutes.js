const express = require('express');
const router = express.Router();
const { analyzeEmotion, analyzeContext } = require('../controllers/emotionController');

// Ruta para analizar un párrafo individual (con contexto opcional)
router.post('/', analyzeEmotion);

// Ruta para analizar el contexto de una canción completa
router.post('/context', analyzeContext);

module.exports = router;
