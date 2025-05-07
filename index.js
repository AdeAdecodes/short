require('dotenv').config();
const express = require('express');
const urlRoutes = require('./routes/UrlRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

app.use(cors());
app.use(express.json());

// Swagger documentation route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/', (req, res) => {
  res.status(200).send({ status: 200, message: 'Welcome to shortlink API Version 1' });
});

app.use('/', urlRoutes);



app.listen(PORT, () => {
  console.log(`🚀 Server running at ${BASE_URL}`);
  console.log(`📘 API docs at ${BASE_URL}/api-docs`);
});

module.exports = app;
