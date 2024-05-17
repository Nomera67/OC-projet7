const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, 'config', '.env') });

// Use CORS to allow cross-origin requests. Needed to test on same plateform front-end and back-end
app.use(cors());
app.use(express.json());

// Definition of port use by back-end. Use the on in .env file or 4000 by default
const port = process.env.PORT || 4000;
const mongoURI = process.env.MONGO_URI;

// Routes for books and authentification
const bookRoutes = require('./routes/books');
const authRoutes = require('./routes/auth');

// Use prefix for routes 
app.use('/api/books', bookRoutes);
app.use('/api/auth', authRoutes);
app.use('/public', express.static(path.join(__dirname, 'images')));

// Connection to MongoDB Atlas 
mongoose.connect(mongoURI)
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('Could not connect to MongoDB Atlas', err));

app.listen(port, () => console.log(`Server running on port ${port}`));
