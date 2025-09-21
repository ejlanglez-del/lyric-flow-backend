const asyncHandler = require('express-async-handler');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const Song = require('../models/Song');

// @Telefono moto\Download\Descargar Notion Mobile APK - Última Versión 2024    Get all songs for a user
// @backend\routes\songRoutes.js   GET /api/songs
// @Native Access.lnk Access.lnk  Private
const getSongs = asyncHandler(async (req, res) => {
  const songs = await Song.find({ user: req.user._id });
  res.json(songs);
});

// @Telefono moto\Download\Descargar Notion Mobile APK - Última Versión 2024    Add a new song
// @backend\routes\songRoutes.js   POST /api/songs
// @Native Access.lnk Access.lnk  Private
const addSong = asyncHandler(async (req, res) => {
  const { title, artist, lyrics } = req.body;

  if (!title || !artist || !lyrics) {
    res.status(400);
    throw new Error('Por favor, ingresa todos los campos');
  }

  const song = new Song({
    user: req.user._id,
    title,
    artist,
    lyrics,
  });

  const createdSong = await song.save();
  res.status(201).json(createdSong);
});

// @Telefono moto\Download\Descargar Notion Mobile APK - Última Versión 2024    Delete a song
// @backend\routes\songRoutes.js   DELETE /api/songs/:id
// @Native Access.lnk Access.lnk  Private
const deleteSong = asyncHandler(async (req, res) => {
  const song = await Song.findById(req.params.id);

  if (song) {
    if (song.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('No autorizado para eliminar esta canción');
    }
    await song.deleteOne();
    res.json({ message: 'Canción eliminada' });
  } else {
    res.status(404);
    throw new Error('Canción no encontrada');
  }
});

const updateSongCompletion = asyncHandler(async (req, res) => {
  console.log(`[DEBUG-BACKEND] Llamada a updateSongCompletion para songId: ${req.params.id}`);
  const song = await Song.findById(req.params.id);

  if (song) {
    if (song.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('No autorizado para actualizar esta canción');
    }
    song.completedSessions = (song.completedSessions || 0) + 1;
    const updatedSong = await song.save();
    res.json(updatedSong);
  } else {
    res.status(404);
    throw new Error('Canción no encontrada');
  }
});

// @Telefono moto\Download\Descargar Notion Mobile APK - Última Versión 2024    Update a song
// @backend\routes\songRoutes.js   PUT /api/songs/:id
// @Native Access.lnk  Private
const updateSong = asyncHandler(async (req, res) => {
  const song = await Song.findById(req.params.id);

  if (!song) {
    res.status(404);
    throw new Error('Canción no encontrada');
  }

  // Check if user owns the song
  if (song.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('No autorizado para actualizar esta canción');
  }

  // Update song fields
  song.title = req.body.title || song.title;
  song.artist = req.body.artist || song.artist;
  song.lyrics = req.body.lyrics || song.lyrics;

  const updatedSong = await song.save();
  res.json(updatedSong);
});

// @Telefono moto\Download\Descargar Notion Mobile APK - Última Versión 2024    Transcribe audio
// @backend\routes\songRoutes.js   POST /api/songs/transcribe-audio
// @Native Access.lnk Access.lnk  Private
const transcribeAudio = asyncHandler(async (req, res) => {
  // Check if files were uploaded
  if (!req.files || Object.keys(req.files).length === 0) {
    res.status(400);
    throw new Error('No se ha subido ningún archivo de audio.');
  }

  // Access the uploaded file using its field name 'audio'
  const audioFile = req.files.audio;

  // express-fileupload saves the file to a temporary path
  const audioFilePath = audioFile.tempFilePath;

  try {
    await audioFile.mv(audioFilePath); // Move the file

    // Call the Python script
    const pythonProcess = spawn('python', [ // Changed 'python3' to 'python'
      path.join(__dirname, '../utils/whisper_transcribe.py'),
      audioFilePath
    ]);

    let pythonOutput = '';
    let pythonError = '';

    pythonProcess.stdout.on('data', (data) => {
      pythonOutput += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      pythonError += data.toString();
    });

    pythonProcess.on('close', (code) => {
      // Clean up the uploaded file
      fs.unlink(audioFilePath, (err) => {
        if (err) console.error('Error deleting uploaded file:', err);
      });

      if (code !== 0) {
        console.error('Python script exited with code ' + code);
        console.error('Python stderr: ' + pythonError);
        res.status(500).json({ success: false, error: 'Error al transcribir el audio.' });
        return;
      }

      try {
        const result = JSON.parse(pythonOutput);
        if (result.success) {
          res.status(200).json({ success: true, transcription: result.text });
        } else {
          res.status(500).json({ success: false, error: result.error || 'Error desconocido en la transcripción.' });
        }
      } catch (parseError) { // Corrected catch block
        console.error('Error parsing Python output:', parseError);
        console.error('Python output:', pythonOutput);
        res.status(500).json({ success: false, error: 'Error al procesar la respuesta de transcripción.' });
      }
    });
  } catch (fileMoveError) { // Corrected catch block for file move
    console.error('Error during file move or spawning Python process:', fileMoveError);
    res.status(500).json({ success: false, error: 'Error interno del servidor.' });
  }
});

module.exports = { getSongs, addSong, deleteSong, transcribeAudio, updateSongCompletion, updateSong };