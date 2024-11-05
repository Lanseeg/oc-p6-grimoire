// routes/bookRoutes.js

const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// Route to get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books); // Send books data as JSON
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch books", error });
  }
});

// Route to create a new book
router.post('/create', async (req, res) => {
  try {
    const { title, author, year, genre } = req.body;
    const book = new Book({ title, author, year, genre });
    await book.save();
    res.status(201).json({ message: "Book created successfully", book }); // Send the created book as JSON
  } catch (error) {
    res.status(400).json({ message: "Failed to create book", error });
  }
});

// Route to get a single book by ID
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.status(200).json(book); // Send the single book data as JSON
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch book", error });
  }
});

module.exports = router;
