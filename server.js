const express = require("express");
const validUrl = require("valid-url");
const shortid = require("shortid");

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage for URLs (can be replaced with a database)
let urlDatabase = {};

// Middleware to parse JSON requests
app.use(express.json());

// Route for the base URL
app.get("/", (req, res) => {
  res.send({
    message: "Welcome to the URL Shortener Microservice! Use the /api/shorten endpoint.",
  });
});

// Route to shorten the URL
app.post("/api/shorten", (req, res) => {
  const { longUrl } = req.body;

  // Validate the URL
  if (!validUrl.isUri(longUrl)) {
    return res.status(400).json({ error: "Invalid URL" });
  }

  // Generate a short URL
  const shortUrlCode = shortid.generate();
  urlDatabase[shortUrlCode] = longUrl;

  // Return the shortened URL
  const shortUrl = `${req.protocol}://${req.get("host")}/api/${shortUrlCode}`;
  res.json({ original_url: longUrl, short_url: shortUrl });
});

// Route to handle redirection
app.get("/api/:shortUrlCode", (req, res) => {
  const shortUrlCode = req.params.shortUrlCode;

  // Check if the short URL exists
  if (urlDatabase[shortUrlCode]) {
    res.redirect(urlDatabase[shortUrlCode]);
  } else {
    res.status(404).json({ error: "Short URL not found" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
