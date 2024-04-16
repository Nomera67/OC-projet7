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

    const data = {
        title: req.body.title,
        author: req.body.author,
        year: req.body.year, 
        genre: req.body.genre
    };

    try {
        const newBook = new Book(data);
        const savedBook = await newBook.save();
        res.status(201).json(savedBook);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
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
        const { userId, rating } = req.body;
        const existingRating = book.ratings.find(r => r.userId === userId);
        if (existingRating) {
            res.status(400).json({ message: "User has already rated this book" });
        } else {
            book.ratings.push({ userId, grade: rating });
            book.averageRating = book.ratings.reduce((acc, curr) => acc + curr.grade, 0) / book.ratings.length;
            await book.save();
            res.status(201).json(book);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
