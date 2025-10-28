require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const Feedback = require('./models/Feedback');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/thoughtstream';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Health
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Create feedback
app.post('/api/feedback', async (req, res) => {
  try {
    const { name, rating, comment } = req.body;
    if (!name || !rating) {
      return res.status(400).json({ error: 'Name and rating are required.' });
    }

    const fb = new Feedback({ name, rating, comment });
    const saved = await fb.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all feedback
app.get('/api/feedback', async (req, res) => {
  try {
    const all = await Feedback.find().sort({ createdAt: -1 });
    res.json(all);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Fallback to index
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
