const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const noteSchema = new mongoose.Schema({
  noteId: { type: String, required: true, unique: true, default: uuidv4 }, 
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  subject: { type: String, required: true },
  createdBy: { type: String, required: true },
  lastEditedBy: { type: String, required: true },
  lastEditedAt: { type: Date, required: true, default: Date.now },
  createdAt: { type: Date, required: true, default: Date.now },
  collaborators: { type: [String], default: [] },
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
