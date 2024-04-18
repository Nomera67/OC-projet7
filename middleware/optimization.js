const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const optimizeImage = async (req, res, next) => {
    if (!req.file) return next();

    const newFilename = `image_${Date.now()}.webp`;
    const outputPath = path.join(__dirname, '../images', newFilename);

    try {
        await sharp(req.file.buffer)
            .resize(800)
            .webp({ quality: 90 })
            .toFile(outputPath);

        req.file.path = outputPath;
        req.file.filename = newFilename;

        next();
    } catch (error) {
        console.error('Error optimizing image', error);
        res.status(500).send('Failed to process image');
    }
};

module.exports = optimizeImage;
