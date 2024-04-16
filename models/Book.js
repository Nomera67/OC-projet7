const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  year: { type: Number, required: true},
  genre: { type: String, required: true},
  ratings: [{ userId: String, grade: Number }],
  averageRating: { type: Number, default: 0, required: true },
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
