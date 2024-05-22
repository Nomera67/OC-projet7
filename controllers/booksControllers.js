const Book = require('../models/Book');
const fs = require('fs');
const path = require('path');

// Controller to get all books
exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller to get a specific book by his id
exports.getBookById = async (req, res) => {
    try {
        // Try to find the book by his id and answer with the book when found
        const book = await Book.findById(req.params.id);
        if (!book) res.status(404).json({ message: 'Book not found' });
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Controller to get the three best rated books
exports.getBestRatedBooks = async (req, res) => {
    try {
        // Find the three books with best rating. averageRating -1 is to sort books in decreasing order
        const books = await Book.find().sort({ averageRating: -1 }).limit(3);
        if (books.length === 0) {
            return res.status(404).json({ message: "No highly rated books found." });
        }
        res.json(books);
    } catch (error) {
        console.error('Failed to retrieve best rated books:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

// Controller to creat a book
exports.createBook = async (req, res) => {
    try {
        if (typeof req.body.book === 'string') {
            req.body.book = JSON.parse(req.body.book);
        }

        const { userId, title, author, year, genre, ratings, averageRating } = req.body.book;

        // Create a book with requested informations
        const newBook = new Book({
            title,
            author,
            year: parseInt(year, 10),
            genre,
            ratings,
            averageRating,
            imageUrl: req.file.url,
            userId
        });

        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        console.error('Erreur lors de la création du livre:', error);
        res.status(500).json({ message: 'Erreur lors de la création du livre: ' + error.message });
    }
};

// Controller to update a book by his ID
exports.updateBookById = async (req, res) => {
    try {
        // Find the book with his ID
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        const oldImagePath = book.imageUrl ? path.join(__dirname, '../images', path.basename(book.imageUrl)) : null;

        // Update properties of the book
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.year = req.body.year || book.year;
        book.genre = req.body.genre || book.genre;

        if (req.file) {
            const baseUrl = `${req.protocol}://${req.get('host')}`;
            book.imageUrl = `${baseUrl}/public/${req.file.filename}`;
        }

        await book.save();

        // Delete old picture if a new one is upload
        if (req.file && oldImagePath && fs.existsSync(oldImagePath)) {
            fs.unlink(oldImagePath, (err) => {
                if (err) {
                    console.error('Failed to delete old image:', err);
                }
            });
        }

        res.json(book);
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).json({ message: 'Error updating book: ' + error.message });
    }
};

// Controller to delete a book by his ID
exports.deleteBookById = async (req, res) => {
    try {
        // Find the book with his ID
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Get the associated path of his picture
        const imagePath = book.imageUrl ? path.join(__dirname, '../images', path.basename(book.imageUrl)) : null;

        // Delete the picture of the book
        if (imagePath && fs.existsSync(imagePath)) {
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Failed to delete image:', err);
                }
            });
        }

        res.status(200).json({ message: 'Book deleted' });
    } catch (error) {
        console.error('Error deleting book:', error);
        res.status(500).json({ message: 'Error deleting book: ' + error.message });
    }
};

// // Controller to add rating to a book
exports.addRatingToBook = async (req, res) => {
    try {
        // Find the book by its ID
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).send('Book not found');
        }

        // Extract userId and rating from the request body
        const { userId, rating } = req.body;

        // Check if userId and rating are present
        if (!userId || rating === undefined) {
            return res.status(400).send('Missing userId or rating');
        }

        // Check if the rating is within the acceptable range
        if (rating < 0 || rating > 5) {
            return res.status(400).send('Rating must be between 0 and 5');
        }

        // Check if the user has already rated this book
        const existingRating = book.ratings.find(r => r.userId.toString() === userId);
        if (existingRating) {
            return res.status(400).send('User has already rated this book');
        }

        // Add the new rating to the book
        book.ratings.push({ userId, grade: rating });
        // Calculate the new average rating
        book.averageRating = book.ratings.reduce((acc, curr) => acc + curr.grade, 0) / book.ratings.length;

        await book.save();
        res.status(201).json(book);
    } catch (error) {
        console.error('Error in addRatingToBook:', error);
        res.status(500).json({ message: error.message });
    }
};

