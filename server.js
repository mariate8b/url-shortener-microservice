const express = require('express');
const shortid = require('shortid');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

const urlDatabase = {}; // Store URL mappings

app.use(bodyParser.json());

// POST: Create a short URL
app.post("/api/shorturl", (req, res) => {
    const { url } = req.body;
  
    // Validate URL format
    if (!validUrl.isUri(url)) {
      return res.json({ error: "invalid url" });
    }
  
    const short_url = shortid.generate();
    urlDatabase[short_url] = url; // Store URL in database or in-memory object
    res.json({ original_url: url, short_url: short_url });
  });
  

// GET: Redirect to the original URL
app.get("/api/shorturl/:short_url", (req, res) => {
    const shortUrlCode = req.params.short_url;
  
    // Check if the short URL exists in the database
    if (urlDatabase[shortUrlCode]) {
      return res.redirect(urlDatabase[shortUrlCode]);
    } else {
      return res.json({ error: "No short URL found for the given input" });
    }
  });
  

app.listen(port, () => {
  console.log(`URL shortener listening at http://localhost:${port}`);
});
