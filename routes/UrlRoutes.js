/**
 * @swagger
 * tags:
 *   name: URL
 *   description: URL shortening and redirection
 */

const express = require('express');
const UrlController = require('../controllers/UrlController');

const router = express.Router();

/**
 * @swagger
 * /api/encode:
 *   post:
 *     summary: Shorten a long URL
 *     tags: [URL]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - longUrl
 *             properties:
 *               longUrl:
 *                 type: string
 *                 example: "https://example.com"
 *     responses:
 *       200:
 *         description: Short URL returned
 */
router.post('/api/encode', UrlController.encodeUrl);

/**
 * @swagger
 * /api/decode:
 *   post:
 *     summary: Decode a short URL back to long URL
 *     tags: [URL]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - shortUrl
 *             properties:
 *               shortUrl:
 *                 type: string
 *                 example: "http://localhost:5000/abc123"
 *     responses:
 *       200:
 *         description: Long URL returned
 */
router.post('/api/decode', UrlController.decodeUrl);

/**
 * @swagger
 * /api/statistic/{code}:
 *   get:
 *     summary: Get statistics of a short URL
 *     tags: [URL]
 *     parameters:
 *       - in: path
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: Short URL code
 *     responses:
 *       200:
 *         description: Statistics returned
 */
router.get('/api/statistic/:code', UrlController.getStatistics);

/**
 * @swagger
 * /api/list:
 *   get:
 *     summary: List all shortened URLs
 *     tags: [URL]
 *     responses:
 *       200:
 *         description: List of URLs
 */
router.get('/api/list', UrlController.listUrls);

/**
 * @swagger
 * /{code}:
 *   get:
 *     summary: Redirect to the original long URL
 *     tags: [URL]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirecting to long URL
 */
router.get('/:code', UrlController.redirectUrl);

module.exports = router;
