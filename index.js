const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(express.json());
const port = process.env.PORT || 4000;
const mongoURI = process.env.MONGO_URI;
const bookRoutes = require('./routes/books');
const authRoutes = require('./routes/auth');

app.use('/api/books', bookRoutes);
app.use('/api/auth', authRoutes);

mongoose.connect(mongoURI)
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('Could not connect to MongoDB Atlas', err));

app.listen(port, () => console.log(`Server running on port ${port}`));
