// app.js
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');

const app = express();

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Book Rating API!' });
  });
  

// Setup CORS headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

// Body-parser middleware to parse JSON data in request body
app.use(express.json()); // Middleware for JSON data

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

module.exports = app;
