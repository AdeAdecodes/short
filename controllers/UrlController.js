// controllers/UrlController.js
const { nanoid } = require('nanoid');
const db = require('../models/db');
const UAParser = require('ua-parser-js');
const fetch = require('node-fetch');

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
  
    try {
      // Check if the long URL already exists
      const existing = await db.query('SELECT code FROM urls WHERE long_url = $1', [longUrl]);
  
      if (existing.rows.length > 0) {
        return res.status(200).json({
          shortUrl: `${process.env.BASE_URL}/${existing.rows[0].code}`,
          isNew: false,
          message: 'URL already shortened'
        });
      }
  
      const code = nanoid(6);
      await db.query('INSERT INTO urls(code, long_url) VALUES($1, $2)', [code, longUrl]);
  
      return res.status(201).json({
        shortUrl: `${process.env.BASE_URL}/${code}`,
        isNew: true,
        message: 'New short URL created'
      });
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
      // Get long URL and ID
      const { rows } = await db.query('SELECT id, long_url FROM urls WHERE code = $1', [code]);
      if (rows.length === 0) return res.status(404).send('URL not found');
  
      const { id: urlId, long_url: longUrl } = rows[0];
      res.redirect(longUrl); // Redirect immediately
  
      // Collect metadata
      const ip = (req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress)?.trim();
      const userAgent = req.get('User-Agent') || '';
      const referrer = req.get('Referrer') || req.get('Referer') || '';
  
      const { getDevice, getBrowser, getOS } = new UAParser(userAgent);
      const deviceType = getDevice().type || 'desktop';
      const browser = getBrowser().name || 'Unknown';
      const operatingSystem = getOS().name || 'Unknown';
  
      // Location (GeoIP) lookup
      const realIP = /^::1|127\.|192\.|::ffff:127\./.test(ip) ? '8.8.8.8' : ip;
      let location = null;
  
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2000);
        const geoRes = await fetch(`https://ipapi.co/${realIP}/country_name/`, { signal: controller.signal });
        location = await geoRes.text();
        clearTimeout(timeout);
      } catch (e) {
        console.warn('GeoIP lookup failed:', e.message);
      }
  
      // Save visit asynchronously
      db.query(
        `INSERT INTO visits (short_url_id, ip, user_agent, referrer, location, device_type, browser, operating_system)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [urlId, ip, userAgent, referrer || null, location || null, deviceType, browser, operatingSystem]
      ).catch(console.error);
  
    } catch (err) {
      console.error('Redirect error:', err);
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
