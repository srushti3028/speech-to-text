const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const Transcription = require('../models/Transcription');
const transcribeAudio = require('../services/transcriptionService');

// UPLOAD AUDIO FILE + TRANSCRIBE
router.post('/upload', upload.single('audio'), async (req, res) => {

  console.log("REQ FILE:", req.file);
  console.log("REQ BODY:", req.body);


  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const transcription = await transcribeAudio(
      req.file.path,
      req.body.service || 'openai',
      req.body.language || 'en'
    );

    // Save to DB
    const saved = await Transcription.create({
      filename: req.file.originalname,
      transcription,
      createdAt: new Date()
    });

    return res.status(200).json(saved);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Transcription failed' });
  }
});

router.get('/', async (req, res) => {
  try {
    const list = await Transcription.find().sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transcriptions' });
  }
});

module.exports = router;
