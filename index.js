require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const urlRoutes = require('./routes/UrlRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

app.use(cors());
app.use(express.json());

// Serve static files from React app
app.use(express.static(path.join(__dirname, 'Ui/build')));

// API route
app.get('/', (request, response) => {
  response.status(200).send({ status: 200, message: 'Welcome to shortlink API Version 1' });
});

// API routes for URL handling
app.use('/api', urlRoutes);

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'Ui/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at ${BASE_URL}`);
});
