// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Setting up CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Body-parser middleware to parse JSON data in request body
app.use(express.json());

// Import routes and set up API endpoints
const bookRoutes = require('./routes/bookRoutes');
app.use('/api/books', bookRoutes); // routes prefix

module.exports = app;
