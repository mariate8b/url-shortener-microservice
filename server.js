const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const express = require('express');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log the Mongo URI to ensure it’s loaded correctly
console.log('Mongo URI:', process.env.MONGO_URI);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Define URL schema
const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortUrl: { type: Number, required: true, unique: true },
});

const URL = mongoose.model('URL', urlSchema);

// Counter for generating short URLs
let urlCounter = 1;

// API Endpoints

// POST: Create a short URL
app.post('/api/shorturl', async (req, res) => {
  const { url } = req.body;

  // Validate URL format
  const urlRegex = /^(https?:\/\/)[^\s$.?#].[^\s]*$/;
  if (!urlRegex.test(url)) {
    return res.json({ error: 'invalid url' });
  }

  try {
    // Check if the URL already exists
    const existingUrl = await URL.findOne({ originalUrl: url });
    if (existingUrl) {
      return res.json({ original_url: existingUrl.originalUrl, short_url: existingUrl.shortUrl });
    }

    // Save new URL
    const newUrl = new URL({ originalUrl: url, shortUrl: urlCounter++ });
    await newUrl.save();

    res.json({ original_url: newUrl.originalUrl, short_url: newUrl.shortUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET: Redirect to original URL
app.get('/api/shorturl/:shortId', async (req, res) => {
  const { shortId } = req.params;

  try {
    const urlEntry = await URL.findOne({ shortUrl: Number(shortId) });
    if (urlEntry) {
      res.redirect(urlEntry.originalUrl);
    } else {
      res.status(404).json({ error: 'No short URL found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
