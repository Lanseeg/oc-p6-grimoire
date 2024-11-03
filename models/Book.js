const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  year: { type: Number, required: true },
  genre: { type: String, required: true },
  image: { type: String },
  ratings: { type: [Number], default: [] } // Array to store ratings
});

module.exports = mongoose.model('Book', bookSchema);
