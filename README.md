# URL Shortener Microservice

This is a URL shortener microservice that allows you to shorten long URLs and then access the original URL by visiting the shortened link.

## Features

- Shorten a long URL by sending a POST request.
- Redirect to the original URL by visiting the shortened URL.
- Stores the mappings of short URLs to original URLs in-memory (can be upgraded to use a database).

## Endpoints

### **POST /api/shorten**
Shorten a given URL.

#### Example Request:
```json
{
  "longUrl": "https://www.example.com"
}
