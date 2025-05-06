// routes/urlRoutes.js
const express = require('express');
const UrlController = require('../controllers/UrlController');

const router = express.Router();

// API Endpoints
router.post('/api/encode', UrlController.encodeUrl);
router.post('/api/decode', UrlController.decodeUrl);
router.get('/api/statistic/:code', UrlController.getStatistics);
router.get('/api/list', UrlController.listUrls);

// Redirect endpoint (last so it doesn't interfere with API routes)
router.get('/:code', UrlController.redirectUrl);

module.exports = router;
