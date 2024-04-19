const express = require('express');
const router = express.Router();
const booksController = require('../controllers/booksControllers');
const authMiddleware = require('../middleware/authMiddleware')
const upload = require('../middleware/upload');
const optimizeImage = require('../middleware/optimization');


// Get the top 3 best-rated books
router.get('/bestrating', booksController.getBestRatedBooks);

// Get array of books
router.get('/', booksController.getAllBooks);

// Get a book by his id
router.get('/:id', booksController.getBookById);

// Create a new book
router.post('/', authMiddleware, upload.single('image'), optimizeImage, booksController.createBook);

// Update a book by his id
router.put('/:id', authMiddleware, upload.single('image'), optimizeImage, booksController.updateBookById);

// Delete a book by his id
router.delete('/:id', authMiddleware, booksController.deleteBookById);

// Rate a book by his id
router.post('/:id/rating', authMiddleware, booksController.addRatingToBook);

module.exports = router;
