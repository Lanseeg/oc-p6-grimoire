// controllers/bookController.js
const Book = require('../models/Book');

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
exports.getBestRatedBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ averageRating: -1 }).limit(3);
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch best rated books', error });
  }
};

// Create a new book
exports.createBook = async (req, res) => {
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
};

// Update a book by ID
exports.updateBook = async (req, res) => {
  try {
    const updateData = req.file 
      ? { ...JSON.parse(req.body.book), imageUrl: req.file.path }
      : { ...req.body };
    
    const book = await Book.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.status(200).json({ message: 'Book updated successfully', book });
  } catch (error) {
    res.status(400).json({ message: 'Failed to update book', error });
  }
};

// Delete a book by ID
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete book', error });
  }
};

// Add a rating to a book by ID
exports.addRating = async (req, res) => {
  try {
    const { userId, rating } = req.body;
    if (rating < 0 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 0 and 5' });
    }
    
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    // Check if user has already rated
    const existingRating = book.ratings.find(r => r.userId === userId);
    if (existingRating) {
      return res.status(400).json({ message: 'User has already rated this book' });
    }

    // Add new rating and update average
    book.ratings.push({ userId, rating });
    book.averageRating = book.ratings.reduce((sum, r) => sum + r.rating, 0) / book.ratings.length;
    
    await book.save();
    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ message: 'Failed to add rating', error });
  }
};
