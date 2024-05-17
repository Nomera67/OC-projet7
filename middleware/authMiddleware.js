const jwt = require('jsonwebtoken');

// Export to be use in other routes 
module.exports = (req, res, next) => {
    try {
        // Get the token on request header 
        const token = req.headers.authorization.split(" ")[1];
        // Decode it with secret code in .env file
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userData = decoded;
        // Go to next fonction
        next();
    } catch (error) {
        // If token is not recognized, send error 401
        return res.status(401).json({ message: 'Authentication failed' });
    }
};