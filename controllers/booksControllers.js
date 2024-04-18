const Book = require('../models/Book'); 

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
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createBook = async (req, res) => {
    console.log('Body:', req.body);
    console.log('File:', req.file);

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
            imageUrl: req.file.path,
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
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedBook);
    } catch (error) {
        res.status(400).json({ message: error.message });
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
