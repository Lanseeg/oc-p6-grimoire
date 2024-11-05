const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// Route to get all books
router.get('/', async (req, res) => {
  const books = await Book.find();
  res.render('index', { books });
});

// Route to create a new book
router.post('/create', async (req, res) => {
  const { title, author, year, genre } = req.body;
  const book = new Book({ title, author, year, genre });
  await book.save();
  res.redirect('/');
});

// Route to get a single book by ID
router.get('/:id', async (req, res) => {
  const book = await Book.findById(req.params.id);
  res.render('book', { book });
});

module.exports = router;
