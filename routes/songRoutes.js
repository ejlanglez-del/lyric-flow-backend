const express = require('express');
const router = express.Router();

const songController = require('../controllers/songController');
const { protect } = require('../middleware/authMiddleware');

// /api/songs
router.route('/')
  .get(protect, songController.getSongs)
  .post(protect, songController.addSong);

// /api/songs/:id
router.route('/:id')
  .delete(protect, songController.deleteSong)
  .put(protect, songController.updateSong);

// /api/songs/:id/complete
router.put('/:id/complete', protect, songController.updateSongCompletion);

// /api/songs/:id/complete-exam
router.put('/:id/complete-exam', protect, songController.completeExam);

// /api/songs/:id/lyrics/:paragraphIndex/error
router.post('/:id/lyrics/:paragraphIndex/error', protect, songController.logParagraphError);

// /api/songs/:id/lyrics/:paragraphIndex/errors
router.delete('/:id/lyrics/:paragraphIndex/errors', protect, songController.clearParagraphErrors);

// /api/songs/transcribe-audio
router.route('/transcribe-audio')
  .post(songController.transcribeAudio);

module.exports = router;