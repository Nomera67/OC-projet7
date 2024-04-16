const express = require('express');
const router = express.Router();
const booksController = require('../controllers/booksController');


// Get array of books
router.get('/', booksController.getAllBooks);

// Create a new book
router.post('/', booksController.createBook);

// Get a book by his id
router.get('/:id', booksController.getBookById);

// Update a book by his id
router.put('/:id', booksController.updateBookById);

// Delete a book by his id
router.delete('/:id', booksController.deleteBookById);

// Rate a book by his id
router.post('/:id/rating', booksController.addRatingToBook);

module.exports = router;
