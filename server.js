const express = require('express');
const shortid = require('shortid');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const urlDatabase = {}; // Store URL mappings

app.use(bodyParser.json());

// POST: Create a short URL
app.post('/api/shorturl', (req, res) => {
  const { url } = req.body;

  // Validate the URL
  const validUrlRegex = /^(https?:\/\/)(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,6}(\/[a-zA-Z0-9-]+)*\/?$/;
  if (!validUrlRegex.test(url)) {
    return res.json({ error: 'invalid url' });
  }

  const shortUrl = shortid.generate();
  urlDatabase[shortUrl] = url;

  res.json({
    original_url: url,
    short_url: shortUrl
  });
});

// GET: Redirect to the original URL
app.get('/api/shorturl/:shortUrl', (req, res) => {
  const shortUrl = req.params.shortUrl;
  const originalUrl = urlDatabase[shortUrl];
  
  if (originalUrl) {
    return res.redirect(originalUrl);
  } else {
    return res.json({ error: 'No short URL found for the given input' });
  }
});

app.listen(port, () => {
  console.log(`URL shortener listening at http://localhost:${port}`);
});
