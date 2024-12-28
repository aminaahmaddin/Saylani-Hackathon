const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Note = require('../modal/note'); 
const router = express.Router();

// Create a new note
router.post('/post', async (req, res) => {
    try {
        const { title, content, subject, createdBy, collaborators } = req.body;

        if (!title || !content || !subject || !createdBy) {
            return res.status(400).json({ error: 'Missing required fields.' });
        }

        const newNote = {
            noteId: uuidv4(),
            title,
            content,
            subject,
            createdBy,
            createdAt: new Date(),
            lastEditedAt: new Date(),
            collaborators,
        };

        const savedNote = await Note.create(newNote);
        res.status(201).json(savedNote);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all notes
router.get('/', async (req, res) => {
    try {
        const notes = await Note.find();
        res.status(200).json(notes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a note
router.put('/', async (req, res) => {
    try {
        const { title, content, subject, createdBy, lastEditedBy } = req.body;

        if (!title || !createdBy) {
            return res.status(400).json({ error: 'Title and createdBy are required to update a note.' });
        }

        const updatedNote = await Note.findOneAndUpdate(
            { title, createdBy },
            { content, subject, lastEditedBy, lastEditedAt: new Date() },
            { new: true }
        );

        if (!updatedNote) return res.status(404).json({ error: 'Note not found.' });
        res.status(200).json(updatedNote);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a note
router.delete('/', async (req, res) => {
    try {
        const { title, createdBy } = req.body;

        if (!title || !createdBy) {
            return res.status(400).json({ error: 'Title and createdBy are required to delete a note.' });
        }

        const deletedNote = await Note.findOneAndDelete({ title, createdBy });
        if (!deletedNote) return res.status(404).json({ error: 'Note not found.' });
        res.status(200).json({ message: 'Note deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
