const asyncHandler = require('express-async-handler');
const natural = require('natural');
const { keywordToEmotionMap, normalizeText } = require('../utils/emotionMapper');

// --- INICIALIZACIÓN DE HERRAMIENTAS ---
const analyzer = new natural.SentimentAnalyzer("English", natural.PorterStemmer, "afinn");
const tokenizer = new natural.WordTokenizer();

// --- FUNCIÓN DE ANÁLISIS DE CONTEXTO ---
// @desc    Analizar el contexto general de una canción completa
// @route   POST /api/emotion/context
const analyzeContext = asyncHandler(async (req, res) => {
    const { text } = req.body;
    if (!text) {
        res.status(400);
        throw new Error('No se proporcionó texto para analizar el contexto');
    }

    const normalizedText = normalizeText(text);
    const words = tokenizer.tokenize(normalizedText);
    
    const emotionFrequency = {};

    // Contar la frecuencia de cada emoción basada en palabras clave
    for (const word of words) {
        const emotion = keywordToEmotionMap[word];
        if (emotion) {
            emotionFrequency[emotion] = (emotionFrequency[emotion] || 0) + 1;
        }
    }

    // Ordenar las emociones por frecuencia
    const sortedEmotions = Object.keys(emotionFrequency).sort((a, b) => emotionFrequency[b] - emotionFrequency[a]);

    // Devolver las 3 emociones más dominantes como contexto
    const context = sortedEmotions.slice(0, 3);

    res.json({ context });
});


// --- FUNCIÓN DE ANÁLISIS DE PÁRRAFO ---
// @desc    Analizar la emoción de un párrafo usando contexto
// @route   POST /api/emotion
const analyzeEmotion = asyncHandler(async (req, res) => {
    const { text, context = [] } = req.body;
    if (!text) {
        res.status(400);
        throw new Error('No se proporcionó texto para analizar');
    }

    const normalizedText = normalizeText(text);
    const words = tokenizer.tokenize(normalizedText);
    let detectedEmotion = null;

    // 1. Búsqueda de coincidencia directa y prioritaria
    for (const word of words) {
        const emotion = keywordToEmotionMap[word];
        if (emotion) {
            detectedEmotion = emotion;
            break; // Encontramos una, es la más importante
        }
    }

    // 2. Si no hay coincidencia directa, buscar una que coincida con el contexto general
    if (!detectedEmotion && context.length > 0) {
        for (const word of words) {
            const emotion = keywordToEmotionMap[word];
            if (emotion && context.includes(emotion)) {
                detectedEmotion = emotion;
                break; // Encontramos una relevante para el contexto
            }
        }
    }

    // 3. Si aún no hay nada, usar el análisis de sentimiento como fallback
    if (!detectedEmotion) {
        const sentimentScore = analyzer.getSentiment(words);
        if (sentimentScore > 0.1) {
            detectedEmotion = 'Alegría';
        } else if (sentimentScore < -0.1) {
            detectedEmotion = 'Tristeza';
        } else {
            detectedEmotion = 'Neutral';
        }
    }

    res.json({ emotion: detectedEmotion });
});

module.exports = {
  analyzeEmotion,
  analyzeContext,
};
