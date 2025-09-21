const emotionKeywordMap = {
    Amor: ['amor', 'amo', 'amado', 'amada', 'querer', 'quiero', 'corazón', 'cariño', 'adoro'],
    Desamor: ['desamor', 'roto', 'rompió', 'terminó', 'olvido', 'olvidar', 'dejarte', 'dejar'],
    Tristeza: ['triste', 'tristeza', 'pena', 'llorar', 'lloro', 'lágrimas', 'desdicha'],
    Melancolía: ['melancolía', 'melancólico', 'nostalgia', 'añoranza', 'recuerdo', 'extraño'],
    Dolor: ['dolor', 'duele', 'herida', 'sufrimiento', 'sufrir', 'agonía'],
    Nostalgia: ['nostalgia', 'recuerdos', 'ayer', 'pasado', 'añoro'],
    Soledad: ['soledad', 'solo', 'sola', 'vacío', 'nadie'],
    Esperanza: ['esperanza', 'espero', 'fe', 'mañana', 'futuro', 'sueño'],
    Frustración: ['frustración', 'frustrado', 'impotencia', 'no puedo', 'inútil'],
    Celos: ['celos', 'celoso', 'celosa', 'envidia'],
    'Rabia / enojo': ['rabia', 'enojo', 'ira', 'odio', 'furor', 'maldigo', 'grito'],
    Culpa: ['culpa', 'culpable', 'mi error', 'fallé'],
    Arrepentimiento: ['arrepiento', 'arrepentido', 'perdón', 'lo siento'],
    Perdón: ['perdón', 'perdonar', 'disculpa', 'lo siento'],
    Gratitud: ['gracias', 'gratitud', 'agradezco', 'agradecido'],
    Pasión: ['pasión', 'apasionado', 'fuego', 'intenso'],
    Deseo: ['deseo', 'desear', 'anhelo', 'piel', 'cuerpo', 'labios'],
    Alegría: ['alegría', 'alegre', 'risa', 'sonrisa', 'fiesta', 'celebrar'],
    Felicidad: ['felicidad', 'feliz', 'dicha', 'gozo', 'plenitud'],
    'Felicidad efímera / fugaz': ['momento', 'instante', 'fugaz', 'efímero', 'pasajero'],
    Orgullo: ['orgullo', 'orgulloso', 'frente en alto', 'dignidad'],
    Vergüenza: ['vergüenza', 'pena', 'humillación', 'esconder'],
    Miedo: ['miedo', 'temor', 'terror', 'pánico', 'asustado'],
    Ansiedad: ['ansiedad', 'nervios', 'inquietud', 'preocupación'],
    Inseguridad: ['inseguridad', 'inseguro', 'duda', 'no sé'],
    Humildad: ['humildad', 'humilde', 'sencillo', 'sin pretensiones'],
    Valentía: ['valentía', 'valiente', 'coraje', 'sin miedo', 'fuerza'],
    'Espera / paciencia': ['espero', 'esperar', 'paciencia', 'calma', 'tiempo'],
    Desesperación: ['desesperación', 'desesperado', 'sin salida', 'grito'],
    Angustia: ['angustia', 'ahogo', 'nudo en la garganta', 'dolor en el pecho'],
    Lamento: ['lamento', 'lamentar', 'ojalá', 'si hubiera'],
    Admiración: ['admiración', 'admiro', 'ídolo', 'ejemplo'],
    Devoción: ['devoción', 'devoto', 'fe', 'creo en ti'],
    Lealtad: ['lealtad', 'leal', 'fiel', 'siempre a tu lado'],
    Traición: ['traición', 'traicionar', 'mentira', 'engaño', 'infiel'],
    Confianza: ['confianza', 'confío', 'creo en ti', 'fe'],
    Desconfianza: ['desconfianza', 'no confío', 'dudo', 'sospecha'],
    Desilusión: ['desilusión', 'decepción', 'esperaba más', 'me fallaste'],
    Abandono: ['abandono', 'abandonado', 'me dejaste', 'te fuiste'],
    Compasión: ['compasión', 'piedad', 'empatía', 'entiendo tu dolor'],
    'Autoestima / estima personal': ['autoestima', 'me quiero', 'valgo', 'soy fuerte'],
    Honestidad: ['honestidad', 'honesto', 'verdad', 'sincero'],
    'Lágrimas / llanto': ['lágrimas', 'llanto', 'llorar', 'sollozo'],
    Resignación: ['resignación', 'aceptación', 'qué se le va a hacer', 'así es la vida'],
    Libertad: ['libertad', 'libre', 'volar', 'cadenas rotas'],
    'Soñar / anhelo': ['sueño', 'soñar', 'anhelo', 'desearía'],
    'Reflección / introspección': ['reflexión', 'pienso', 'mi mente', 'dentro de mí'],
    'Esperanza rota': ['esperanza rota', 'sueños rotos', 'ilusión perdida'],
    Resentimiento: ['resentimiento', 'rencor', 'no olvido', 'me la pagarás'],
    Redención: ['redención', 'salvación', 'segunda oportunidad', 'renacer'],
};

// Función para normalizar texto (quitar acentos, minúsculas, etc.)
const normalizeText = (text) => {
    return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
};

// Invertir el mapa para buscar emociones por palabra clave
const keywordToEmotionMap = {};
for (const emotion in emotionKeywordMap) {
    for (const keyword of emotionKeywordMap[emotion]) {
        keywordToEmotionMap[normalizeText(keyword)] = emotion;
    }
}

module.exports = { keywordToEmotionMap, normalizeText };
