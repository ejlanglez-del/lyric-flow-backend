const asyncHandler = require('express-async-handler');
const natural = require('natural');

// Cargar stopwords en español (método robusto)
const stopwords = require('natural/lib/natural/stopwords/stopwords_es');

// @desc    Analizar un texto y devolverlo estructurado para resaltar keywords
// @route   POST /api/text/highlight
// @access  Public
const highlightKeywords = asyncHandler(async (req, res) => {
  const { text } = req.body;

  if (!text) {
    res.status(400);
    throw new Error('No se proporcionó texto para analizar');
  }

  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(text.toLowerCase());

  const keywords = [...new Set(tokens.filter(word => !stopwords.includes(word) && word.length > 2))];

  // Log de depuración
  console.log(`[DEBUG] Texto recibido: "${text.substring(0, 40)}..." | Keywords encontradas: ${keywords.join(', ') || 'Ninguna'}`);

  if (keywords.length === 0) {
    return res.json([{ text, isKeyword: false }]);
  }

  const escapedKeywords = keywords.map(kw => kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(\\b(?:${escapedKeywords.join('|')})\\b)`, 'gi');
  const parts = text.split(regex);

  const highlightedParts = parts.map(part => {
    const isKeyword = keywords.some(kw => kw.toLowerCase() === part.toLowerCase());
    return { text: part, isKeyword };
  }).filter(part => part.text !== ''); // Filtrar partes vacías

  res.json(highlightedParts);
});

module.exports = {
    highlightKeywords,
};
