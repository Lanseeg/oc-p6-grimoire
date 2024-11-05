const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const auth = require('../middleware/auth'); 

// Route to get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch books', error });
  }
});

// Route to create a new book (protected)
router.post('/', auth, async (req, res) => {
  try {
    const book = new Book({
      ...req.body,
      userId: req.userId,
      imageUrl: req.body.imageUrl,
      ratings: [],
      averageRating: 0
    });
    await book.save();
    res.status(201).json({ message: 'Book created successfully', book });
  } catch (error) {
    res.status(400).json({ message: 'Failed to create book', error });
  }
});

module.exports = router;
