const mongoose = require('mongoose');

const songSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    artist: {
      type: String,
      required: true,
    },
        lyrics: {
          type: String,
          required: [true, [true, 'Please add lyrics']],
        },
        completedSessions: {
          type: Number,
          required: false,
          default: 0,
        },
        // ... other fields might be here
    completedSessions: {
      type: Number,
      default: 0,
    },
    examLevel: {
      type: Number,
      default: 0,
    },
    nextExamAvailableAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Song = mongoose.model('Song', songSchema);

module.exports = Song;