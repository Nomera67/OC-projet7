const Book = require('../models/Book');
const fs = require('fs');
const path = require('path');

exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) res.status(404).json({ message: 'Book not found' });
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getBestRatedBooks = async (req, res) => {
    try {
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

exports.createBook = async (req, res) => {
    try {
        if (typeof req.body.book === 'string') {
            req.body.book = JSON.parse(req.body.book);
        }

        const { userId, title, author, year, genre, ratings, averageRating } = req.body.book;

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

exports.updateBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        const oldImagePath = book.imageUrl;
        const baseUrl = req.protocol + '://' + req.get('host');

        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.year = req.body.year || book.year;
        book.genre = req.body.genre || book.genre;

        if (req.file) {
            book.imageUrl = `${baseUrl}/public/${req.file.filename}`;
        }

        await book.save();

        if (req.file && oldImagePath) {
            const oldImageFullPath = path.join(__dirname, 'public', path.basename(oldImagePath));
            if (fs.existsSync(oldImageFullPath)) {
                fs.unlink(oldImageFullPath, (err) => {
                    if (err) {
                        console.error('Failed to delete old image:', err);
                    }
                });
            }
        }

        res.json(book);
    } catch (error) {
        console.error('Error updating book:', error);
        res.status(500).json({ message: 'Error updating book: ' + error.message });
    }
};

exports.deleteBookById = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) res.status(404).json({ message: 'Book not found' });
        res.status(200).json({ message: 'Book deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addRatingToBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).send('Book not found');
        }

        const { userId, grade } = req.body;

        if (!userId || grade === undefined) {
            return res.status(400).send('Missing userId or grade');
        }

        if (grade < 0 || grade > 5) {
            return res.status(400).send('Grade must be between 0 and 5');
        }

        const existingRating = book.ratings.find(r => r.userId.toString() === userId);
        if (existingRating) {
            return res.status(400).send('User has already rated this book');
        }

        book.ratings.push({ userId, grade });
        book.averageRating = book.ratings.reduce((acc, curr) => acc + curr.grade, 0) / book.ratings.length;

        await book.save();
        res.status(201).json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
