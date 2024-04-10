const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  year: Number,
  genre: String,
  ratings: [{ userId: String, grade: Number }],
  averageRating: { type: Number, default: 0 }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;