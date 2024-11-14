// controllers/bookController.js
const Book = require('../models/Book');
const fs = require('fs');


// Get all books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch books', error });
  }
};

// Get a single book by ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch book', error });
  }
};

// Get top 3 books with best rating
exports.getBestRatedBooks = async (req, res, next) => {
  try {
    const books = await Book.find().sort({ averageRating: -1 }).limit(3);
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch best rated books', error });
  }
};

// Create a new book
exports.createBook = async (req, res, next) => {
  try {
    const bookData = req.file ? JSON.parse(req.body.book) : req.body;

    delete bookData.userId;

    if (bookData.ratings) {
      bookData.ratings = bookData.ratings.map(ratingObj => ({
        userId: ratingObj.userId,
        rating: ratingObj.grade
      }));
    }

    const newBook = new Book({
      ...bookData,
      userId: req.userId,
      imageUrl: req.file ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}` : null
    });

    if (bookData.ratings && bookData.averageRating !== undefined) {
      newBook.ratings = bookData.ratings;
      newBook.averageRating = bookData.averageRating;
    }

    await newBook.save();

    res.status(201).json({ message: 'Book created successfully', book: newBook });
  } catch (error) {
    console.error("Error during book creation:", error);
    res.status(400).json({ message: 'Failed to create book', error });
  }
};

// Update a book by ID
exports.updateBook = async (req, res, next) => {
  try {
    const updateData = req.file 
      ? { ...JSON.parse(req.body.book), imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` }
      : { ...req.body };

    delete updateData.userId;

    const book = await Book.findById(req.params.id);

    if (!book) return res.status(404).json({ message: 'Book not found' });

    // check user is author of the post
    if (book.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized to modify this book' });
    }

    Object.assign(book, updateData);
    await book.save();

    res.status(200).json({ message: 'Book updated successfully', book });
  } catch (error) {
    res.status(400).json({ message: 'Failed to update book', error });
  }
};

// Delete a book by ID
exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    if (book.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this book' });
    }

    const filename = book.imageUrl.split('/images/')[1];
    
    fs.unlink(`images/${filename}`, async (err) => {
      if (err) {
        console.error('Failed to delete image:', err);
        return res.status(500).json({ message: 'Failed to delete image', error: err });
      }

      await book.deleteOne();
      res.status(200).json({ message: 'Book deleted successfully' });
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete book', error });
  }
};


// Add a rating to a book by ID
exports.addRating = async (req, res, next) => {
  try {
    const { rating } = req.body;
    const userId = req.userId;

    if (rating < 0 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 0 and 5' });
    }

    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const existingRating = book.ratings.find(r => r.userId === userId);
    if (existingRating) {
      return res.status(400).json({ message: 'User has already rated this book' });
    }

    // Add book rating
    book.ratings.push({ userId, rating });

    // Average book rating
    const totalRating = book.ratings.reduce((sum, r) => sum + r.rating, 0);
    book.averageRating = totalRating / book.ratings.length;

    await book.save();

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add rating', error });
  }
};
