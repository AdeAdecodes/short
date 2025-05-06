// controllers/UrlController.js
const { nanoid } = require('nanoid');
const db = require('../models/db');

/**
 * @class UrlController
 * @description Handles all URL shortening operations
 */
class UrlController {
  /**
   * Encodes a long URL to a short one
   */
  static async encodeUrl(req, res) {
    const { longUrl } = req.body;
    if (!longUrl) {
      return res.status(400).json({ error: 'longUrl is required' });
    }
    const code = nanoid(6);
    try {
      await db.query('INSERT INTO urls(code, long_url) VALUES($1, $2)', [code, longUrl]);
      return res.status(201).json({ shortUrl: `${process.env.BASE_URL}/${code}` });
    } catch (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
  }

  /**
   * Decodes a short URL to the original long URL
   */
  static async decodeUrl(req, res) {
    const { shortUrl } = req.body;
    if (!shortUrl) {
      return res.status(400).json({ error: 'shortUrl is required' });
    }

    const code = shortUrl.split('/').pop();
    try {
      const result = await db.query('SELECT long_url FROM urls WHERE code = $1', [code]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Short URL not found' });
      return res.json({ longUrl: result.rows[0].long_url });
    } catch (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
  }

  /**
   * Redirects a short URL to its original long URL
   */
  static async redirectUrl(req, res) {
    const { code } = req.params;
    try {
      const result = await db.query('UPDATE urls SET visits = visits + 1 WHERE code = $1 RETURNING long_url', [code]);
      if (result.rows.length === 0) return res.status(404).send('URL not found');
      res.redirect(result.rows[0].long_url);
    } catch (err) {
      res.status(500).send('Error retrieving URL');
    }
  }

  /**
   * Returns statistics for a given short URL code
   */
  static async getStatistics(req, res) {
    const { code } = req.params;
    try {
      const result = await db.query('SELECT * FROM urls WHERE code = $1', [code]);
      if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
      return res.json(result.rows[0]);
    } catch (err) {
      return res.status(500).json({ error: 'Error fetching stats', details: err.message });
    }
  }

  /**
   * Lists all available URLs
   */
  static async listUrls(req, res) {
    try {
      const result = await db.query('SELECT * FROM urls ORDER BY created_at DESC');
      const formatted = result.rows.map(row => ({
        shortUrl: `${process.env.BASE_URL}/${row.code}`,
        longUrl: row.long_url,
        createdAt: row.created_at,
        visits: row.visits
      }));
      return res.json(formatted);
    } catch (err) {
      return res.status(500).json({ error: 'Error listing URLs', details: err.message });
    }
  }
}

module.exports = UrlController;
