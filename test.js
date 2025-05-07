const request = require('supertest');
const app = require('./index');

describe('URL Shortener API', () => {
  let shortCode;

  test('POST /api/encode - should shorten a URL', async () => {
    const res = await request(app)
      .post('/api/encode')
      .send({ longUrl: 'https://example.com' });
      console.log('Encode response:', res.body); //
    expect(res.statusCode).toBe(201);
    expect(res.body.shortUrl).toBeDefined();
    shortCode = res.body.shortUrl;
  });

  test('GET /api/decode/ - should retrieve the original URL', async () => {
    const res = await request(app)
    .post(`/api/decode`)
    .send({ shortUrl: shortCode });
    console.log('decode response:', res.body); //
    expect(res.statusCode).toBe(200);
    expect(res.body.longUrl).toBe('https://example.com');
  });
});
