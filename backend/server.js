require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); // Add this line
const app = express();
const PORT = process.env.PORT || 3000;

//MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.log("Failed to connect to MongoDB", err));


// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// If allowed: View engine for EJS (for dynamic HTML pages).
//app.set('view engine', 'ejs');
//If not: serve static files
app.use(express.static(path.join(__dirname, 'views')));

// Routes with EJS
/*
app.get('/', (req, res) => res.render('index'));
app.get('/book/:id', (req, res) => res.render('book'));
app.get('/create', (req, res) => res.render('create'));
app.get('/login', (req, res) => res.render('login'));
*/

//Routes with static files: 
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'index.html')));
app.get('/book/:id', (req, res) => res.sendFile(path.join(__dirname, 'views', 'book.html')));
app.get('/create', (req, res) => res.sendFile(path.join(__dirname, 'views', 'create.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'views', 'login.html')));

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

//import & use router
const bookRoutes = require('./routes/bookRoutes');
app.use('/books', bookRoutes);
