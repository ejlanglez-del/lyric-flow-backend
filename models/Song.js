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
    lyrics: [{
      paragraph: {
        type: String,
        required: true,
      },
      errorHistory: {
        type: [Date],
        default: [],
      },
    }],
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
