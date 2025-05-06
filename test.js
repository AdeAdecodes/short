const request = require('supertest');
const app = require('../app'); // assuming your Express app is in app.js
const db = require('../models/db'); // assuming db.js has both PostgreSQL and in-memory setup

describe('UrlController', () => {
  afterAll(async () => {
    // Optionally clean up after tests (for PostgreSQL or reset in-memory state)
    if (!db.isInMemory) {
      await db.query('DELETE FROM urls');
      await db.query('DELETE FROM visits');
    }
  });

  describe('POST /encode', () => {
    it('should encode a long URL to a short URL', async () => {
      const response = await request(app)
        .post('/api/encode')
        .send({ longUrl: 'https://example.com' });

      expect(response.status).toBe(201);
      expect(response.body.shortUrl).toMatch(/\/[a-zA-Z0-9]{6}$/);
      expect(response.body.isNew).toBe(true);
      expect(response.body.message).toBe('New short URL created');
    });

    it('should return an existing short URL if the long URL was already encoded', async () => {
      // First encode the URL
      await request(app)
        .post('/api/encode')
        .send({ longUrl: 'https://example.com' });

      const response = await request(app)
        .post('/api/encode')
        .send({ longUrl: 'https://example.com' });

      expect(response.status).toBe(200);
      expect(response.body.shortUrl).toMatch(/\/[a-zA-Z0-9]{6}$/);
      expect(response.body.isNew).toBe(false);
      expect(response.body.message).toBe('URL already shortened');
    });

    it('should return a 400 error if no longUrl is provided', async () => {
      const response = await request(app)
        .post('/api/encode')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('longUrl is required');
    });
  });

  describe('POST /decode', () => {
    it('should decode a short URL to the original long URL', async () => {
      // First, create a short URL for the test
      const encodeResponse = await request(app)
        .post('/api/encode')
        .send({ longUrl: 'https://example.com' });

      const shortUrl = encodeResponse.body.shortUrl;
      const code = shortUrl.split('/').pop();

      const response = await request(app)
        .post('/api/decode')
        .send({ shortUrl: shortUrl });

      expect(response.status).toBe(200);
      expect(response.body.longUrl).toBe('https://example.com');
    });

    it('should return a 404 error if the short URL does not exist', async () => {
      const response = await request(app)
        .post('/api/decode')
        .send({ shortUrl: 'https://example.com/abcdef' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Short URL not found');
    });

    it('should return a 400 error if no shortUrl is provided', async () => {
      const response = await request(app)
        .post('/api/decode')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('shortUrl is required');
    });
  });
});
